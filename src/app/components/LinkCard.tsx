"use client";

import Image from "next/image";
import { Link } from "@/typings";

const LinkCard = ({ href, title, image }: Link) => {
  return (
    <a
      href={href}
      target="_blank"
      draggable={false}
      rel="noopener noreferrer"
      className="flex gap-2 items-center max-h-14 p-2 w-full rounded-md hover:scale-105 transition-all bg-gray-100 select-none"
    >
      <div className="flex items-center w-9 h-9 bg-gray-200 rounded-lg p-0.5">
        {image && (
          <Image
            className="rounded-sm"
            alt=""
            src={image?.startsWith("http") ? image : `/${image}`}
            width={50}
            height={50}
            sizes="(min-width: 960px) 65vw, (min-width: 1280px) 80vw, (min-width: 1440px) 100vw, 50vw"
          />
        )}
      </div>
      <div className="text-center ml-[-15px] line-clamp-1 font-semibold w-full leading-9 text-black">
        {title}
      </div>
    </a>
  );
};

export default LinkCard;
