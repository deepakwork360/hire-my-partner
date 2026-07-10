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

    // Check if it is a secure API endpoint that requires Authorization headers
    const isSecureApiUrl = src.includes("/kyc-document/media/") || src.includes("/partner/kyc-document/");
    
    // If it does not require authentication, load directly
    if (!isSecureApiUrl) {
      setImageSrc(src);
      return;
    }

    let active = true;
    setLoading(true);
    setError(false);

    const fetchSecureImage = async () => {
      try {
        // Convert any absolute API URLs to relative paths to ensure Axios interceptors apply headers correctly
        let fetchPath = src;
        const apiIndex = fetchPath.indexOf("/api/");
        if (apiIndex !== -1) {
          fetchPath = fetchPath.substring(apiIndex + 5); // Extract path after '/api/'
        } else if (fetchPath.startsWith("/")) {
          // If relative path starts with slash and has '/api', handle it
          if (fetchPath.startsWith("/api/")) {
            fetchPath = fetchPath.substring(5);
          } else if (fetchPath.startsWith("/")) {
            fetchPath = fetchPath.substring(1);
          }
        }
        
        const response = await api.get(fetchPath, { responseType: "blob" });
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

  if (!imageSrc) {
    return null;
  }

  return <img src={imageSrc} {...props} />;
}
