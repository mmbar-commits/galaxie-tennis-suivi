import type {
  AcquisitionStatus,
  BallLevel,
  ChildMood,
  SessionType,
  SkillKey,
  TtcaAxis,
} from '../types/tennis';

export interface GalaxieMilestone {
  id: string;
  axis: TtcaAxis;
  subGroup?: string;
  label: string;
  kidLabel: string;
}

export interface BallLevelInfo {
  id: BallLevel;
  name: string;
  planetName: string;
  ageHint: string;
  courtSize: string;
  racketHint: string;
  color: string;
  bgSoft: string;
  ringColor: string;
  emoji: string;
  description: string;
  milestones: GalaxieMilestone[];
}

export const TTCA_AXES: {
  id: TtcaAxis;
  letter: string;
  label: string;
  shortLabel: string;
  emoji: string;
  color: string;
  bgSoft: string;
  description: string;
}[] = [
  {
    id: 'technique',
    letter: 'T',
    label: 'Technique',
    shortLabel: 'Technique',
    emoji: '🎾',
    color: '#C85A32',
    bgSoft: '#FDF0EB',
    description: 'Prises, service, coup droit, revers, volée et jeu de jambes.',
  },
  {
    id: 'tactique',
    letter: 'T',
    label: 'Tactique',
    shortLabel: 'Tactique',
    emoji: '🧠',
    color: '#1E4D3B',
    bgSoft: '#E9F3EE',
    description: 'Placement, déplacement de l’adversaire, choix offensifs et défensifs.',
  },
  {
    id: 'comportement',
    letter: 'C',
    label: 'Comportement',
    shortLabel: 'Comportement',
    emoji: '🤝',
    color: '#D97706',
    bgSoft: '#FEF7E6',
    description: 'Fair-play, respect de l’adversaire, gestion des émotions et attitude.',
  },
  {
    id: 'arbitrage',
    letter: 'A',
    label: 'Arbitrage',
    shortLabel: 'Arbitrage',
    emoji: '⚖️',
    color: '#3B73ED',
    bgSoft: '#EEF4FF',
    description: 'Comptage des points, annonce des fautes et autonomie sur les règles.',
  },
];

export const ACQUISITION_STATUS_META: Record<
  AcquisitionStatus,
  {
    label: string;
    shortLabel: string;
    emoji: string;
    bg: string;
    text: string;
    border: string;
    numericLevel: number;
  }
> = {
  non_evalue: {
    label: 'À travailler',
    shortLabel: 'À travailler',
    emoji: '⚪',
    bg: '#F4F2EF',
    text: '#6B6660',
    border: '#E2DBD2',
    numericLevel: 1,
  },
  en_cours: {
    label: 'En cours d’acquisition',
    shortLabel: 'En cours',
    emoji: '🟡',
    bg: '#FEF7E6',
    text: '#9A6700',
    border: '#F2CE7E',
    numericLevel: 3,
  },
  acquis: {
    label: 'Acquis',
    shortLabel: 'Acquis',
    emoji: '✅',
    bg: '#E9F3EE',
    text: '#1E4D3B',
    border: '#8AC5A8',
    numericLevel: 5,
  },
};

/**
 * Référentiel officiel FFT Galaxie Tennis (Cahier de l'Enseignant FFT & Passeport Galaxie Tennis)
 * Critères de passage T(T)CA : Technique, Tactique, Comportement, Arbitrage.
 */
