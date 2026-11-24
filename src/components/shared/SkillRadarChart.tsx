import { SKILL_CATALOG } from '../../data/galaxieCatalog';
import type { SkillEntry, SkillKey } from '../../types/tennis';

interface SkillRadarChartProps {
  skills: Record<SkillKey, SkillEntry>;
  size?: number;
}

export function SkillRadarChart({ skills, size = 250 }: SkillRadarChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.34;
  const axes = SKILL_CATALOG;
  const count = axes.length;

  const pointAt = (index: number, levelRatio: number) => {
    const angle = (Math.PI * 2 * index) / count - Math.PI / 2;
    return {
      x: cx + Math.cos(angle) * radius * levelRatio,
      y: cy + Math.sin(angle) * radius * levelRatio,
    };
  };

  const rings = [0.2, 0.4, 0.6, 0.8, 1];

  const dataPoints = axes.map((axis, idx) => {
    const lvl = Math.max(0.5, Math.min(5, skills[axis.key]?.level ?? 1));
    return pointAt(idx, lvl / 5);
  });

  const polygonPath = dataPoints.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="mx-auto block select-none"
      role="img"
      aria-label="Radar des 6 compétences tennis"
    >
      {/* Concentric pentagon/hexagon rings */}
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
            fill={r === 1 ? 'rgba(200, 90, 50, 0.04)' : 'none'}
            stroke="#E5D9CC"
            strokeWidth={r === 1 ? 1.5 : 1}
          />
        );
      })}

      {/* Axis spokes */}
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

      {/* Filled skill polygon */}
      <polygon
        points={polygonPath}
        fill="rgba(200, 90, 50, 0.22)"
        stroke="#C85A32"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Vertex dots */}
      {dataPoints.map((p, idx) => (
        <circle
          key={axes[idx].key}
          cx={p.x}
          cy={p.y}
          r="4.5"
          fill="#1E4D3B"
          stroke="#FFFFFF"
          strokeWidth="2"
        />
      ))}

      {/* Labels */}
      {axes.map((axis, idx) => {
        const labelPos = pointAt(idx, 1.27);
        const lvl = skills[axis.key]?.level ?? 1;
        return (
          <g key={axis.key}>
            <text
              x={labelPos.x}
              y={labelPos.y - 4}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
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
              fontSize="10"
              fontWeight="600"
              fill="#C85A32"
            >
              {lvl}/5
            </text>
          </g>
        );
      })}
    </svg>
  );
}
