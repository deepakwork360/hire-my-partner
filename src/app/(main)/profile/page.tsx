"use client";

import React from "react";
import Link from "next/link";
import { useMyProfile } from "@/modules/profile/hooks";
import Image from "next/image";

const ProfilePage = () => {
  const { profile, isLoading } = useMyProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF0066]"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white text-center p-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">No Profile Found</h2>
          <Link
            href="/profile/edit"
            className="px-6 py-3 bg-[#FF0066] rounded-full font-semibold hover:bg-[#CF0000] transition-colors"
          >
            Create Your Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 sm:p-8 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <Link
            href="/profile/edit"
            className="px-6 py-2 bg-[#1A1A1E] border border-zinc-800 rounded-full text-sm font-medium hover:bg-zinc-800 transition-colors"
          >
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Photo Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800/60 relative group shadow-2xl">
              {profile.photos?.[0] ? (
                <Image
                  src={profile.photos[0]}
                  alt={profile.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-zinc-500 gap-2">
                  <svg
                    className="w-12 h-12"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No photos uploaded yet</p>
                </div>
              )}
              {/* Glass Footer Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {profile.name}, {profile.age}
                    </h2>
                    <p className="text-zinc-300 flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-[#FF0066]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {profile.location || "Unknown location"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub photos grid */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800/60 overflow-hidden relative group"
                >
                  {profile.photos?.[idx] ? (
                    <Image
                      src={profile.photos[idx]}
                      alt={`${profile.name} ${idx}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-125"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-800">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Bio Card */}
            <div className="bg-[#0E0E10] border border-zinc-800/60 rounded-3xl p-6 shadow-xl backdrop-blur-xl">
              <h3 className="text-[#FF0066] text-xs font-bold uppercase tracking-widest mb-3">
                About Me
              </h3>
              <p className="text-zinc-300 leading-relaxed text-lg">
                {profile.bio || "Tell prospective partners about yourself!"}
              </p>
            </div>

            {/* Details Grid */}
            <div className="bg-[#0E0E10] border border-zinc-800/60 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/30">
                <span className="text-zinc-500 font-medium">Gender</span>
                <span className="text-white font-semibold capitalize">
                  {profile.gender}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-zinc-800/30">
                <span className="text-zinc-500 font-medium">Age</span>
                <span className="text-white font-semibold">{profile.age}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-zinc-500 font-medium">Interests</span>
                <div className="flex flex-wrap gap-2 justify-end max-w-[60%]">
                  {profile.interests?.length > 0 ? (
                    profile.interests.map((interest) => (
                      <span
                        key={interest}
                        className="px-3 py-1 bg-[#1A1A1E] text-zinc-300 text-xs rounded-full border border-zinc-800"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600">None added</span>
                  )}
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-linear-to-br from-[#CF0000]/10 to-[#FF0066]/10 border border-[#FF0066]/20 rounded-3xl p-6 shadow-xl">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-[#FF0066]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.318L12 20.414l7.682-7.682a4.5 4.5 0 00-6.318-6.318L12 7.318l-1.318-1.318a4.5 4.5 0 00-6.318 0z"
                  />
                </svg>
                Looking for
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-xs text-zinc-400 block mb-1">
                    Prefers
                  </span>
                  <span className="text-white font-semibold capitalize">
                    {profile.preferences?.gender || "Any"}
                  </span>
                </div>
                <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                  <span className="text-xs text-zinc-400 block mb-1">
                    Age Range
                  </span>
                  <span className="text-white font-semibold">
                    {profile.preferences?.minAge || 18} -{" "}
                    {profile.preferences?.maxAge || "Any"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
