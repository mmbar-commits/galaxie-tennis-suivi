import { ACQUISITION_STATUS_META, SKILL_CATALOG } from '../../data/galaxieCatalog';
import type { AcquisitionStatus, SkillEntry, SkillKey } from '../../types/tennis';

interface SkillRadarChartProps {
  skills: Record<SkillKey, SkillEntry>;
  size?: number;
}

export function SkillRadarChart({ skills, size = 250 }: SkillRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.33;
  const axes = SKILL_CATALOG;
  const count = axes.length;

  const pointAt = (index: number, ratio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * ratio,
      y: cy + Math.sin(angle) * radius * ratio,
    };
  };

  // 3 concentric rings matching: À travailler (0.33), En cours (0.66), Acquis (1.0)
  const rings = [0.33, 0.66, 1];

  const getStatus = (key: SkillKey): AcquisitionStatus => {
    const entry = skills[key];
    if (entry?.status) return entry.status;
    if ((entry?.level ?? 1) >= 4) return 'acquis';
    if ((entry?.level ?? 1) >= 2) return 'en_cours';
    return 'non_evalue';
  };

  const statusRatio: Record<AcquisitionStatus, number> = {
    non_evalue: 0.25,
    en_cours: 0.65,
    acquis: 1,
  };

  const dataPoints = axes.map((axis, idx) => pointAt(idx, statusRatio[getStatus(axis.key)]));
  const polygonPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto block select-none"
      role="img"
      aria-label="Radar des acquis techniques (À travailler, En cours, Acquis)"
    >
      {rings.map((r) => {
        const pts = axes
          .map((_, idx) => {
            const p = pointAt(idx, r);
            return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
          })
          .join(' ');
        return (
          <polygon
            key={r}
            points={pts}
            fill={r === 1 ? 'rgba(30, 77, 59, 0.04)' : 'none'}
            stroke="#E5D9CC"
            strokeWidth={r === 1 ? 1.5 : 1}
          />
        );
      })}

      {axes.map((axis, idx) => {
        const outer = pointAt(idx, 1);
        return (
          <line
            key={axis.key}
            x1={cx}
            y1={cy}
            x2={outer.x}
            y2={outer.y}
            stroke="#E5D9CC"
            strokeWidth="1"
          />
        );
      })}

      <polygon
        points={polygonPath}
        fill="rgba(30, 77, 59, 0.20)"
        stroke="#1E4D3B"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {dataPoints.map((p, idx) => {
        const st = getStatus(axes[idx].key);
        const dotColor =
          st === 'acquis' ? '#1E4D3B' : st === 'en_cours' ? '#D99B26' : '#94A3B8';
        return (
          <circle
            key={axes[idx].key}
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill={dotColor}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        );
      })}

      {axes.map((axis, idx) => {
        const labelPos = pointAt(idx, 1.3);
        const st = getStatus(axis.key);
        const meta = ACQUISITION_STATUS_META[st];
        return (
          <g key={axis.key}>
            <text
              x={labelPos.x}
              y={labelPos.y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="10.5"
              fontWeight="700"
              fill="#1F2421"
            >
              {axis.shortLabel}
            </text>
            <text
              x={labelPos.x}
              y={labelPos.y + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={meta.text}
            >
              {meta.shortLabel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
