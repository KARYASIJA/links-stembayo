"use client";

import { useState, useRef, useEffect } from "react";
import { FaCamera } from "react-icons/fa";
import { CgSandClock } from "react-icons/cg";
import { RiDeleteBin5Fill } from "react-icons/ri";

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

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) return;
    onDelete(link);
  };

  return (
    <div
      className="bg-[#fbf9f3] rounded-lg px-3 py-3 mb-3 shadow-sm border border-gray-500 hover:shadow-md hover:border-black transition-all duration-200 relative group select-none"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        WebkitTouchCallout: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      {...dragHandleProps}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          <div
            className="text-gray-500 group-hover:text-black select-none flex-shrink-0"
            style={{
              minWidth: 24,
              minHeight: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              touchAction: "none",
            }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="6" cy="7" r="2" fill="currentColor" />
              <circle cx="6" cy="12" r="2" fill="currentColor" />
              <circle cx="6" cy="17" r="2" fill="currentColor" />
              <circle cx="12" cy="7" r="2" fill="currentColor" />
              <circle cx="12" cy="12" r="2" fill="currentColor" />
              <circle cx="12" cy="17" r="2" fill="currentColor" />
            </svg>
          </div>

          <input
            value={link.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            placeholder="Judul"
            className="border border-gray-500 rounded-md px-3 py-2 text-sm bg-white text-black placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all flex-1 min-w-0"
            required
            style={{
              touchAction: "manipulation",
            }}
          />
          <input
            value={link.href || ""}
            onChange={(e) => handleInputChange("href", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            placeholder="URL"
            className="border border-gray-500 rounded-md px-3 py-2 text-sm bg-white text-black placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all flex-1 min-w-0"
            required
            style={{
              touchAction: "manipulation",
            }}
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading || isDragging}
                className={`px-3 py-2 rounded-md text-xs font-semibold transition-all duration-200 ${
                  uploading || isDragging
                    ? "bg-gray-200 text-black cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-black border border-gray-300 hover:border-gray-400"
                }`}
                style={{
                  touchAction: "manipulation",
                }}
              >
                {uploading ? <CgSandClock /> : <FaCamera />}
              </button>
              {link.image && (
                <img
                  src={link.image}
                  alt="preview"
                  className="w-8 h-8 object-cover rounded-md border border-gray-300 shadow-sm"
                  style={{
                    touchAction: "manipulation",
                  }}
                />
              )}
            </div>

            {onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDragging}
                className={`font-semibold px-3 py-2 rounded-md flex gap-2 items-center text-xs transition-all duration-200 ${
                  isDragging
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-900 border border-gray-400 hover:border-gray-500"
                }`}
                style={{
                  touchAction: "manipulation",
                }}
              >
                <RiDeleteBin5Fill /> Hapus
              </button>
            )}
          </div>

          {uploadError && (
            <div className="w-full sm:w-auto">
              <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded block">
                {uploadError}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
