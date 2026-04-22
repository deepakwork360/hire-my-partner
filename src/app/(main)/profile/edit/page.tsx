"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useMyProfile, useUpdateProfile, useUploadPhoto } from '@/modules/profile/hooks';
import { Profile } from '@/modules/profile/types';
import { profileSchema } from '@/modules/profile/validation';
import { toast } from '@/components/ui/toastStore';
import Image from 'next/image';

const EditProfilePage = () => {
  const router = useRouter();
  const { profile, isLoading: isFetching } = useMyProfile();
  const { updateProfile, isLoading: isUpdating } = useUpdateProfile();
  const { uploadPhoto, isLoading: isUploading } = useUploadPhoto();
  
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      setPhotoPreviews(profile.photos || []);
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Profile] as any),
          [child]: child.toLowerCase().includes('age') ? Number(value) : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' ? Number(value) : value
      }));
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setNewPhotos(prev => [...prev, ...files]);
      const previews = files.map(file => URL.createObjectURL(file));
      setPhotoPreviews(prev => [...prev, ...previews]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoPreviews(prev => prev.filter((_, i) => i !== index));
    // Correctly handle removal from newPhotos if needed
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate
      const validation = profileSchema.safeParse({
        ...formData,
        age: Number(formData.age),
      });

      if (!validation.success) {
        toast.error(validation.error.issues[0].message);
        return;
      }

      // 1. Upload new photos first? For simplicity here, let's assume updateProfile handles final photo URLs
      // In a real app, you'd upload them individually and get URLs
      let finalPhotos = photoPreviews.filter(p => !p.startsWith('blob:'));
      
      for (const file of newPhotos) {
        const url = await uploadPhoto(file);
        finalPhotos.push(url);
      }

      await updateProfile({
        ...formData,
        photos: finalPhotos
      } as any);

      router.push('/profile');
    } catch (err) {
      console.error(err);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0066]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-[#1A1A1E] border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Photos Management */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#0E0E10] border border-zinc-800/60 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-white font-bold mb-4 flex items-center justify-between">
                Photos
                <span className="text-zinc-500 text-xs font-normal">{photoPreviews.length}/6</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {photoPreviews.map((photo, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800/60 overflow-hidden relative group">
                    <Image src={photo} alt="Preview" fill className="object-cover" />
                    <button 
                      type="button"
                      onClick={() => removePhoto(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
                {photoPreviews.length < 6 && (
                  <button 
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    className="aspect-square rounded-2xl bg-zinc-900 border-2 border-dashed border-zinc-800 flex flex-col items-center justify-center text-zinc-500 hover:border-[#FF0066]/50 hover:bg-zinc-800/50 transition-all gap-2"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-xs">Add Photo</span>
                  </button>
                )}
              </div>
              <input 
                type="file" 
                multiple 
                hidden 
                ref={photoInputRef} 
                accept="image/*"
                onChange={handlePhotoSelect}
              />
              <p className="text-xs text-zinc-600 mt-4 leading-tight">
                High-quality photos increase your chances of finding a partner.
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0E0E10] border border-zinc-800/60 rounded-3xl p-6 sm:p-8 shadow-xl backdrop-blur-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-zinc-500 text-sm font-medium ml-1">Full Name</label>
                  <input 
                    name="name"
                    value={formData.name || ''}
                    onChange={handleChange}
                    className="w-full bg-bg-base border border-zinc-800 rounded-2xl px-5 py-3.5 outline-none focus:border-[#FF0066] transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-sm font-medium ml-1">Age</label>
                  <input 
                    name="age"
                    type="number"
                    value={formData.age || ''}
                    onChange={handleChange}
                    className="w-full bg-bg-base border border-zinc-800 rounded-2xl px-5 py-3.5 outline-none focus:border-[#FF0066] transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-sm font-medium ml-1">Gender</label>
                  <select 
                    name="gender"
                    value={formData.gender || ''}
                    onChange={handleChange}
                    className="w-full bg-bg-base border border-zinc-800 rounded-2xl px-5 py-3.5 outline-none focus:border-[#FF0066] transition-colors appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-500 text-sm font-medium ml-1">Location</label>
                  <input 
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    className="w-full bg-bg-base border border-zinc-800 rounded-2xl px-5 py-3.5 outline-none focus:border-[#FF0066] transition-colors"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <label className="text-zinc-500 text-sm font-medium ml-1">Bio</label>
                <textarea 
                  name="bio"
                  value={formData.bio || ''}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-bg-base border border-zinc-800 rounded-2xl px-5 py-3.5 outline-none focus:border-[#FF0066] transition-colors resize-none"
                  placeholder="Share something about yourself..."
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={isUpdating || isUploading}
                className="w-full sm:w-auto px-10 py-4 bg-linear-to-r from-[#CF0000] to-[#FF0066] text-white font-bold rounded-2xl shadow-[0_4px_20px_rgba(255,0,102,0.4)] hover:shadow-[0_4px_25px_rgba(255,0,102,0.6)] hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {(isUpdating || isUploading) && (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                )}
                {isUpdating ? 'Saving Changes...' : isUploading ? 'Uploading Photos...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;



