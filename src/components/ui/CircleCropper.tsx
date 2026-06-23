"use client";

import React, { useState, useEffect, useRef } from "react";
import { Plus, Minus, Move } from "lucide-react";

interface CircleCropperProps {
  imageSrc: string;
  onCropComplete: (croppedUrl: string) => void;
  onCancel: () => void;
}

export default function CircleCropper({ imageSrc, onCropComplete, onCancel }: CircleCropperProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [dimensions, setDimensions] = useState({
    naturalWidth: 0,
    naturalHeight: 0,
    renderedWidth: 0,
    renderedHeight: 0,
  });

  const cropSize = 240; // The fixed size of the circular crop area in pixels

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const nw = img.naturalWidth;
    const nh = img.naturalHeight;

    // Calculate dimensions so the shorter side matches cropSize
    let rw = cropSize;
    let rh = cropSize;
    if (nw > nh) {
      rw = cropSize * (nw / nh);
    } else {
      rh = cropSize * (nh / nw);
    }

    setDimensions({
      naturalWidth: nw,
      naturalHeight: nh,
      renderedWidth: rw,
      renderedHeight: rh,
    });

    // Center the image in the crop area initially
    setPan({
      x: (cropSize - rw) / 2,
      y: (cropSize - rh) / 2,
    });
    setZoom(1);
  };

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = { ...pan };
  };

  // Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart.current = { ...pan };
    }
  };

  // Mouse/Touch Move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      updatePan(dx, dy);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      updatePan(dx, dy);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, pan]);

  const updatePan = (dx: number, dy: number) => {
    let newX = panStart.current.x + dx;
    let newY = panStart.current.y + dy;

    // Restrict pan so the image always covers the circular crop area
    const currentWidth = dimensions.renderedWidth * zoom;
    const currentHeight = dimensions.renderedHeight * zoom;

    // Minimum X is cropSize - currentWidth (image's right edge is at crop area right edge)
    // Maximum X is 0 (image's left edge is at crop area left edge)
    const minX = cropSize - currentWidth;
    const minY = cropSize - currentHeight;

    if (currentWidth >= cropSize) {
      newX = Math.min(0, Math.max(minX, newX));
    } else {
      newX = (cropSize - currentWidth) / 2;
    }

    if (currentHeight >= cropSize) {
      newY = Math.min(0, Math.max(minY, newY));
    } else {
      newY = (cropSize - currentHeight) / 2;
    }

    setPan({ x: newX, y: newY });
  };

  // Zooming
  const handleZoomChange = (newZoom: number) => {
    const targetZoom = Math.min(3, Math.max(1, newZoom));
    
    // Adjust pan when zooming to keep the image centered
    setZoom((prevZoom) => {
      const zoomRatio = targetZoom / prevZoom;
      setPan((prevPan) => {
        // Calculate center of the crop circle
        const centerX = cropSize / 2;
        const centerY = cropSize / 2;

        let newX = centerX - (centerX - prevPan.x) * zoomRatio;
        let newY = centerY - (centerY - prevPan.y) * zoomRatio;

        // Apply restrictions
        const currentWidth = dimensions.renderedWidth * targetZoom;
        const currentHeight = dimensions.renderedHeight * targetZoom;
        const minX = cropSize - currentWidth;
        const minY = cropSize - currentHeight;

        if (currentWidth >= cropSize) {
          newX = Math.min(0, Math.max(minX, newX));
        } else {
          newX = (cropSize - currentWidth) / 2;
        }

        if (currentHeight >= cropSize) {
          newY = Math.min(0, Math.max(minY, newY));
        } else {
          newY = (cropSize - currentHeight) / 2;
        }

        return { x: newX, y: newY };
      });
      return targetZoom;
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomStep = 0.05;
    const newZoom = zoom + (e.deltaY < 0 ? zoomStep : -zoomStep);
    handleZoomChange(newZoom);
  };

  const handleApply = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = 400; // Output resolution width
    canvas.height = 400; // Output resolution height

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enable high-quality image scaling
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Calculate source crop dimensions on the natural image
    const scale = (dimensions.renderedWidth * zoom) / dimensions.naturalWidth;
    const sourceX = -pan.x / scale;
    const sourceY = -pan.y / scale;
    const sourceSize = cropSize / scale;

    ctx.drawImage(
      imgRef.current,
      sourceX,
      sourceY,
      sourceSize,
      sourceSize,
      0,
      0,
      400,
      400
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const croppedUrl = URL.createObjectURL(blob);
        onCropComplete(croppedUrl);
      }
    }, "image/jpeg", 0.95);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full select-none">
      {/* Cropper Frame */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative overflow-hidden bg-black/40 border border-white/10 rounded-2xl cursor-move shadow-inner flex items-center justify-center"
        style={{ width: cropSize, height: cropSize }}
      >
        {/* Rendered Image */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt="To Crop"
          onLoad={handleImageLoad}
          className="absolute origin-top-left pointer-events-none max-w-none max-h-none"
          style={{
            width: dimensions.renderedWidth,
            height: dimensions.renderedHeight,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        />

        {/* Circular Mask Overlay */}
        <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]" />
        
        {/* Circular Dotted Guide */}
        <div className="absolute inset-0 pointer-events-none rounded-full border-2 border-dashed border-primary/60 shadow-[0_0_0_9999px_rgba(0,0,0,0.15)]" />

        {/* Move Badge Overlay */}
        <div className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-[9px] font-bold text-white/70 flex items-center gap-1.5 opacity-60 pointer-events-none">
          <Move size={10} />
          <span>DRAG TO PAN</span>
        </div>
      </div>

      {/* Zoom Control Slider */}
      <div className="w-full max-w-[280px] flex items-center gap-3">
        <button
          type="button"
          onClick={() => handleZoomChange(zoom - 0.1)}
          className="w-7 h-7 rounded-lg bg-bg-base border border-border-main/50 flex items-center justify-center text-text-muted hover:text-text-main transition-colors cursor-pointer"
        >
          <Minus size={13} />
        </button>

        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={zoom}
          onChange={(e) => handleZoomChange(parseFloat(e.target.value))}
          className="flex-1 h-1 bg-border-main rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
        />

        <button
          type="button"
          onClick={() => handleZoomChange(zoom + 0.1)}
          className="w-7 h-7 rounded-lg bg-bg-base border border-border-main/50 flex items-center justify-center text-text-muted hover:text-text-main transition-colors cursor-pointer"
        >
          <Plus size={13} />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 w-full border-t border-border-main/30 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-border-main/50 text-text-muted hover:text-text-main font-bold text-xs cursor-pointer transition-all duration-300"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleApply}
          className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs cursor-pointer transition-all duration-300 shadow-md"
        >
          Apply Crop
        </button>
      </div>
    </div>
  );
}
