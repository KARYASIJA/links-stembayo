"use client";

import { useState, useEffect } from "react";

import {
  SiMaildotru,
  SiTwitter,
  SiGithub,
  SiInstagram,
  SiLinkedin,
  SiKeybase,
  SiFacebook,
  SiYoutube,
  SiTiktok,
} from "react-icons/si";

const ICONS = [
  { name: "email", icon: <SiMaildotru /> },
  { name: "twitter", icon: <SiTwitter /> },
  { name: "github", icon: <SiGithub /> },
  { name: "instagram", icon: <SiInstagram /> },
  { name: "linkedin", icon: <SiLinkedin /> },
  { name: "keybase", icon: <SiKeybase /> },
  { name: "facebook", icon: <SiFacebook /> },
  { name: "youtube", icon: <SiYoutube /> },
  { name: "tiktok", icon: <SiTiktok /> },
];

export default function SocialEditor({
  social = {},
  onChange,
  onDelete,
  dragHandleProps,
  isDragging = false,
}: any) {
  const [title, setTitle] = useState(social.title || "");
  const [href, setHref] = useState(social.href || "");
  const [icon, setIcon] = useState(social.icon || "email");

  useEffect(() => {
    console.log("[SocialEditor] social prop changed:", social);
  }, [social]);

  useEffect(() => {
    setTitle(social.title || "");
    setHref(social.href || "");
    setIcon(social.icon || "email");
    console.log("[SocialEditor] useEffect sync local state from social:", {
      title: social.title,
      href: social.href,
      icon: social.icon,
    });
  }, [social]);

  useEffect(() => {
    console.log("[SocialEditor] local state:", { title, href, icon });
  }, [title, href, icon]);

  const handleInputChange = (field: string, value: string) => {
    if (field === "title") setTitle(value);
    if (field === "href") setHref(value);
    if (field === "icon") setIcon(value);
    console.log("[SocialEditor] handleInputChange", { field, value, social });
    onChange({ ...social, [field]: value });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isDragging) return;
    console.log("[SocialEditor] handleDelete", social);
    onDelete(social);
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
            value={title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onFocus={(e) => e.stopPropagation()}
            placeholder="Nama"
            className="border border-gray-500 rounded-md px-3 py-2 text-sm bg-white text-black placeholder-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all flex-1 min-w-0"
            required
            style={{
              touchAction: "manipulation",
            }}
          />
          <input
            value={href}
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
          <div className="flex items-center gap-2">
            <select
              value={icon}
              onChange={(e) => handleInputChange("icon", e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="border border-gray-500 rounded-md px-2 py-1 text-sm bg-white text-black"
              style={{
                touchAction: "manipulation",
              }}
            >
              {ICONS.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            <span className="text-lg">
              {ICONS.find((i) => i.name === (icon || "email"))?.icon}
            </span>
          </div>

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
              style={{
                touchAction: "manipulation",
              }}
            >
              Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
