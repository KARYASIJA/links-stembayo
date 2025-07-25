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

  const handleDelete = () => {
    if (isDragging) return;
    console.log("[SocialEditor] handleDelete", social);
    onDelete(social);
  };

  return (
    <form
      className="flex flex-wrap items-center gap-2 bg-[#fbf9f3] rounded-lg px-3 py-3 mb-3 shadow-sm border border-amber-200 hover:shadow-md hover:border-amber-300 transition-all duration-200 relative group max-w-full overflow-x-auto"
      style={{ minHeight: 52 }}
      onSubmit={(e) => e.preventDefault()}
    >
      <div
        {...dragHandleProps}
        className="text-amber-300 group-hover:text-amber-500 cursor-grab select-none mr-2"
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
        value={title}
        onChange={(e) => handleInputChange("title", e.target.value)}
        placeholder="Nama"
        className="border border-amber-200 rounded-md px-3 py-2 text-sm bg-white text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all flex-1 min-w-0 max-w-[100px]"
        required
        style={{ minWidth: 70 }}
      />
      <input
        value={href}
        onChange={(e) => handleInputChange("href", e.target.value)}
        placeholder="URL"
        className="border border-amber-200 rounded-md px-3 py-2 text-sm bg-white text-amber-900 placeholder-amber-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all flex-1 min-w-0 max-w-[140px]"
        required
        style={{ minWidth: 90 }}
      />
      <select
        value={icon}
        onChange={(e) => handleInputChange("icon", e.target.value)}
        className="border border-amber-200 rounded-md px-2 py-1 text-sm bg-white text-amber-900"
        style={{ minWidth: 60, maxWidth: 80 }}
      >
        {ICONS.map(({ name }) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <span className="text-lg ml-1">
        {ICONS.find((i) => i.name === (icon || "email"))?.icon}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDragging}
          className={`font-semibold px-3 py-2 rounded-md text-xs transition-all duration-200 ${
            isDragging
              ? "bg-amber-100 text-amber-400 cursor-not-allowed"
              : "bg-amber-300 hover:bg-amber-400 text-amber-900 border border-amber-400 hover:border-amber-500"
          }`}
          style={{ minWidth: 60 }}
        >
          Hapus
        </button>
      )}
    </form>
  );
}