export const GALAXIE_LEVELS: BallLevelInfo[] = [
  {
    id: 'blanc',
    name: 'Niveau Blanc',
    planetName: 'Planète Nuage Blanc',
    ageHint: '4–7 ans',
    courtSize: 'Terrain 8 m • Sans filet • Ballon paille 26 cm',
    racketHint: 'Raquette 17″ à 19″',
    color: '#64748B',
    bgSoft: '#F1F5F9',
    ringColor: '#CBD5E1',
    emoji: '☁️',
    description: 'Critères FFT de passage du niveau Blanc au niveau Violet.',
    milestones: [
      {
        id: 'blanc-1',
        axis: 'technique',
        subGroup: 'Fond de court',
        label: 'Tenir la raquette en bout de manche et dans les 2 mains en début de point',
        kidLabel: 'Bien tenir sa raquette prête avec les 2 mains',
      },
      {
        id: 'blanc-2',
        axis: 'technique',
        subGroup: 'Fond de court',
        label: 'Jouer en coup droit et en revers en différenciant les faces du tamis',
        kidLabel: 'Envoyer des coups droits et des revers',
      },
      {
        id: 'blanc-3',
        axis: 'technique',
        subGroup: 'Jeu de jambes',
        label: 'Se dégager des trajectoires pour frapper la balle',
        kidLabel: 'Bouger autour de la balle comme un guépard',
      },
      {
        id: 'blanc-4',
        axis: 'tactique',
        label: 'Se placer en début de point, jouer où l’adversaire n’est pas et se replacer',
        kidLabel: 'Envoyer la balle là où l’adversaire n’est pas',
      },
      {
        id: 'blanc-5',
        axis: 'comportement',
        label: 'Respecter les consignes, saluer son adversaire et ranger le matériel',
        kidLabel: 'Être une super coéquipière et saluer son adversaire',
      },
      {
        id: 'blanc-6',
        axis: 'arbitrage',
        label: 'Attendre que l’autre joueur soit prêt avant d’engager et engager à tour de rôle',
        kidLabel: 'Attendre que sa copine soit prête avant de lancer',
      },
    ],
  },
  {
    id: 'violet',
    name: 'Niveau Violet',
    planetName: 'Planète Violette',
    ageHint: '4–7 ans',
    courtSize: 'Terrain 11 m • Filet 50 cm • Balle petit tennis 15 cm',
    racketHint: 'Raquette 19″ à 21″',
    color: '#8B5CF6',
    bgSoft: '#F3EEFF',
    ringColor: '#C4B5FD',
    emoji: '🟣',
    description: 'Critères FFT de passage du niveau Violet au niveau Rouge.',
    milestones: [
      {
        id: 'violet-1',
        axis: 'technique',
        subGroup: 'Service',
        label: 'Adopter la bonne position de départ au service et frapper au-dessus de la tête',
        kidLabel: 'Réussir son service par-dessus la tête',
      },
      {
        id: 'violet-2',
        axis: 'technique',
        subGroup: 'Fond de court',
        label: 'Frapper la balle en avant du corps en coup droit et en revers (attitude d’attention main libre au cœur)',
        kidLabel: 'Frapper la balle bien devant soi en coup droit et revers',
      },
      {
        id: 'violet-3',
        axis: 'technique',
        subGroup: 'Jeu de jambes',
        label: 'Frapper en restant stable sur ses appuis',
        kidLabel: 'Garder un super équilibre au moment de frapper',
      },
      {
        id: 'violet-4',
        axis: 'tactique',
        label: 'Réussir plusieurs frappes consécutives dans l’échange',
        kidLabel: 'Faire plusieurs échanges de suite sans faute',
      },
      {
        id: 'violet-5',
        axis: 'comportement',
        label: 'Annoncer les balles fautes et le score à haute voix avec fair-play',
        kidLabel: 'Annoncer le score à voix haute avec le sourire',
      },
      {
        id: 'violet-6',
        axis: 'arbitrage',
        label: 'Reconnaître une balle bonne d’une balle faute, suivre et mémoriser le score',
        kidLabel: 'Reconnaître si la balle est bonne ou faute et retenir le score',
      },
    ],
  },
  {
    id: 'rouge',
    name: 'Niveau Rouge',
    planetName: 'Planète Terre Rouge',
    ageHint: '6–8 ans',
    courtSize: 'Terrain 12 m • Filet 80 cm • Balle rouge',
    racketHint: 'Raquette 21″ à 23″',
    color: '#DC3545',
    bgSoft: '#FDECEF',
    ringColor: '#FCA5A5',
    emoji: '🔴',
    description: 'Critères FFT de passage du niveau Rouge au niveau Orange.',
    milestones: [
      {
        id: 'rouge-1',
        axis: 'technique',
        subGroup: 'Service',
        label: 'Servir en passant par la position armée et rester en équilibre',
        kidLabel: 'Faire un beau service armé bien en équilibre',
      },
      {
        id: 'rouge-2',
        axis: 'technique',
        subGroup: 'Fond de court',
        label: 'Enchaîner coup droit et revers réguliers en équilibre sur terrain rouge',
        kidLabel: 'Tenir un grand échange coup droit + revers',
      },
      {
        id: 'rouge-3',
        axis: 'tactique',
        label: 'Déplacer l’adversaire sur le terrain (gauche / droite)',
        kidLabel: 'Faire courir son adversaire à gauche et à droite',
      },
      {
        id: 'rouge-4',
        axis: 'tactique',
        label: 'Monter au filet et effectuer des volées contrôlées',
        kidLabel: 'Avancer au filet pour réussir une super volée',
      },
      {
        id: 'rouge-5',
        axis: 'comportement',
        label: 'Accepter les décisions, garder son calme et serrer la main après chaque match',
        kidLabel: 'Rester positive et féliciter son adversaire au filet',
      },
      {
        id: 'rouge-6',
        axis: 'arbitrage',
        label: 'Effectuer un jeu décisif (tie-break) en autonomie',
        kidLabel: 'Jouer et compter un jeu décisif toute seule',
      },
    ],
  },
  {
    id: 'orange',
    name: 'Niveau Orange',
    planetName: 'Planète Soleil Orange',
    ageHint: '7–10 ans',
    courtSize: 'Terrain 18 m • Filet 80 cm • Balle orange',
    racketHint: 'Raquette 23″ à 25″',
    color: '#EA580C',
    bgSoft: '#FFF1E6',
    ringColor: '#FDBA74',
    emoji: '🟠',
    description: 'Critères FFT de passage du niveau Orange au niveau Vert.',
    milestones: [
      {
        id: 'orange-1',
        axis: 'technique',
        subGroup: 'Service',
        label: 'Servir avec de l’effet slicé et accélérer sa 1re balle',
        kidLabel: 'Réussir un service rapide avec effet',
      },
      {
        id: 'orange-2',
        axis: 'technique',
        subGroup: 'Fond de court & Filet',
        label: 'Attitude dynamique relâchée en fond de court et frapper devant soi en avançant au filet',
        kidLabel: 'Frapper fluide du fond et avancer au filet',
      },
      {
        id: 'orange-3',
        axis: 'technique',
        subGroup: 'Jeu de jambes',
        label: 'S’équilibrer, enchaîner ses déplacements (et glisser sur terre battue)',
        kidLabel: 'Enchaîner vite ses appuis et déplacements',
      },
      {
        id: 'orange-4',
        axis: 'tactique',
        label: 'Attaquer en accélérant, défendre en ralentissant, utiliser les effets et se placer en simple/double',
        kidLabel: 'Choisir quand attaquer fort ou défendre haut',
      },
      {
        id: 'orange-5',
        axis: 'comportement',
        label: 'Gérer calmement d’éventuels désaccords avec son adversaire',
        kidLabel: 'Régler un petit doute calmement avec son adversaire',
      },
      {
        id: 'orange-6',
        axis: 'arbitrage',
        label: 'Compter dans le mode « jeu » (15, 30, 40, avantage)',
        kidLabel: 'Compter 15 - 30 - 40 - Jeu en autonomie',
      },
    ],
  },
  {
    id: 'vert',
    name: 'Niveau Vert',
    planetName: 'Planète Émeraude Verte',
    ageHint: '8–10 ans',
    courtSize: 'Court traditionnel • Filet 91 cm • Balle verte',
    racketHint: 'Raquette 25″ à 26″',
    color: '#16A34A',
    bgSoft: '#EAFBF0',
    ringColor: '#86EFAC',
    emoji: '🟢',
    description: 'Critères FFT de validation du niveau Vert vers la balle Jaune.',
    milestones: [
      {
        id: 'vert-1',
        axis: 'technique',
        subGroup: 'Service',
        label: 'Servir slicé ou lifté avec sécurité en 2e balle',
        kidLabel: 'Assurer une 2e balle de service avec effet',
      },
      {
        id: 'vert-2',
        axis: 'technique',
        subGroup: 'Fond de court & Appuis',
        label: 'Traverser la balle en fond de court et savoir accélérer / freiner ses déplacements',
        kidLabel: 'Traverser la balle fort sur tout le grand court',
      },
      {
        id: 'vert-3',
        axis: 'tactique',
        label: 'Construire le point autour de son coup fort et intercepter en double',
        kidLabel: 'Utiliser son coup préféré pour gagner le point',
      },
      {
        id: 'vert-4',
        axis: 'comportement',
        label: 'Respecter son adversaire et conserver une attitude exemplaire en toute circonstance',
        kidLabel: 'Garder une attitude de vraie championne tout le match',
      },
      {
        id: 'vert-5',
        axis: 'arbitrage',
        label: 'Être totalement autonome dans la gestion des règles et du match',
        kidLabel: 'Arbitrer tout son match Galaxie Vert comme une grande',
      },
    ],
  },
];

