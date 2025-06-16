'use client';

import { useState, useCallback } from 'react';
import { Loader2, Upload, Camera, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface AvatarUploaderProps {
  onUpload?: (url: string) => void;
  currentAvatar?: string;
  className?: string;
}

export default function AvatarUploader({ onUpload, currentAvatar, className }: AvatarUploaderProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(currentAvatar || null);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    try {
      const res = await fetch('/api/upload_cloudinary', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();
      console.log(data)
      setImageUrl(data.url);
      onUpload?.(data.url);
      
      toast({
        title: "Success",
        description: "Avatar updated successfully",
      });
    } catch (error) {
      console.error('Avatar upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 1,
  });

  const removeAvatar = () => {
    setImageUrl(null);
    onUpload?.('');
  };

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-6">
        <div className="relative group">
          {imageUrl ? (
            <div className="relative">
              <img
                src={imageUrl}
                alt="Avatar"
                className="w-24 h-24 rounded-full object-cover ring-2 ring-primary/20"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={removeAvatar}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <Camera className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>

        <div
          {...getRootProps()}
          className={cn(
            "flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors",
            "hover:border-primary/50 cursor-pointer",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          )}
        >
          <input {...getInputProps()} />
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isDragActive ? "Drop the image here" : "Drag & drop an image here"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  or click to select a file
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Supported formats: JPEG, PNG, GIF. Max file size: 5MB
      </p>
    </div>
  );
}