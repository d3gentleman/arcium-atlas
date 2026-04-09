'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from 'react';
import Image from 'next/image';

interface LogoUploadProps {
  value: string;
  onChange: (url: string) => void;
  error?: string;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB
const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];

export default function LogoUpload({ value, onChange, error }: LogoUploadProps) {
  const [preview, setPreview] = useState<string>(value || '');
  const [dragActive, setDragActive] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [fileError, setFileError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value && value !== preview) setPreview(value);
  }, [value, preview]);

  const processFile = useCallback(
    (file: File) => {
      setFileError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setFileError('Unsupported format. Use PNG, JPEG, WebP, or SVG.');
        return;
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileError('File exceeds 2 MB limit.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);
        onChange(dataUrl);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  // ── Drag & Drop ──────────────────────────────
  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0]);
  };

  // ── Paste ────────────────────────────────────
  useEffect(() => {
    const handlePaste = (e: globalThis.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    };
    const el = dropRef.current;
    if (el) {
      el.addEventListener('paste', handlePaste as EventListener);
      return () => el.removeEventListener('paste', handlePaste as EventListener);
    }
  }, [processFile]);

  // ── File Browse ──────────────────────────────
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  // ── URL Input ────────────────────────────────
  const applyUrl = () => {
    if (!urlInput.trim()) return;
    setPreview(urlInput.trim());
    onChange(urlInput.trim());
    setFileError(null);
  };

  const clearUpload = () => {
    setPreview('');
    onChange('');
    setUrlInput('');
    setFileError(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const displayError = fileError || error;

  return (
    <div className="space-y-1.5">
      <label className="flex items-baseline gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-outline">
        <span className="text-primary/50 select-none">{'>'}</span>
        Project Logo
        <span className="text-primary">*</span>
      </label>

      {/* ── Mode Toggle ──────────────────────── */}
      <div className="flex gap-2 text-[10px]">
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`px-2 py-0.5 border transition-colors ${
            mode === 'upload'
              ? 'border-primary/50 text-primary bg-primary/10'
              : 'border-outline-variant/30 text-outline hover:text-on-surface'
          }`}
        >
          UPLOAD
        </button>
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`px-2 py-0.5 border transition-colors ${
            mode === 'url'
              ? 'border-primary/50 text-primary bg-primary/10'
              : 'border-outline-variant/30 text-outline hover:text-on-surface'
          }`}
        >
          URL
        </button>
      </div>

      {mode === 'upload' ? (
        <div
          ref={dropRef}
          tabIndex={0}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`
            relative flex cursor-pointer flex-col items-center justify-center
            border-2 border-dashed px-4 py-8 text-center transition-all duration-200
            focus:outline-none focus:ring-1 focus:ring-primary/30
            ${
              dragActive
                ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(0,240,255,0.12)]'
                : displayError
                  ? 'border-error/40 hover:border-error/60'
                  : 'border-outline-variant/30 hover:border-outline-variant/50'
            }
          `}
        >
          {preview ? (
            <div className="relative h-24 w-24">
              <Image
                src={preview}
                alt="Logo preview"
                fill
                className="object-contain"
                style={{
                  filter: 'contrast(1.05) brightness(0.95)',
                }}
                unoptimized
              />
              <div className="scanline-effect absolute inset-0 opacity-20 pointer-events-none" />
            </div>
          ) : (
            <>
              <div className="mb-2 text-2xl text-primary/40">⬆</div>
              <p className="text-xs text-outline/70">
                Drag & drop, paste, or{' '}
                <span className="text-primary underline">browse</span>
              </p>
              <p className="mt-1 text-[10px] text-outline/40">
                PNG, JPEG, WebP, or SVG — max 2 MB
              </p>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/logo.png"
            className="
              flex-1 border border-outline-variant/30 bg-surface-container-lowest/60
              px-3 py-2 font-body text-sm text-on-surface placeholder:text-outline/40
              transition-all duration-200
              focus:outline-none focus:ring-1 focus:border-primary/60 focus:ring-primary/30
              hover:border-outline-variant/50
            "
          />
          <button
            type="button"
            onClick={applyUrl}
            className="border border-primary/50 bg-primary/10 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/20"
          >
            LOAD
          </button>
        </div>
      )}

      {/* ── Preview & Clear ──────────────────── */}
      {preview && (
        <button
          type="button"
          onClick={clearUpload}
          className="text-[10px] text-outline/50 hover:text-error transition-colors"
        >
          ✕ CLEAR
        </button>
      )}

      {displayError && (
        <p role="alert" className="flex items-center gap-1.5 text-[10px] text-error pl-3">
          <span className="select-none">⚠</span>
          {displayError}
        </p>
      )}
    </div>
  );
}