export const SKILL_CATALOG: {
  key: SkillKey;
  label: string;
  shortLabel: string;
  emoji: string;
  description: string;
}[] = [
  {
    key: 'coup_droit',
    label: 'Coup droit',
    shortLabel: 'Coup droit',
    emoji: '💥',
    description: 'Préparation, plan de frappe devant soi et accompagnement.',
  },
  {
    key: 'revers',
    label: 'Revers',
    shortLabel: 'Revers',
    emoji: '🔄',
    description: 'Placement de profil et frappe fluide à deux mains (ou une main).',
  },
  {
    key: 'service',
    label: 'Service',
    shortLabel: 'Service',
    emoji: '🚀',
    description: 'Position armée, lancer régulier, équilibre et précision.',
  },
  {
    key: 'volee',
    label: 'Volée & Filet',
    shortLabel: 'Volée',
    emoji: '⚡',
    description: 'Frapper devant soi en avançant, réflexes au filet.',
  },
  {
    key: 'deplacements',
    label: 'Jeu de jambes',
    shortLabel: 'Jambes',
    emoji: '👟',
    description: 'Dégagement des trajectoires, stabilité, appuis et replacement.',
  },
  {
    key: 'mental',
    label: 'Comportement & Arbitrage',
    shortLabel: 'Mental / Arb.',
    emoji: '🤝',
    description: 'Fair-play, gestion des émotions, annonce du score et autonomie.',
  },
];

