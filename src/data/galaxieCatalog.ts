import type { BallLevel, ChildMood, SessionType, SkillKey } from '../types/tennis';

export interface GalaxieMilestone {
  id: string;
  label: string;
  kidLabel: string;
}

export interface BallLevelInfo {
  id: BallLevel;
  name: string;
  planetName: string;
  ageHint: string;
  courtSize: string;
  color: string;
  bgSoft: string;
  ringColor: string;
  emoji: string;
  description: string;
  milestones: GalaxieMilestone[];
}

export const GALAXIE_LEVELS: BallLevelInfo[] = [
  {
    id: 'blanc',
    name: 'Niveau Blanc',
    planetName: 'Planète Nuage Blanc',
    ageHint: 'Découverte (4–6 ans)',
    courtSize: 'Mini-terrain 8m • Balle mousse',
    color: '#64748B',
    bgSoft: '#F1F5F9',
    ringColor: '#CBD5E1',
    emoji: '☁️',
    description: 'Découvrir la raquette, les rebonds et s’amuser avec la balle.',
    milestones: [
      {
        id: 'blanc-1',
        label: 'Tenir sa raquette et jongler 5 fois avec la balle mousse',
        kidLabel: 'Faire 5 jongles magiques avec la raquette',
      },
      {
        id: 'blanc-2',
        label: 'Envoyer la balle par-dessus le mini-filet après un rebond',
        kidLabel: 'Passer la balle au-dessus du filet',
      },
      {
        id: 'blanc-3',
        label: 'Se déplacer vers la balle et s’arrêter pour frapper',
        kidLabel: 'Courir vers la balle comme un guépard',
      },
      {
        id: 'blanc-4',
        label: 'Respecter les consignes et ranger le matériel avec le sourire',
        kidLabel: 'Être une super coéquipière au cours',
      },
    ],
  },
  {
    id: 'violet',
    name: 'Niveau Violet',
    planetName: 'Planète Violette',
    ageHint: '5–7 ans',
    courtSize: 'Terrain 11m • Balle mousse / souple',
    color: '#8B5CF6',
    bgSoft: '#F3EEFF',
    ringColor: '#C4B5FD',
    emoji: '🟣',
    description: 'Commencer les échanges de 4 à 6 balles et les premiers petits matchs.',
    milestones: [
      {
        id: 'violet-1',
        label: 'Réaliser 6 échanges consécutifs avec un partenaire',
        kidLabel: 'Faire 6 échanges de suite sans faire tomber la balle',
      },
      {
        id: 'violet-2',
        label: 'Différencier coup droit et revers avec préparation',
        kidLabel: 'Maîtriser le coup droit ET le revers',
      },
      {
        id: 'violet-3',
        label: 'Engager à la cuillère dans le terrain adverse',
        kidLabel: 'Réussir son engagement dans le terrain',
      },
      {
        id: 'violet-4',
        label: 'Connaître les lignes du terrain violet et serrer la main',
        kidLabel: 'Connaître son terrain et saluer son adversaire',
      },
    ],
  },
  {
    id: 'rouge',
    name: 'Niveau Rouge',
    planetName: 'Planète Terre Rouge',
    ageHint: '6–8 ans',
    courtSize: 'Terrain 12m • Balle rouge',
    color: '#DC3545',
    bgSoft: '#FDECEF',
    ringColor: '#FCA5A5',
    emoji: '🔴',
    description: 'Construire un vrai échange, servir par-dessus l’épaule et jouer des plateaux.',
    milestones: [
      {
        id: 'rouge-1',
        label: 'Tenir un échange régulier de 10 balles sur terrain rouge',
        kidLabel: 'Tenir 10 échanges de suite comme une championne',
      },
      {
        id: 'rouge-2',
        label: 'Servir par-dessus l’épaule dans le bon carré de service',
        kidLabel: 'Faire un vrai service par-dessus la tête',
      },
      {
        id: 'rouge-3',
        label: 'Monter au filet pour faire une volée contrôlée',
        kidLabel: 'Réussir une volée au filet',
      },
      {
        id: 'rouge-4',
        label: 'Jouer un petit match en comptant les points jusqu’à 7 ou 10',
        kidLabel: 'Jouer un match complet et compter les points',
      },
      {
        id: 'rouge-5',
        label: 'Se replacer au centre du terrain après chaque frappe',
        kidLabel: 'Toujours revenir au centre du terrain',
      },
    ],
  },
  {
    id: 'orange',
    name: 'Niveau Orange',
    planetName: 'Planète Soleil Orange',
    ageHint: '7–9 ans',
    courtSize: 'Terrain 18m • Balle orange',
    color: '#EA580C',
    bgSoft: '#FFF1E6',
    ringColor: '#FDBA74',
    emoji: '🟠',
    description: 'Varier les directions, bouger son adversaire et découvrir la tactique.',
    milestones: [
      {
        id: 'orange-1',
        label: 'Diriger la balle à droite ou à gauche volontairement',
        kidLabel: 'Viser à gauche ou à droite du terrain',
      },
      {
        id: 'orange-2',
        label: 'Enchaîner un service régulier puis un coup de fond de court',
        kidLabel: 'Enchaîner service + coup droit',
      },
      {
        id: 'orange-3',
        label: 'Faire un revers solide à deux mains en déplacement',
        kidLabel: 'Envoyer un super revers en courant',
      },
      {
        id: 'orange-4',
        label: 'Compter les jeux (15, 30, 40) et annoncer le score',
        kidLabel: 'Compter 15 - 30 - 40 toute seule',
      },
      {
        id: 'orange-5',
        label: 'Rester calme et positive même après un point perdu',
        kidLabel: 'Garder le sourire même quand un point est dur',
      },
    ],
  },
  {
    id: 'vert',
    name: 'Niveau Vert',
    planetName: 'Planète Émeraude Verte',
    ageHint: '9–10 ans',
    courtSize: 'Grand terrain • Balle verte',
    color: '#16A34A',
    bgSoft: '#EAFBF0',
    ringColor: '#86EFAC',
    emoji: '🟢',
    description: 'Jouer sur tout le grand court avec régularité, tactique et autonomie.',
    milestones: [
      {
        id: 'vert-1',
        label: 'Échanger 15 balles depuis la ligne de fond du grand terrain',
        kidLabel: 'Faire 15 échanges sur le grand terrain',
      },
      {
        id: 'vert-2',
        label: 'Utiliser la volée et le smash pour finir un point',
        kidLabel: 'Finir un point au filet avec une volée ou un smash',
      },
      {
        id: 'vert-3',
        label: 'Gérer une 1re et une 2e balle de service fiable',
        kidLabel: 'Maîtriser sa 1re et sa 2e balle de service',
      },
      {
        id: 'vert-4',
        label: 'Arbitrer et gérer un match en format Galaxie Vert en autonomie',
        kidLabel: 'Gérer tout un match Galaxie Vert comme une grande',
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
    description: 'Lancer de balle régulier, geste par-dessus la tête et précision.',
  },
  {
    key: 'volee',
    label: 'Volée & Filet',
    shortLabel: 'Volée',
    emoji: '⚡',
    description: 'Raquette devant soi, réflexes et envie d’avancer au filet.',
  },
  {
    key: 'deplacements',
    label: 'Jeu de jambes',
    shortLabel: 'Jambes',
    emoji: '👟',
    description: 'Petits pas d’ajustement, reprise d’appui et replacement au centre.',
  },
  {
    key: 'mental',
    label: 'Plaisir & Fair-play',
    shortLabel: 'Mental',
    emoji: '💛',
    description: 'Concentration, écoute du coach, courage et esprit sportif.',
  },
];

export const SESSION_TYPE_LABELS: Record<
  SessionType,
  { label: string; emoji: string; color: string }
> = {
  cours_club: { label: 'Cours au club', emoji: '🎾', color: '#1E4D3B' },
  jeu_famille: { label: 'Jeu en famille', emoji: '👨‍👧', color: '#C85A32' },
  stage: { label: 'Stage vacances', emoji: '☀️', color: '#D99B26' },
  plateau: { label: 'Plateau Galaxie', emoji: '🏅', color: '#7C3AED' },
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
  // Headbands
  { id: 'hb-none', category: 'headband', value: 'none', label: 'Sans bandeau', emoji: '✨', cost: 0 },
  { id: 'hb-coral', category: 'headband', value: 'coral', label: 'Bandeau Terre Battue', emoji: '🎀', cost: 0 },
  { id: 'hb-gold', category: 'headband', value: 'gold', label: 'Bandeau Doré', emoji: '👑', cost: 15 },
  { id: 'hb-star', category: 'headband', value: 'star', label: 'Bandeau Étoile', emoji: '🌟', cost: 25 },
  { id: 'hb-visor', category: 'headband', value: 'visor', label: 'Visière Pro', emoji: '🧢', cost: 35 },

  // Rackets
  { id: 'rk-classic', category: 'racket', value: 'classic', label: 'Raquette Club', emoji: '🎾', cost: 0 },
  { id: 'rk-rainbow', category: 'racket', value: 'rainbow', label: 'Raquette Arc-en-ciel', emoji: '🌈', cost: 20 },
  { id: 'rk-star', category: 'racket', value: 'star_pro', label: 'Raquette Galaxie', emoji: '☄️', cost: 35 },
  { id: 'rk-clay', category: 'racket', value: 'clay_champ', label: 'Raquette Roland', emoji: '🏆', cost: 50 },

  // Companions
  { id: 'cp-none', category: 'companion', value: 'none', label: 'En solo', emoji: '🌸', cost: 0 },
  { id: 'cp-ball', category: 'companion', value: 'ball_buddy', label: 'Balle Rigolote', emoji: '🟡', cost: 15 },
  { id: 'cp-puppy', category: 'companion', value: 'puppy', label: 'Chiot Ramasseur', emoji: '🐶', cost: 30 },
  { id: 'cp-cat', category: 'companion', value: 'star_cat', label: 'Chaton Étoile', emoji: '🐱', cost: 40 },
  { id: 'cp-owl', category: 'companion', value: 'trophy_owl', label: 'Hibou Coach', emoji: '🦉', cost: 55 },

  // Outfit colors
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
    title: '3 services réussis dans le carré',
    description: 'Lancer la balle bien haut et réussir 3 beaux services dans le bon carré.',
    category: 'service',
    starsReward: 15,
  },
  {
    title: 'Super revers à deux mains',
    description: 'Se tourner de profil et réussir 5 beaux revers pendant le cours.',
    category: 'technique',
    starsReward: 15,
  },
  {
    title: 'Défi jongles magiques',
    description: 'Faire 10 petits jongles de suite avec la raquette (côté coup droit ou revers).',
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
    description: 'Encourager sa partenaire et dire merci au coach à la fin de la séance.',
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
    description: 'Participer à un plateau ou petit match Galaxie',
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
    description: 'Valider 5 étapes sur la carte Galaxie Tennis',
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
    title: 'As du Service',
    description: 'Atteindre le niveau 4/5 au service ou coup droit',
    emoji: '🚀',
    color: '#C85A32',
  },
];
