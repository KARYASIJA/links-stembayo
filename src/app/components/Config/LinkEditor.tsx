"use client";

import { useState, useRef, useEffect } from "react";

export default function LinkEditor({
  link = {},
  onChange,
  onDelete,
  dragHandleProps,
  forcedType,
  isDragging = false,
}: any) {
  const [title, setTitle] = useState(link.title || "");
  const [href, setHref] = useState(link.href || "");
  const [image, setImage] = useState(link.image || "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!link._id) {
      setTitle("");
      setHref("");
      setImage("");
    }
  }, [link._id]);

  const handleInputChange = (field: string, value: string) => {
    onChange({ ...link, [field]: value, type: forcedType });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImage(data.url);
        onChange({ ...link, image: data.url, type: forcedType });
      } else {
        setUploadError("Upload failed");
      }
    } catch {
      setUploadError("Upload failed");
    }
    setUploading(false);
  };

  const handleDelete = () => {
    if (isDragging) return;
    onDelete(link);
  };

  return (
    <form
      className="flex flex-wrap items-center gap-2 bg-[#fbf9f3] rounded-lg px-3 py-3 mb-3 shadow-sm border border-gray-500 hover:shadow-md hover:border-black transition-all duration-200 relative group max-w-full overflow-x-auto"
      style={{ minHeight: 52 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div
        {...dragHandleProps}
        className="text-gray-500 group-hover:text-black cursor-grab select-none mr-2"
        title="Drag to reorder"
        style={{ alignSelf: "flex-start", marginTop: 2 }}
      >
        <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
          <circle cx="6" cy="7" r="1.5" fill="currentColor" />
          <circle cx="6" cy="12" r="1.5" fill="currentColor" />
          <circle cx="6" cy="17" r="1.5" fill="currentColor" />
          <circle cx="12" cy="7" r="1.5" fill="currentColor" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <circle cx="12" cy="17" r="1.5" fill="currentColor" />
        </svg>
      </div>
      <input
        value={link.title || ""}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Judul"
        className="border border-gray-500 rounded-md px-3 py-2 text-sm bg-white text-black placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all flex-1 min-w-0 max-w-[120px]"
        required
        style={{ minWidth: 80 }}
      />
      <input
        value={link.href || ""}
        onChange={(e) => handleInputChange("href", e.target.value)}
        placeholder="URL"
        className="border border-gray-500 rounded-md px-3 py-2 text-sm bg-white text-black placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all flex-1 min-w-0 max-w-[160px]"
        required
        style={{ minWidth: 100 }}
      />
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || isDragging}
          className={`px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
            uploading || isDragging
              ? "bg-gray-200 text-black cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 hover:border-gray-400"
          }`}
          tabIndex={-1}
          style={{ minWidth: 60 }}
        >
          {uploading ? "⏳" : "📷 Upload"}
        </button>
        {link.image && (
          <img
            src={link.image}
            alt="preview"
            className="w-8 h-8 object-cover rounded-md border border-gray-300 shadow-sm"
            style={{ minWidth: 32, minHeight: 32 }}
          />
        )}
      </div>
      {uploadError && (
        <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded">
          {uploadError}
        </span>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDragging}
          className={`font-semibold px-3 py-2 rounded-md text-xs transition-all duration-200 ${
            isDragging
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400 text-gray-900 border border-gray-400 hover:border-gray-500"
          }`}
          style={{ minWidth: 60 }}
        >
          🗑️ Hapus
        </button>
      )}
    </form>
  );
}