export const SESSION_TYPE_LABELS: Record<
  SessionType,
  { label: string; emoji: string; color: string }
> = {
  cours_club: { label: 'Cours au club', emoji: '🎾', color: '#1E4D3B' },
  jeu_famille: { label: 'Jeu en famille', emoji: '👨‍👧', color: '#C85A32' },
  stage: { label: 'Stage vacances', emoji: '☀️', color: '#D99B26' },
  plateau: { label: 'Jeu & Matchs / Plateau', emoji: '🏅', color: '#7C3AED' },
};

export const CHILD_MOOD_OPTIONS: {
  id: ChildMood;
  label: string;
  emoji: string;
  color: string;
}[] = [
  { id: 'adore', label: "J'ai adoré !", emoji: '🤩', color: '#F59E0B' },
  { id: 'fiere', label: 'Fière de moi', emoji: '💪', color: '#10B981' },
  { id: 'rigolo', label: "C'était rigolo", emoji: '😄', color: '#3B82F6' },
  { id: 'fatiguee', label: 'Un peu fatiguée', emoji: '😴', color: '#8B5CF6' },
  { id: 'difficile', label: "C'était dur", emoji: '🌧️', color: '#EC4899' },
];

export const FAVORITE_MOMENT_CHIPS = [
  '🎾 Les échanges',
  '🚀 Le service',
  '⚡ La volée au filet',
  '🎮 Les jeux rigolos',
  '👯‍♀️ Les copines',
  '🏅 Le petit match',
  '🏃‍♀️ Les courses',
];

