import React, { useState, useRef } from 'react';
import {
  Upload, Image as ImageIcon, Link as LinkIcon, Check, Sparkles,
  Camera, Trash2, AlertCircle, RefreshCw, User, Shield, Cpu, Cloud
} from 'lucide-react';

export interface DefaultAvatarOption {
  id: string;
  url: string;
  name: string;
  category: 'illustrated' | 'photo' | 'tech';
}

export const DEFAULT_AVATARS: DefaultAvatarOption[] = [
  // Curated Professional & Tech Avatars
  {
    id: 'avatar-1',
    name: 'Cloud Architect (Alex)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-2',
    name: 'Azure Solutions Eng (David)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3',
    name: 'AI Research Lead (Sarah)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-4',
    name: 'DevOps Platform Eng (Marcus)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-5',
    name: 'Cybersecurity Guardian (Elena)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-6',
    name: 'Data & Fabric Specialist (Jordan)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-7',
    name: 'Copilot AI Specialist (Priya)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-8',
    name: 'Enterprise Developer (Carlos)',
    category: 'photo',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  },

  // 3D / Illustrated Tech Personas
  {
    id: 'avatar-3d-cloud',
    name: 'Azure Cloud Sentinel (3D)',
    category: 'illustrated',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3d-ai',
    name: 'Neural AI Core (3D)',
    category: 'illustrated',
    url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3d-cyber',
    name: 'Zero Trust Cyber Shield',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=200&auto=format&fit=crop&q=80',
  },
  {
    id: 'avatar-3d-matrix',
    name: 'Quantum Data Sphere',
    category: 'tech',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  },
];

interface AvatarPickerProps {
  currentAvatarUrl: string;
  onSelectAvatar: (url: string) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({
  currentAvatarUrl,
  onSelectAvatar,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'photo' | 'illustrated' | 'tech'>('all');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filtered preset avatars
  const filteredAvatars = categoryFilter === 'all'
    ? DEFAULT_AVATARS
    : DEFAULT_AVATARS.filter((a) => a.category === categoryFilter);

  // Handle local image file upload & conversion to base64
  const processImageFile = (file: File) => {
    setUploadError(null);

    // Validate type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WebP, SVG, GIF).');
      return;
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size is too large (max 5MB). Please choose a smaller photo.');
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSelectAvatar(result);
        setIsProcessingFile(false);
      }
    };

    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try again.');
      setIsProcessingFile(false);
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const url = customUrlInput.trim();
    if (!url) return;

    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:image')) {
      setUploadError('Please enter a valid URL starting with https://');
      return;
    }

    setUploadError(null);
    onSelectAvatar(url);
    setCustomUrlInput('');
  };

  return (
    <div className="space-y-3.5">
      {/* Top Section: Active Avatar Preview & Mode Toggle */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="relative group flex-shrink-0">
            <img
              src={currentAvatarUrl}
              alt="Active Profile Avatar"
              className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0078D4] dark:ring-[#2899F5] shadow-md"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback placeholder on broken URL
                (e.target as HTMLImageElement).src = DEFAULT_AVATARS[0].url;
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
              title="Upload New Photo"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div>
            <span className="text-[11px] font-bold text-[#0078D4] dark:text-[#2899F5] uppercase tracking-wider block">
              Active Avatar
            </span>
            <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-[160px] sm:max-w-[200px]">
              {DEFAULT_AVATARS.find((a) => a.url === currentAvatarUrl)?.name || 'Custom Uploaded Photo'}
            </p>
          </div>
        </div>

        {/* Tab Switcher: Default Presets vs Custom Photo */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-900 border border-neutral-300/80 dark:border-neutral-700">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'presets'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeTab === 'custom'
                ? 'bg-[#0078D4] text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Custom Photo</span>
          </button>
        </div>
      </div>

      {/* Hidden File Input for Direct Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* 1. DEFAULT PRESETS TAB */}
      {activeTab === 'presets' && (
        <div className="space-y-2.5">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              type="button"
              onClick={() => setCategoryFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                categoryFilter === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
            >
              All ({DEFAULT_AVATARS.length})
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('photo')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                categoryFilter === 'photo'
                  ? 'bg-[#0078D4] text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Headshots</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('illustrated')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                categoryFilter === 'illustrated'
                  ? 'bg-purple-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>3D & AI</span>
            </button>
            <button
              type="button"
              onClick={() => setCategoryFilter('tech')}
              className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors flex items-center gap-1 ${
                categoryFilter === 'tech'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Cyber & Tech</span>
            </button>
          </div>

          {/* Avatar Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 max-h-48 overflow-y-auto p-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800">
            {filteredAvatars.map((option) => {
              const isSelected = currentAvatarUrl === option.url;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelectAvatar(option.url)}
                  title={option.name}
                  className={`group relative rounded-xl p-1 flex flex-col items-center gap-1 transition-all ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 ring-2 ring-[#0078D4]'
                      : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="relative">
                    <img
                      src={option.url}
                      alt={option.name}
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover shadow-xs group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0078D4] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-neutral-600 dark:text-neutral-400 truncate w-full text-center">
                    {option.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. CUSTOM PHOTO SECTION */}
      {activeTab === 'custom' && (
        <div className="space-y-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
          {/* Drag and Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
              isDragging
                ? 'border-[#0078D4] bg-blue-50/80 dark:bg-blue-950/50'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-[#0078D4] bg-white dark:bg-neutral-800'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0078D4] dark:text-[#2899F5] flex items-center justify-center shadow-xs">
              {isProcessingFile ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Upload className="w-5 h-5" />
              )}
            </div>

            <div>
              <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Click or drag & drop to upload your photo
              </p>
              <p className="text-[11px] text-neutral-500 mt-0.5">
                Supports PNG, JPG, WebP, SVG, GIF (max 5MB)
              </p>
            </div>

            <button
              type="button"
              className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
            >
              Browse Computer / Device
            </button>
          </div>

          {/* Image URL Input Option */}
          <form onSubmit={handleApplyCustomUrl} className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Or Paste Direct Image Web URL
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://example.com/my-photo.jpg"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
                />
              </div>
              <button
                type="submit"
                disabled={!customUrlInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-[#0078D4] hover:bg-[#006cbd] disabled:opacity-50 text-white text-xs font-bold transition-colors flex-shrink-0"
              >
                Apply URL
              </button>
            </div>
          </form>

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Quick reset to default */}
          <div className="flex items-center justify-between pt-2 border-t border-neutral-200 dark:border-neutral-800 text-xs">
            <span className="text-[11px] text-neutral-500">Want to reset?</span>
            <button
              type="button"
              onClick={() => onSelectAvatar(DEFAULT_AVATARS[0].url)}
              className="text-[#0078D4] dark:text-[#2899F5] font-semibold hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Standard Avatar</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
