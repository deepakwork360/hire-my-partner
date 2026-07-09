"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/axios";

interface SecureImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallback?: React.ReactNode;
}

export default function SecureImage({ src, fallback, ...props }: SecureImageProps) {
  const [imageSrc, setImageSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setImageSrc("");
      return;
    }

    // If it's a blob, data URL, or doesn't belong to our backend host, load directly
    const isBackendUrl = src.includes("blackbullsolution.com") || src.includes("/storage/");
    const isLocalOrExternal = src.startsWith("data:") || src.startsWith("blob:") || src.startsWith("/") || !isBackendUrl;

    if (isLocalOrExternal) {
      setImageSrc(src);
      return;
    }

    let active = true;
    setLoading(true);
    setError(false);

    const fetchSecureImage = async () => {
      try {
        const response = await api.get(src, { responseType: "blob" });
        if (active) {
          const blobUrl = URL.createObjectURL(response.data);
          setImageSrc(blobUrl);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to secure fetch image:", src, err);
        if (active) {
          // Fallback to direct src loading in case server allows it or has public access
          setImageSrc(src);
          setError(true);
          setLoading(false);
        }
      }
    };

    fetchSecureImage();

    return () => {
      active = false;
    };
  }, [src]);

  if (loading && fallback) {
    return <>{fallback}</>;
  }

  return <img src={imageSrc} {...props} />;
}