export interface AvatarShopItem {
  id: string;
  category: 'headband' | 'racket' | 'companion' | 'outfitColor';
  value: string;
  label: string;
  emoji: string;
  cost: number;
}

export const AVATAR_SHOP_ITEMS: AvatarShopItem[] = [
  { id: 'hb-none', category: 'headband', value: 'none', label: 'Sans bandeau', emoji: '✨', cost: 0 },
  { id: 'hb-coral', category: 'headband', value: 'coral', label: 'Bandeau Terre Battue', emoji: '🎀', cost: 0 },
  { id: 'hb-gold', category: 'headband', value: 'gold', label: 'Bandeau Doré', emoji: '👑', cost: 15 },
  { id: 'hb-star', category: 'headband', value: 'star', label: 'Bandeau Étoile', emoji: '🌟', cost: 25 },
  { id: 'hb-visor', category: 'headband', value: 'visor', label: 'Visière Pro', emoji: '🧢', cost: 35 },

  { id: 'rk-classic', category: 'racket', value: 'classic', label: 'Raquette Club', emoji: '🎾', cost: 0 },
  { id: 'rk-rainbow', category: 'racket', value: 'rainbow', label: 'Raquette Arc-en-ciel', emoji: '🌈', cost: 20 },
  { id: 'rk-star', category: 'racket', value: 'star_pro', label: 'Raquette Galaxie', emoji: '☄️', cost: 35 },
  { id: 'rk-clay', category: 'racket', value: 'clay_champ', label: 'Raquette Roland', emoji: '🏆', cost: 50 },

  { id: 'cp-none', category: 'companion', value: 'none', label: 'En solo', emoji: '🌸', cost: 0 },
  { id: 'cp-ball', category: 'companion', value: 'ball_buddy', label: 'Balle Rigolote', emoji: '🟡', cost: 15 },
  { id: 'cp-puppy', category: 'companion', value: 'puppy', label: 'Chiot Ramasseur', emoji: '🐶', cost: 30 },
  { id: 'cp-cat', category: 'companion', value: 'star_cat', label: 'Chaton Étoile', emoji: '🐱', cost: 40 },
  { id: 'cp-owl', category: 'companion', value: 'trophy_owl', label: 'Hibou Coach', emoji: '🦉', cost: 55 },

  { id: 'out-white', category: 'outfitColor', value: '#FFFFFF', label: 'Blanc Wimbledon', emoji: '🤍', cost: 0 },
  { id: 'out-coral', category: 'outfitColor', value: '#EE6C4D', label: 'Corail Roland', emoji: '🧡', cost: 0 },
  { id: 'out-mint', category: 'outfitColor', value: '#2A9D8F', label: 'Menthe Fraîche', emoji: '💚', cost: 10 },
  { id: 'out-sky', category: 'outfitColor', value: '#3B82F6', label: 'Bleu Galaxie', emoji: '💙', cost: 15 },
  { id: 'out-pink', category: 'outfitColor', value: '#EC4899', label: 'Rose Championne', emoji: '🩷', cost: 20 },
  { id: 'out-sun', category: 'outfitColor', value: '#F59E0B', label: 'Jaune Soleil', emoji: '💛', cost: 20 },
];

