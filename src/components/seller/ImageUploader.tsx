"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, X, Star } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

// Converts a File to a data URL so images work with zero backend.
// Swap this for an upload-to-storage call + returned URL when ready.
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function ImageUploader({ images, onChange, maxImages = 8 }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const addFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || !files.length) return;
      const remaining = maxImages - images.length;
      const selected = Array.from(files).slice(0, Math.max(0, remaining));
      const dataUrls = await Promise.all(selected.map(fileToDataUrl));
      onChange([...images, ...dataUrls]);
    },
    [images, maxImages, onChange]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const makeCover = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    const [chosen] = next.splice(index, 1);
    next.unshift(chosen);
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer border border-dashed p-6 sm:p-8 text-center transition-colors ${
          isDragging ? "border-ink bg-bone" : "border-line bg-paper hover:border-ink"
        }`}
      >
        <ImagePlus size={28} className="mx-auto text-ash mb-2" />
        <p className="text-sm text-ink font-medium">Click to upload or drag images here</p>
        <p className="text-xs text-ash mt-1">PNG or JPG, up to {maxImages} images. First image is the cover.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((src, i) => (
            <div key={i} className="relative group aspect-square border border-line bg-bone overflow-hidden">
              <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-ink text-paper text-[9px] font-mono uppercase px-1.5 py-0.5 flex items-center gap-1">
                  <Star size={9} className="fill-paper" /> Cover
                </span>
              )}
              <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makeCover(i)}
                    className="p-1.5 bg-paper text-ink"
                    aria-label="Make cover image"
                    title="Make cover image"
                  >
                    <Star size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 bg-paper text-ink"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
