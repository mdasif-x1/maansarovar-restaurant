import React, { useState, useRef } from 'react';
import { Upload, X, Check, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { uploadImageAdmin } from '../services/uploadService';

interface ImageUploaderProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  label?: string;
  helperText?: string;
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = '',
  onChange,
  label = 'Upload Image',
  helperText = 'Allowed formats: JPG, PNG, WebP (Max 5 MB)',
  className = '',
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndUpload = async (file: File) => {
    setError(null);
    setSuccess(null);

    // Client-side pre-validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type.toLowerCase())) {
      setError('Invalid file format. Only JPEG, PNG, and WebP image files are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds the 5 MB limit.');
      return;
    }

    setIsUploading(true);
    try {
      const res = await uploadImageAdmin(file);
      onChange(res.imageUrl);
      setSuccess('Image uploaded successfully!');
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
    setSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-2 font-sans ${className}`}>
      {label && <label className="block text-xs font-bold uppercase tracking-wider text-charcoal-900">{label}</label>}

      {/* Upload Drop Zone / Preview */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`${label}. Click or drag and drop an image file.`}
        className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-forest-800 ${
          isDragging
            ? 'border-forest-800 bg-forest-50/50'
            : value
            ? 'border-cream-300 bg-cream-50'
            : 'border-cream-300 bg-cream-100 hover:bg-cream-200/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
        />

        {isUploading ? (
          <div className="py-6 flex flex-col items-center justify-center space-y-2">
            <Loader2 className="w-8 h-8 text-forest-800 animate-spin" />
            <p className="text-xs font-semibold text-charcoal-800">Uploading image safely...</p>
          </div>
        ) : value ? (
          <div className="relative group flex flex-col sm:flex-row items-center gap-4 text-left">
            <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-cream-300 shrink-0 bg-charcoal-950">
              <img src={value} alt="Uploaded Preview" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase text-green-700 bg-green-100 px-2 py-0.5 rounded inline-block mb-1">
                Image Selected
              </span>
              <p className="text-xs font-mono text-charcoal-800 truncate">{value}</p>
              <p className="text-[11px] text-charcoal-800/60 mt-1">Click or drop to replace this image</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1.5 rounded-full bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-colors"
              title="Remove Image"
              aria-label="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center space-y-2 text-charcoal-800/70">
            <div className="p-3 bg-cream-200 rounded-full text-forest-800">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-charcoal-900">Click to upload or drag & drop</p>
              <p className="text-[11px] text-charcoal-800/60 mt-0.5">{helperText}</p>
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      {error && (
        <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-2.5 rounded-lg bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}
    </div>
  );
};