export const CHALLENGE_TEMPLATES: {
  title: string;
  description: string;
  category: 'technique' | 'echanges' | 'service' | 'fairplay' | 'jeu';
  starsReward: number;
}[] = [
  {
    title: 'Faire 8 échanges de suite',
    description: 'Réussir un échange de 8 balles sans faute avec Papa, Maman ou une copine.',
    category: 'echanges',
    starsReward: 15,
  },
  {
    title: '3 services armés dans le carré',
    description: 'Passer par la position armée et réussir 3 beaux services en équilibre.',
    category: 'service',
    starsReward: 15,
  },
  {
    title: 'Super revers à deux mains',
    description: 'Frapper la balle bien devant soi en revers pendant le cours.',
    category: 'technique',
    starsReward: 15,
  },
  {
    title: 'Défi jongles magiques',
    description: 'Faire 10 petits jongles de suite avec la raquette.',
    category: 'jeu',
    starsReward: 10,
  },
  {
    title: 'Reine du replacement',
    description: 'Penser à revenir au milieu du terrain après chaque frappe pendant le jeu.',
    category: 'technique',
    starsReward: 15,
  },
  {
    title: 'Médaille du Super Fair-Play',
    description: 'Annoncer le score à voix haute et féliciter son adversaire au filet.',
    category: 'fairplay',
    starsReward: 10,
  },
];

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  emoji: string;
}

export const TENNIS_QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    question: "Comment s'appelle un service que l'adversaire n'arrive même pas à toucher ?",
    options: ['Un Ace !', 'Un Smash', 'Un Filet'],
    correctIndex: 0,
    explanation: "Bravo ! Un « Ace », c'est un service gagnant que personne ne touche.",
    emoji: '🚀',
  },
  {
    id: 'q2',
    question: 'Combien de rebonds la balle a-t-elle le droit de faire avant que tu la frappes ?',
    options: ['Deux rebonds', 'Un seul rebond (ou zéro à la volée)', 'Trois rebonds'],
    correctIndex: 1,
    explanation: 'Au tennis, la balle peut rebondir 1 fois maximum... ou 0 fois si tu fais une volée !',
    emoji: '🎾',
  },
  {
    id: 'q3',
    question: "Comment compte-t-on les points dans un jeu de tennis ?",
    options: ['10 - 20 - 30', '15 - 30 - 40', '5 - 10 - 15'],
    correctIndex: 1,
    explanation: 'Exact ! On compte 15, 30, 40... puis Jeu !',
    emoji: '🔢',
  },
  {
    id: 'q4',
    question: "Que fait-on toujours à la fin d'un match de tennis ?",
    options: [
      'On part vite sans rien dire',
      'On serre la main (ou on checke) son adversaire au filet',
      'On lance sa raquette',
    ],
    correctIndex: 1,
    explanation: 'Oui ! Au tennis, le fair-play c’est sacré : on félicite toujours son adversaire au filet.',
    emoji: '🤝',
  },
  {
    id: 'q5',
    question: "Comment appelle-t-on une frappe faite avant que la balle ne touche le sol ?",
    options: ['Une volée', 'Un lob', 'Un rebond'],
    correctIndex: 0,
    explanation: "Super ! Une volée se joue près du filet, avant le rebond !",
    emoji: '⚡',
  },
  {
    id: 'q6',
    question: "Où faut-il revenir après avoir frappé sa balle ?",
    options: [
      'Tout au coin du terrain',
      'Au centre du terrain, prête à repartir',
      'Derrière le banc',
    ],
    correctIndex: 1,
    explanation: 'Exactement ! Revenir au centre permet d’attraper toutes les balles suivantes.',
    emoji: '🎯',
  },
  {
    id: 'q7',
    question: 'Quelle balle vient juste après la balle Rouge dans la Galaxie Tennis ?',
    options: ['La balle Orange', 'La balle Blanche', 'La balle Violette'],
    correctIndex: 0,
    explanation: 'Bravo ! L’ordre Galaxie Tennis est : Blanc → Violet → Rouge → Orange → Vert !',
    emoji: '🟠',
  },
  {
    id: 'q8',
    question: "Quand on dit « Let » au service, que s'est-il passé ?",
    options: [
      'La balle a touché le haut du filet et est tombée dans le bon carré',
      'Le match est terminé',
      'Il faut changer de raquette',
    ],
    correctIndex: 0,
    explanation: 'Bien joué ! Sur un « Let », on rejoue simplement le service.',
    emoji: '🕸️',
  },
  {
    id: 'q9',
    question: 'Quelle est la couleur célèbre des terrains de Roland-Garros à Paris ?',
    options: ['Bleu glacé', 'Terre battue ocre-rouge', 'Jaune fluo'],
    correctIndex: 1,
    explanation: 'Oui ! Roland-Garros se joue sur la fameuse terre battue rouge-orange !',
    emoji: '🏟️',
  },
  {
    id: 'q10',
    question: "Si la balle tombe pile SUR la ligne blanche du terrain, elle est...",
    options: ['Faute', 'Bonne !', 'À rejouer'],
    correctIndex: 1,
    explanation: 'Bonne ! Une balle qui touche la ligne, même un tout petit peu, est dans le terrain !',
    emoji: '✨',
  },
];

