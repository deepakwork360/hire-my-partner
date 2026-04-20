import { useState, useEffect } from "react";
import { profileApi } from "./api";
import { Profile, UpdateProfilePayload } from "./types";
import { toast } from "@/components/ui/toastStore";

export const useMyProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileApi.getMyProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch profile");
        toast.error("Failed to fetch profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, isLoading, error, setProfile };
};

export const useUpdateProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const updateProfile = async (data: UpdateProfilePayload) => {
    setIsLoading(true);
    try {
      const updatedProfile = await profileApi.updateProfile(data);
      toast.success("Profile updated successfully");
      return updatedProfile;
    } catch (err: any) {
      toast.error(err.message || "Update failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { updateProfile, isLoading };
};

export const useUploadPhoto = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadPhoto = async (file: File) => {
    setIsLoading(true);
    try {
      const photoUrl = await profileApi.uploadPhoto(file);
      toast.success("Photo uploaded successfully");
      return photoUrl;
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { uploadPhoto, isLoading };
};
