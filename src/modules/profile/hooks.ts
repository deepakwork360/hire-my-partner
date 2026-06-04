import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./api";
import { Profile, UpdateProfilePayload } from "./types";
import { toast } from "@/components/ui/toastStore";

// React Query hooks keep page queries extremely light, automated, and performant.
export const useMyProfile = () => {
  const { data, isLoading, error } = useQuery<Profile, Error>({
    queryKey: ["myProfile"],
    queryFn: () => profileApi.getMyProfile(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  return {
    profile: data || null,
    isLoading,
    error: error ? error.message : null,
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Profile, Error, UpdateProfilePayload>({
    mutationFn: (data) => profileApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      // Optimistically update the query cache to reflect changes immediately
      queryClient.setQueryData(["myProfile"], updatedProfile);
      toast.success("Profile updated successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Update failed");
    }
  });

  return {
    updateProfile: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useUploadPhoto = () => {
  const mutation = useMutation<string, Error, File>({
    mutationFn: (file) => profileApi.uploadPhoto(file),
    onSuccess: () => {
      toast.success("Photo uploaded successfully");
    },
    onError: (err) => {
      toast.error(err.message || "Upload failed");
    }
  });

  return {
    uploadPhoto: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
