'use client';;
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
} from 'react-icons/si';
import { Social } from '@/typings';

import type { JSX } from "react";

const ICON_MAP: Record<string, JSX.Element> = {
  email: <SiMaildotru size='26px' />,
  twitter: <SiTwitter size='30px' />,
  instagram: <SiInstagram size='26px' />,
  github: <SiGithub size='26px' />,
  linkedin: <SiLinkedin size='26px' />,
  keybase: <SiKeybase size='26px' />,
  facebook: <SiFacebook size='26px' />,
  youtube: <SiYoutube size='26px' />,
  tiktok: <SiTiktok size='26px' />,
};

const LinkSocial = ({ href, title, icon }: Social) => {
  return (
    <a
      aria-label={`${title} link`}
      href={href}
      target='_blank'
      draggable={false}
      rel='noopener noreferrer'
      className='hover:scale-110 transition-all'
    >
      {ICON_MAP[icon] || null}
    </a>
  );
};

export default LinkSocial;