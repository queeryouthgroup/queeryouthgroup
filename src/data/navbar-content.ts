export type NavbarLink = {
  name: string;
  href: string;
  children?: NavbarLink[]; // <-- support dropdowns
};

export type NavbarLinkSection = NavbarLink[];

export type Locale = 'en' | 'ne';

export type NavbarLinks = Record<Locale, NavbarLinkSection>;

export const navbarLinks: NavbarLinks = {
  en: [
    { name: 'Home', href: '/' },
    {
      name: 'About Us',
      href: '',
      children: [
        { name: 'Who We Are', href: '/about' },
        { name: 'Our Journey', href: '/about/journey' },
        { name: 'Our Team', href: '/about/team' },
      ],
    },
    { name: 'Our Works', href: '/work' },
    { name: 'Legal Resources', href: '/resources' },
    { name: 'Litigations', href: '/litigations' },
    { name: 'Publications', href: '/publications' },
    { name: 'Dictionary', href: '/dictionary' },
    {
      name: 'Nepal Pride Parade',
      href: '',
      children: [
        { name: 'Overview of Pride Parade', href: '/pride/intro'},
        { name: 'Introduction to Nepal Pride Parade', href: '/pride' },
        { name: 'Timeline', href: '/pride/timeline' },
        { name: 'Organizers', href: '/pride/organizers' },
        { name: 'Challenges & Achievements', href: '/pride/challenges' },
        { name: 'Media & Resources', href: '/pride/media' },
      ],
    },
  ],

  ne: [
    { name: 'गृहपृष्ठ', href: '/' },
    {
      name: 'हाम्रो बारेमा',
      href: '/about',
      children: [
        { name: 'हामी को हौं', href: '/about' },
        { name: 'हाम्रो यात्रा', href: '/about/journey' },
        { name: 'हाम्रो टोली', href: '/about/team' },
      ],
    },
    { name: 'हाम्रो कार्यहरू', href: '/work' },
    { name: 'कानूनी स्रोतहरू', href: '/resources' },
    { name: 'मुद्दाहरू', href: '/litigations' },
    { name: 'प्रकाशनहरू', href: '/publications' },
    { name: 'शब्दकोश', href: '/dictionary' },
    {
      name: 'नेपाल गौरव यात्रा',
      href: '/pride',
      children: [
        { name: 'गौरव यात्राको परिचय', href: '/pride/intro'},
        { name: 'नेपाल गौरव यात्राको परिचय', href: '/pride' },
        { name: 'समयरेखा', href: '/pride/timeline' },
        { name: 'आयोजकहरू', href: '/pride/organizers' },
        { name: 'चुनौतीहरू र उपलब्धिहरू', href: '/pride/challenges' },
        { name: 'मिडिया र स्रोतहरू', href: '/pride/media' },
      ],
    },
  ],
};
