import { CHALLENGE_TEMPLATES } from './galaxieCatalog';
import type { Club, FamilyState, StudioChallengeTemplate, StudioRewardTemplate } from '../types/tennis';

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function daysAhead(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function createDefaultStudioChallenges(): StudioChallengeTemplate[] {
  return CHALLENGE_TEMPLATES.map((tpl, idx) => ({
    id: `tpl-ch-${idx + 1}`,
    ...tpl,
  }));
}

export function createDefaultStudioRewards(): StudioRewardTemplate[] {
  return [
    {
      id: 'tpl-rew-1',
      title: 'Choisir le film du vendredi',
      description: 'Tu es la cheffe de la soirée cinéma en famille !',
      emoji: '🎬',
      starCost: 30,
    },
    {
      id: 'tpl-rew-2',
      title: 'Glace après le cours',
      description: 'Une bonne boule de glace au choix après l’entraînement.',
      emoji: '🍦',
      starCost: 25,
    },
    {
      id: 'tpl-rew-3',
      title: 'Nouveau grip coloré',
      description: 'Choisir un nouveau surgrip rigolo pour sa raquette.',
      emoji: '🎨',
      starCost: 50,
    },
    {
      id: 'tpl-rew-4',
      title: 'Sortie crêpes en famille',
      description: 'Un goûter crêpes chocolat ou confiture au choix !',
      emoji: '🥞',
      starCost: 60,
    },
  ];
}

export function createInitialDemoState(): FamilyState {
  const childId = 'child-lea-demo';
  const clubId = 'club-lilas-demo';
  const now = new Date().toISOString();

  const defaultClubs: Club[] = [
    {
      id: clubId,
      name: 'Tennis Club des Lilas',
      coachName: 'Coach Camille',
      coachPhone: '06 12 34 56 78',
      coachEmail: 'camille.coach@tclilas.fr',
      schedule: 'Mercredi 14h00–15h00 & Samedi 10h30–11h30',
      courtSurface: 'Terre battue & Résine couverte',
      address: '12 allée des Courts',
    },
  ];

  const studioChallenges = createDefaultStudioChallenges();
  const studioRewards = createDefaultStudioRewards();

  return {
    familyName: 'Famille Tennis',
    parentPin: '1234',
    tabletLocked: false,
    activeChildId: childId,
    clubs: defaultClubs,
    studioChallenges,
    studioRewards,
    children: [
      {
        id: childId,
        name: 'Léa',
        age: 7,
        currentBall: 'rouge',
        clubId,
        starsBalance: 45,
        totalStarsEarned: 115,
        streakCount: 4,
        childTheme: 'terre-battue',
        avatarConfig: {
          skinColor: '#F4C7A6',
          hairStyle: 'ponytail',
          hairColor: '#5B3A29',
          outfitColor: '#FFFFFF',
          headband: 'coral',
          racket: 'classic',
          companion: 'ball_buddy',
        },
        unlockedItems: [
          'hb-none',
          'hb-coral',
          'rk-classic',
          'cp-none',
          'cp-ball',
          'out-white',
          'out-coral',
        ],
        milestonesCompleted: [
          'blanc-1',
          'blanc-2',
          'blanc-3',
          'blanc-4',
          'violet-1',
          'violet-2',
          'violet-3',
          'violet-4',
          'rouge-1',
          'rouge-2',
          'rouge-5',
        ],
        skillLevels: {
          coup_droit: {
            level: 4,
            note: 'Très belle préparation, frappe bien devant elle en balle rouge.',
            updatedAt: daysAgo(2),
          },
          revers: {
            level: 3,
            note: 'Revers à deux mains en net progrès, bien penser à tourner les épaules.',
            updatedAt: daysAgo(2),
          },
          service: {
            level: 3,
            note: 'Commence à servir par-dessus l’épaule avec un bon lancer.',
            updatedAt: daysAgo(5),
          },
          volee: {
            level: 2,
            note: 'Découverte ludique au filet, adore les jeux de réflexes.',
            updatedAt: daysAgo(9),
          },
          deplacements: {
            level: 4,
            note: 'Très dynamique, revient spontanément au centre du terrain.',
            updatedAt: daysAgo(2),
          },
          mental: {
            level: 5,
            note: 'Toujours souriante, encourage ses copines et écoute bien le coach.',
            updatedAt: daysAgo(2),
          },
        },
        clubInfo: {
          clubName: 'Tennis Club des Lilas',
          coachName: 'Coach Camille',
          coachPhone: '06 12 34 56 78',
          coachEmail: 'camille.coach@tclilas.fr',
          schedule: 'Mercredi 14h00–15h00 & Samedi 10h30–11h30',
          courtSurface: 'Terre battue & Résine couverte',
        },
        equipmentInfo: {
          racketModel: 'Babolat Ballfighter Junior',
          racketSize: '23 pouces',
          gripColor: 'Corail fluo',
          shoeSize: '32 (semelle terre battue)',
          notes: 'Penser à vérifier la taille 25 pouces vers 8–9 ans.',
        },
        createdAt: now,
      },
    ],
    sessions: [
      {
        id: 'sess-1',
        childId,
        clubId,
        sessionDate: daysAgo(1),
        sessionType: 'cours_club',
        durationMin: 60,
        focusSkills: ['coup_droit', 'service'],
        effortRating: 5,
        starsAwarded: 15,
        coachNote:
          'Super séance sur le service par-dessus la tête ! Léa a réussi 6 échanges de suite en fond de court.',
        parentNote:
          'Elle est sortie du court avec un immense sourire et voulait rejouer dans le jardin.',
        createdAt: now,
      },
      {
        id: 'sess-2',
        childId,
        clubId,
        sessionDate: daysAgo(4),
        sessionType: 'jeu_famille',
        durationMin: 40,
        focusSkills: ['revers', 'deplacements'],
        effortRating: 4,
        starsAwarded: 10,
        coachNote: '',
        parentNote: 'Petits matchs en 7 points au club sur terrain rouge, super revers à deux mains.',
        childMood: 'adore',
        childFavoriteMoment: '🎾 Les échanges',
        createdAt: now,
      },
      {
        id: 'sess-3',
        childId,
        clubId,
        sessionDate: daysAgo(8),
        sessionType: 'cours_club',
        durationMin: 60,
        focusSkills: ['volee', 'mental'],
        effortRating: 5,
        starsAwarded: 15,
        coachNote: 'Très bon atelier volée au filet, super écoute des consignes.',
        parentNote: 'Bien fatiguée mais très fière de ses volées.',
        childMood: 'fiere',
        childFavoriteMoment: '⚡ La volée au filet',
        createdAt: now,
      },
      {
        id: 'sess-4',
        childId,
        clubId,
        sessionDate: daysAgo(15),
        sessionType: 'plateau',
        durationMin: 90,
        focusSkills: ['mental', 'deplacements'],
        effortRating: 5,
        starsAwarded: 20,
        coachNote: 'Premier plateau Galaxie Rouge ! Très bon esprit sportif.',
        parentNote: 'Elle a joué 4 petits matchs de 10 minutes contre des enfants d’autres clubs.',
        childMood: 'rigolo',
        childFavoriteMoment: '🏅 Le petit match',
        createdAt: now,
      },
    ],
    challenges: [
      {
        id: 'chal-1',
        childId,
        templateId: 'tpl-ch-1',
        title: 'Faire 8 échanges de suite',
        description: 'Réussir un échange de 8 balles sans faute sur terrain rouge.',
        category: 'echanges',
        starsReward: 15,
        status: 'pending_approval',
        weekLabel: 'Cette semaine',
        requestedAt: now,
        createdAt: now,
      },
      {
        id: 'chal-2',
        childId,
        templateId: 'tpl-ch-2',
        title: '3 services par-dessus la tête',
        description: 'Lancer la balle bien haut et réussir 3 services dans le carré.',
        category: 'service',
        starsReward: 15,
        status: 'active',
        weekLabel: 'Cette semaine',
        createdAt: now,
      },
      {
        id: 'chal-3',
        childId,
        templateId: 'tpl-ch-6',
        title: 'Médaille du Super Fair-Play',
        description: 'Encourager ses copines et ranger toutes les balles avec le sourire.',
        category: 'fairplay',
        starsReward: 10,
        status: 'completed',
        weekLabel: 'Semaine dernière',
        parentFeedback: 'Bravo ma championne, le coach était super fier de toi !',
        completedAt: daysAgo(5),
        createdAt: now,
      },
    ],
    tournaments: [
      {
        id: 'tour-1',
        childId,
        name: 'Plateau Galaxie Rouge d’Automne',
        eventDate: daysAgo(15),
        ballLevel: 'rouge',
        matchesPlayed: 4,
        highlight: 'A réussi son tout premier service gagnant en match !',
        positivePoints:
          'Beaucoup de sourires, a compté les points toute seule et s’est fait une nouvelle copine.',
        location: 'TC des Lilas',
        createdAt: now,
      },
    ],
    rewards: studioRewards.map((tpl, idx) => ({
      id: `rew-${idx + 1}`,
      childId,
      templateId: tpl.id,
      title: tpl.title,
      description: tpl.description,
      emoji: tpl.emoji,
      starCost: tpl.starCost,
      active: true,
    })),
    redemptions: [],
    memories: [
      {
        id: 'mem-1',
        childId,
        title: 'Super coup droit sur terre battue !',
        memoryDate: daysAgo(4),
        caption: 'Un après-midi ensoleillé au club avec des échanges en balle rouge et orange.',
        mediaType: 'photo',
        mediaUrl: './sample-court.jpg',
        tag: 'Entraînement',
        createdAt: now,
      },
    ],
    quizAttempts: [
      {
        id: 'quiz-1',
        childId,
        attemptDate: daysAgo(3),
        score: 4,
        totalQuestions: 5,
        starsEarned: 12,
        createdAt: now,
      },
    ],
    upcomingEvents: [
      {
        id: 'evt-1',
        childId,
        title: 'Cours Galaxie Rouge',
        eventDate: daysAhead(2),
        eventTime: '14h00',
        eventType: 'cours',
        location: 'TC des Lilas — Court n°2',
        notes: 'Penser à la gourde et au bandeau.',
      },
      {
        id: 'evt-2',
        childId,
        title: 'Mini-Plateau Galaxie Rouge / Orange',
        eventDate: daysAhead(9),
        eventTime: '10h00',
        eventType: 'plateau',
        location: 'Tennis Club du Parc',
        notes: 'Goûter partagé après les matchs.',
      },
    ],
  };
}
