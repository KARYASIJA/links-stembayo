'use client';

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

const LinkSocial = ({ href, title }: Social) => {
  const getIcon = () => {
    if (title.includes('email')) return <SiMaildotru size='26px' />;
    if (title.includes('twitter')) return <SiTwitter size='30px' />;
    if (title.includes('instagram')) return <SiInstagram size='26px' />;
    if (title.includes('github')) return <SiGithub size='26px' />;
    if (title.includes('linkedin')) return <SiLinkedin size='26px' />;
    if (title.includes('keybase')) return <SiKeybase size='26px' />;
    if (title.includes('facebook')) return <SiFacebook size='26px' />;
    if (title.includes('youtube')) return <SiYoutube size='26px' />;
    if (title.includes('tiktok')) return <SiTiktok size='26px' />;
    return null;
  };

  return (
    <a
      aria-label={`${title} link`}
      href={href}
      target='_blank'
      draggable={false}
      rel='noopener noreferrer'
      className='hover:scale-110 transition-all'
    >
      {getIcon()}
    </a>
  );
};

export default LinkSocial;