export const DAILY_QUIZ_STAR_CAP = 15;

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
  color: string;
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  {
    id: 'first-session',
    title: 'Première Balle',
    description: 'Enregistrer sa 1re séance de tennis',
    emoji: '🎾',
    color: '#F59E0B',
  },
  {
    id: 'streak-3',
    title: 'Flamme de 3',
    description: 'Atteindre une série de 3 séances',
    emoji: '🔥',
    color: '#EF4444',
  },
  {
    id: 'five-sessions',
    title: 'Habituée du Court',
    description: 'Cumuler 5 séances ou plus',
    emoji: '🏟️',
    color: '#10B981',
  },
  {
    id: 'challenge-hero',
    title: 'Chasseuse de Défis',
    description: 'Valider au moins 2 défis de la semaine',
    emoji: '🎯',
    color: '#3B82F6',
  },
  {
    id: 'quiz-whiz',
    title: 'Reine du Quiz',
    description: 'Réussir au moins 4/5 au Mini-Quiz Tennis',
    emoji: '🧠',
    color: '#8B5CF6',
  },
  {
    id: 'mood-sharer',
    title: 'Cœur sur le Court',
    description: 'Partager son humeur après une séance',
    emoji: '💖',
    color: '#EC4899',
  },
  {
    id: 'plateau-star',
    title: 'Joueuse de Plateau',
    description: 'Participer à un plateau ou journée Jeu & Matchs',
    emoji: '🏅',
    color: '#D97706',
  },
  {
    id: 'star-collector',
    title: 'Pluie d’Étoiles',
    description: 'Gagner 100 étoiles au total',
    emoji: '🌟',
    color: '#EAB308',
  },
  {
    id: 'milestone-5',
    title: 'Exploratrice Galaxie',
    description: 'Valider 5 critères TTCA sur la carte Galaxie Tennis',
    emoji: '🪐',
    color: '#0EA5E9',
  },
  {
    id: 'fashion-pro',
    title: 'Style de Championne',
    description: 'Débloquer un accessoire pour son avatar',
    emoji: '👑',
    color: '#F43F5E',
  },
  {
    id: 'memory-keeper',
    title: 'Album Souvenir',
    description: 'Ajouter une photo ou vidéo souvenir',
    emoji: '📸',
    color: '#14B8A6',
  },
  {
    id: 'service-ace',
    title: 'Validée par le Coach',
    description: 'Obtenir le statut Acquis sur le Service ou le Coup droit',
    emoji: '🚀',
    color: '#C85A32',
  },
];
