"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import data from "@/data";
import LinkCard from "@/app/components/LinkCard";
import LinkSocial from "@/app/components/LinkSocial";
import GoogleMapEmbed from "./components/GoogleMap";
import Divider from "./components/Divider";

const FETCH_INTERVAL = 600000;

export default function Home() {
  const [links, setLinks] = useState<any[]>([]);
  const [socials, setSocials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = async () => {
    setLoading(true);
    const [linksRes, socialsRes] = await Promise.all([
      fetch("/api/public/links").then((res) => res.json()),
      fetch("/api/public/socials").then((res) => res.json()),
    ]);
    setLinks(linksRes);
    setSocials(socialsRes);
    setLoading(false);
  };

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const sortByOrder = (arr: any[]) =>
    [...arr].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  if (loading) {
    return (
      <div className="flex mx-auto min-h-screen w-full flex-col">
        <div className="flex items-center flex-col justify-center">
          <Image
            priority
            className="z-0 max-h-60 lg:max-h-44 object-cover w-full"
            alt={data.name}
            src={`/${data.banner}`}
            width={900}
            height={300}
            sizes="(max-width: 960px) 25vw, (max-width: 1280px) 40vw, (max-width: 1440px) 50vw, 75vw"
          />
          <Image
            className="z-10 -mt-20 h-40 w-auto aspect-square"
            alt={data.name}
            src={`/${data.avatar}`}
            width={100}
            height={100}
            sizes="(max-width: 960px) 25vw, (max-width: 1280px) 40vw, (max-width: 1440px) 50vw, 75vw"
          />
          <div className="px-6 text-center max-w-lg w-full">
            <h1 className="font-bold mt-2 text-2xl text-black">{data.name}</h1>
            <p className="mt-1 font-bold text-xl text-black">
              {data.descriptionOne}
            </p>
            <p className="mt-1 italic text-black">{data.descriptionTwo}</p>
            <div>
              <Divider />
              <div className="flex flex-col gap-3 items-center w-full mb-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex gap-2 items-center max-h-14 p-2 w-full rounded-md bg-amber-100"
                  >
                    <div className="w-9 h-9 bg-amber-200 rounded-lg" />
                    <div className="h-6 w-32 bg-amber-200 rounded" />
                  </div>
                ))}
              </div>
              <Divider title="Layanan Lain" />
              <div className="flex flex-col gap-3 items-center w-full mb-4">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex gap-2 items-center max-h-14 p-2 w-full rounded-md bg-amber-100"
                  >
                    <div className="w-9 h-9 bg-amber-200 rounded-lg" />
                    <div className="h-6 w-24 bg-amber-200 rounded" />
                  </div>
                ))}
              </div>
              <Divider title="Lain-lain" />
              <div className="flex flex-col gap-3 items-center w-full mb-4">
                {[...Array(1)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse flex gap-2 items-center max-h-14 p-2 w-full rounded-md bg-amber-100"
                  >
                    <div className="w-9 h-9 bg-amber-200 rounded-lg" />
                    <div className="h-6 w-20 bg-amber-200 rounded" />
                  </div>
                ))}
              </div>
              <Divider title="Lokasi" />
              <GoogleMapEmbed />
              <Divider />
            </div>
            <div className="flex items-center justify-center gap-3 text-black mb-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-10 w-10 bg-amber-200 rounded-full"
                />
              ))}
            </div>
            <div className="flex justify-center my-8 text-black">
              <span>&copy; 2025 Tim Karya Web STEMBAYO</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex mx-auto min-h-screen w-full flex-col">
      <div className="flex items-center flex-col justify-center">
        <Image
          priority
          className="z-0 max-h-60 lg:max-h-44 object-cover w-full"
          alt={data.name}
          src={`/${data.banner}`}
          width={900}
          height={300}
          sizes="(max-width: 960px) 25vw, (max-width: 1280px) 40vw, (max-width: 1440px) 50vw, 75vw"
        />
        <Image
          className="z-10 -mt-20 h-40 w-auto aspect-square"
          alt={data.name}
          src={`/${data.avatar}`}
          width={100}
          height={100}
          sizes="(max-width: 960px) 25vw, (max-width: 1280px) 40vw, (max-width: 1440px) 50vw, 75vw"
        />
        <div className="px-6 text-center max-w-lg w-full">
          <h1 className="font-bold mt-2 text-2xl text-black">{data.name}</h1>
          <p className="mt-1 font-bold text-xl text-black">
            {data.descriptionOne}
          </p>
          <p className="mt-1 italic text-black">{data.descriptionTwo}</p>
          <div>
            <Divider />
            <div className="flex flex-col gap-3 items-center w-full">
              {sortByOrder(links.filter((l) => l.type === "main")).map(
                (link) => (
                  <LinkCard key={link.href} {...link} />
                )
              )}
            </div>
            <Divider title="Layanan Lain" />
            <div className="flex flex-col gap-3 items-center w-full">
              {sortByOrder(links.filter((l) => l.type === "service")).map(
                (link) => (
                  <LinkCard key={link.href} {...link} />
                )
              )}
            </div>
            <Divider title="Lain-lain" />
            <div className="flex flex-col gap-3 items-center w-full">
              {sortByOrder(links.filter((l) => l.type === "other")).map(
                (link) => (
                  <LinkCard key={link.href} {...link} />
                )
              )}
            </div>
            <Divider title="Lokasi" />
            <GoogleMapEmbed />
            <Divider />
          </div>
          <div className="flex items-center justify-center gap-3 text-black">
            {sortByOrder(socials).map((social) => (
              <LinkSocial key={social.href} {...social} />
            ))}
          </div>
          <div className="flex justify-center my-8 text-black">
            <span>&copy; 2025 Tim Karya Web STEMBAYO</span>
          </div>
        </div>
      </div>
    </div>
  );
}
