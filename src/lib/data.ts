// ---------- Programme (Jour 1 / Jour 2) ----------
export type ProgrammeItem = {
  time: string;
  title: string;
  bullets: string[];
  image: string;
};

export type ProgrammeDay = {
  id: 'jour-1' | 'jour-2';
  label: string;
  date: string;
  items: ProgrammeItem[];
};

export const programme: ProgrammeDay[] = [
  {
    id: 'jour-1',
    label: 'Jour 1',
    date: '26 Avril 2027',
    items: [
      {
        time: '10:00 → 11:45',
        title: 'Ouverture & Sessions Climat',
        bullets: [
          'Enjeux climatiques et diagnostics oasiens'
        ],
        image: '/images/programme/jour1_1.jpg'
      },
      {
        time: '11:45 → 14:15',
        title: 'IA & Pause Méridienne',
        bullets: [
          'IA au service de l’Oasis',
          'Déjeuner & réseautage'
        ],
        image: '/images/programme/jour1_2.jpg'
      },
      {
        time: '14:15 → 17:15',
        title: 'Ateliers & Agora Collective',
        bullets: [
          'Co-construction et synthèse des idées phares',
          'Veillée conviviale en soirée'
        ],
        image: '/images/programme/jour1_3.jpg'
      }
    ]
  },
  {
    id: 'jour-2',
    label: 'Jour 2',
    date: '27 Avril 2027',
    items: [
      {
        time: '09:30 → 11:30',
        title: 'Marche oasis & écoute du territoire',
        bullets: [
          'Parcours guidé dans la palmeraie de Nefta'
        ],
        image: '/images/programme/jour1_1.jpg'
      },
      {
        time: '11:30 → 14:00',
        title: 'Exposition & forum des solidarités',
        bullets: [
          'Pavillons des associations partenaires',
          'Pitches des projets candidats'
        ],
        image: '/images/programme/jour1_2.jpg'
      },
      {
        time: '14:00 → 17:00',
        title: 'Veillée culturelle & concert de clôture',
        bullets: [
          'Récits, malouf et créations partagées',
          'Concert au cœur de l’oasis'
        ],
        image: '/images/programme/jour1_3.jpg'
      }
    ]
  }
];

// ---------- Initiatives (Nos axes de travail) ----------
export type Initiative = {
  title: string;
  description: string;
  image: string;
};

export const initiatives: Initiative[] = [
  {
    title: 'Sessions Climat',
    description:
      'Comprendre les transformations climatiques des territoires oasiens à travers échanges, analyses et expériences locales.',
    image: '/images/Nos_Axes/1.jpg'
  },
  {
    title: 'Artisanat, Innovation & Expositions',
    description:
      'Mettre en lumière les savoir-faire locaux, les initiatives artisanales et les projets innovants à travers expositions et espaces de rencontre.',
    image: '/images/Nos_Axes/2.jpg'
  },
  {
    title: 'Ateliers & Agora Collective',
    description:
      'Créer un espace de dialogue, de co-construction et de partage entre acteurs associatifs, chercheurs et habitants du territoire.',
    image: '/images/Nos_Axes/3.jpg'
  },
  {
    title: 'Veillée Culturelle',
    description:
      'Un moment convivial de rencontre, musique et de célébration des cultures locales sous les étoiles de Nefta.',
    image: '/images/Nos_Axes/4.jpg'
  },
  {
    title: 'Soirée Concert',
    description:
      'Une scène ouverte sous les palmiers, libre d’accès, pour célébrer ensemble la clôture de l’événement.',
    image: '/images/Nos_Axes/1.jpg'
  }
];

// ---------- Gallery ----------
export type GalleryItem = {
  src: string;
  alt: string;
  category: 'ateliers' | 'conferences' | 'expositions' | 'autres';
  // Layout hint for masonry — rough aspect ratio class
  ratio: 'portrait' | 'landscape' | 'square';
};

export const gallery: GalleryItem[] = [
  { src: '/images/Nos_Axes/1.jpg',        alt: 'Sessions Climat — diagnostic des territoires oasiens', category: 'conferences', ratio: 'square'    },
  { src: '/images/Nos_Axes/3.jpg',        alt: 'Ateliers & Agora — co-construction collective',        category: 'ateliers',    ratio: 'square'    },
  { src: '/images/programme/jour1_1.jpg', alt: 'Ouverture & enjeux climatiques de l’oasis',            category: 'conferences', ratio: 'landscape' },
  { src: '/images/Nos_Axes/2.jpg',        alt: 'Artisanat, innovation & expositions du sud tunisien',  category: 'expositions', ratio: 'landscape' },
  { src: '/images/programme/jour1_2.jpg', alt: 'IA au service de l’Oasis & pause méridienne',          category: 'autres',      ratio: 'square'    },
  { src: '/images/Nos_Axes/4.jpg',        alt: 'Veillée culturelle sous les étoiles de Nefta',         category: 'autres',      ratio: 'square'    }
];

export const galleryFilters = [
  { id: 'tout',         label: 'Tout' },
  { id: 'ateliers',     label: 'Ateliers' },
  { id: 'conferences',  label: 'Conférences' },
  { id: 'expositions',  label: 'Expositions' },
  { id: 'autres',       label: 'Autres' }
] as const;

// ---------- Stats bar ----------
export const stats = [
  { value: 120,    suffix: '+',      label: 'Participants',  icon: 'users' },
  { value: 45,     suffix: '',       label: 'Associations',  icon: 'handshake' },
  { value: 800,    suffix: '',       label: 'Bénévoles',     icon: 'heart' },
  { value: 3,      suffix: 'éme',    label: 'édition',       icon: 'trophy' }
] as const;

// ---------- Nav ----------
export const navLinks = [
  { href: '#a-propos',    label: 'À propos' },
  { href: '#programme',   label: 'Programme' },
  { href: '#initiatives', label: 'Initiatives' },
  { href: '#gallerie',    label: 'Gallerie' },
  { href: '#contact',     label: 'Contact' }
];

// ---------- Contact info ----------
export const contact = {
  tel: '+216 55 000 000',
  email: 'loremipsum@gmail.com',
  location: 'Tunis, Tunisia'
};

// ---------- Event meta ----------
export const eventMeta = {
  title: 'Échos Solidaires 2026',
  date: '26-27 Avril 2027',
  location: 'Nefta, Tunisie',
  startDate: '2027-04-26',
  endDate: '2027-04-27',
  description:
    'Échos Solidaires rassemble acteurs locaux, jeunes, artisans et porteurs d’initiatives autour du climat, du patrimoine et des solidarités territoriales à Nefta, les 26 et 27 avril 2027.'
};
