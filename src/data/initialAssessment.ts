import { ACQUISITION_STATUS_META, GALAXIE_LEVELS } from './galaxieCatalog';
import type { AcquisitionStatus, BallLevel, MilestoneEvaluation, SkillEntry, SkillKey } from '../types/tennis';

export interface AssessmentOption {
  label: string;
  hint: string;
  points: number; // 0=Blanc, 1=Violet, 2=Rouge, 3=Orange, 4=Vert
}

export interface AssessmentQuestion {
  id: string;
  axisLabel: string;
  emoji: string;
  question: string;
  relatedSkill: SkillKey;
  options: AssessmentOption[];
}

export const INITIAL_ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'rally',
    axisLabel: 'Échange & Coup droit',
    emoji: '💥',
    question: 'Comment se déroulent ses échanges aujourd’hui ?',
    relatedSkill: 'coup_droit',
    options: [
      { label: 'Découvre la raquette et les rebonds', hint: 'Ballon mousse ou balle très lente (8 m)', points: 0 },
      { label: 'Fait 4 à 6 échanges sur mini-terrain', hint: 'Commence à enchaîner plusieurs frappes', points: 1 },
      { label: 'Tient 8 à 10 échanges en balle rouge', hint: 'Terrain 12 m, coup droit et revers réguliers', points: 2 },
      { label: 'Dirige la balle gauche / droite sur terrain 18 m', hint: 'Balle orange, varie les trajectoires', points: 3 },
      { label: 'Échange 15+ balles sur le grand court', hint: 'Balle verte, traverse bien la balle', points: 4 },
    ],
  },
  {
    id: 'backhand',
    axisLabel: 'Revers & Régularité',
    emoji: '🔄',
    question: 'Quelle est son aisance côté revers ?',
    relatedSkill: 'revers',
    options: [
      { label: 'Débute la distinction coup droit / revers', hint: 'Découverte des 2 faces du tamis', points: 0 },
      { label: 'Frappe devant soi en revers sur balle lente', hint: 'À une ou deux mains sur petit terrain', points: 1 },
      { label: 'Enchaîne coup droit et revers en équilibre', hint: 'Régulier en balle rouge', points: 2 },
      { label: 'Revers solide en déplacement (terrain 18 m)', hint: 'Garde du relâchement en balle orange', points: 3 },
      { label: 'Utilise son revers pour construire ou contre-attaquer', hint: 'Aisance sur grand terrain balle verte', points: 4 },
    ],
  },
  {
    id: 'serve',
    axisLabel: 'Service',
    emoji: '🚀',
    question: 'Comment engage-t-il / engage-t-elle le point ?',
    relatedSkill: 'service',
    options: [
      { label: 'Lancer ou engagement simple à la cuillère', hint: 'Met la balle en jeu après rebond ou main', points: 0 },
      { label: 'Débute le service par-dessus la tête', hint: 'Position de départ et frappe haute', points: 1 },
      { label: 'Sert en passant par la position armée en équilibre', hint: 'Service régulier sur terrain rouge', points: 2 },
      { label: 'Accélère sa 1re balle et commence l’effet slicé', hint: 'Terrain 18 m balle orange', points: 3 },
      { label: 'Maîtrise une 1re balle et une 2e balle sécurisée', hint: 'Effet slicé ou lifté sur grand court', points: 4 },
    ],
  },
  {
    id: 'volley_footwork',
    axisLabel: 'Filet & Jeu de jambes',
    emoji: '⚡',
    question: 'Comment se déplace-t-il / elle et joue au filet ?',
    relatedSkill: 'volee',
    options: [
      { label: 'Apprend à se dégager de la trajectoire', hint: 'Se placer et se replacer sur 8 m', points: 0 },
      { label: 'Frappe en restant stable sur ses appuis', hint: 'Commence à bien s’équilibrer', points: 1 },
      { label: 'Monte au filet et réussit des volées contrôlées', hint: 'Déplace son adversaire en balle rouge', points: 2 },
      { label: 'Enchaîne vite ses appuis et frappe en avançant au filet', hint: 'Sait attaquer et défendre en balle orange', points: 3 },
      { label: 'Accélère/freine sur tout le court et intercepte au filet', hint: 'À l’aise en simple et double balle verte', points: 4 },
    ],
  },
  {
    id: 'scoring_umpiring',
    axisLabel: 'Arbitrage & Comptage',
    emoji: '⚖️',
    question: 'Quel est son niveau d’autonomie pour compter les points ?',
    relatedSkill: 'deplacements',
    options: [
      { label: 'Attend que l’autre soit prêt et engage à tour de rôle', hint: 'Découverte des règles de base', points: 0 },
      { label: 'Reconnaît balle bonne / faute et retient le score simple', hint: 'Annonce le score à voix haute', points: 1 },
      { label: 'Sait jouer un jeu décisif (tie-break) en autonomie', hint: 'Matchs en 7 ou 10 points', points: 2 },
      { label: 'Compte dans le mode « jeu » (15, 30, 40, avantage)', hint: 'Autonome sur un set court', points: 3 },
      { label: 'Totalement autonome sur les règles en match complet', hint: 'Gère un match Galaxie Vert seul(e)', points: 4 },
    ],
  },
  {
    id: 'attitude',
    axisLabel: 'Comportement & Fair-play',
    emoji: '🤝',
    question: 'Comment vit-il / elle les petits matchs et l’opposition ?',
    relatedSkill: 'mental',
    options: [
      { label: 'Découvre le jeu en groupe et respecte les consignes', hint: 'Plaisir et découverte', points: 0 },
      { label: 'Annonce les fautes et le score avec le sourire', hint: 'Bon esprit sur les premiers matchs', points: 1 },
      { label: 'Garde son calme et félicite son adversaire au filet', hint: 'À l’aise en journée Jeu & Matchs', points: 2 },
      { label: 'Sait gérer calmement un désaccord sur une balle', hint: 'Maturité en matchs homologués Orange', points: 3 },
      { label: 'Attitude exemplaire en toute circonstance en tournoi', hint: 'Autonomie complète en compétition', points: 4 },
    ],
  },
];

