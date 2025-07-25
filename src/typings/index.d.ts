export interface Link {
  href: string;
  title: string;
  image?: string;
}

export interface Social {
  title: string;
  href: string;
  icon: string;
}

export interface Data {
  name: string;
  avatar: string;
  banner: string;
  descriptionOne: string;
  descriptionTwo: string;
  sectionOne: Link[];
  sectionTwo: Link[];
  sectionThree: Link[];
  socials: Social[];
}

export interface DividerProps {
  title?: string;
}