export interface InitialAssessmentResult {
  recommendedBall: BallLevel;
  averageScore: number;
  summary: string;
  milestoneEvaluations: Record<string, MilestoneEvaluation>;
  milestonesCompleted: string[];
  skillLevels: Record<SkillKey, SkillEntry>;
}

const BALL_ORDER: BallLevel[] = ['blanc', 'violet', 'rouge', 'orange', 'vert'];

export function computeInitialAssessment(
  answers: Record<string, number>,
  validatorName = 'Questionnaire initial',
): InitialAssessmentResult {
  const values = INITIAL_ASSESSMENT_QUESTIONS.map((q) => answers[q.id] ?? 0);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const ballIndex = Math.max(0, Math.min(4, Math.round(avg)));
  const recommendedBall = BALL_ORDER[ballIndex];
  const today = new Date().toISOString().slice(0, 10);

  // Pre-fill lower levels as "acquis" and current level criteria based on answers
  const milestoneEvaluations: Record<string, MilestoneEvaluation> = {};

  GALAXIE_LEVELS.forEach((lvl, idx) => {
    if (idx < ballIndex) {
      for (const m of lvl.milestones) {
        milestoneEvaluations[m.id] = {
          status: 'acquis',
          validatedBy: 'parent',
          validatorName,
          updatedAt: today,
        };
      }
    } else if (idx === ballIndex) {
      for (const m of lvl.milestones) {
        const axisScore =
          m.axis === 'technique'
            ? ((answers.rally ?? 0) + (answers.serve ?? 0)) / 2
            : m.axis === 'tactique'
              ? answers.volley_footwork ?? 0
              : m.axis === 'comportement'
                ? answers.attitude ?? 0
                : answers.scoring_umpiring ?? 0;

        const status: AcquisitionStatus =
          axisScore >= ballIndex + 0.5 ? 'acquis' : axisScore >= ballIndex - 0.5 ? 'en_cours' : 'non_evalue';

        if (status !== 'non_evalue') {
          milestoneEvaluations[m.id] = {
            status,
            validatedBy: 'parent',
            validatorName,
            updatedAt: today,
          };
        }
      }
    }
  });

  const milestonesCompleted = Object.entries(milestoneEvaluations)
    .filter(([, ev]) => ev.status === 'acquis')
    .map(([id]) => id);

  const skillStatusFor = (pts: number): AcquisitionStatus => {
    if (pts > ballIndex) return 'acquis';
    if (pts >= ballIndex) return 'en_cours';
    return 'non_evalue';
  };

  const mapSkill = (pts: number): SkillEntry => {
    const status = skillStatusFor(pts);
    return {
      status,
      level: ACQUISITION_STATUS_META[status].numericLevel,
      note: 'Évalué lors du questionnaire initial.',
      validatedBy: 'parent',
      validatorName,
      updatedAt: today,
    };
  };

  const skillLevels: Record<SkillKey, SkillEntry> = {
    coup_droit: mapSkill(answers.rally ?? 0),
    revers: mapSkill(answers.backhand ?? 0),
    service: mapSkill(answers.serve ?? 0),
    volee: mapSkill(answers.volley_footwork ?? 0),
    deplacements: mapSkill(Math.round(((answers.volley_footwork ?? 0) + (answers.rally ?? 0)) / 2)),
    mental: mapSkill(Math.round(((answers.attitude ?? 0) + (answers.scoring_umpiring ?? 0)) / 2)),
  };

  const ballMeta = GALAXIE_LEVELS[ballIndex];
  const summary = `Niveau recommandé : ${ballMeta.name} (${ballMeta.courtSize}). Les étapes précédentes ont été pré-validées et les objectifs en cours sont prêts à être affinés par le coach.`;

  return {
    recommendedBall,
    averageScore: Number(avg.toFixed(1)),
    summary,
    milestoneEvaluations,
    milestonesCompleted,
    skillLevels,
  };
}
