import type { AvatarConfig } from '../../types/tennis';

interface AvatarSvgProps {
  config: AvatarConfig;
  size?: number;
  className?: string;
}

export function AvatarSvg({ config, size = 180, className = '' }: AvatarSvgProps) {
  const { skinColor, hairStyle, hairColor, outfitColor, headband, racket, companion } = config;
  const isLightOutfit = outfitColor.toUpperCase() === '#FFFFFF';
  const outfitStroke = isLightOutfit ? '#D4C5B6' : 'rgba(0,0,0,0.12)';

  const racketColors: Record<AvatarConfig['racket'], { rim: string; handle: string; accent: string }> = {
    classic: { rim: '#C85A32', handle: '#1E4D3B', accent: '#F4B942' },
    rainbow: { rim: '#EC4899', handle: '#3B82F6', accent: '#FACC15' },
    star_pro: { rim: '#3B73ED', handle: '#1E293B', accent: '#F5B429' },
    clay_champ: { rim: '#B45309', handle: '#7C2D12', accent: '#FDE047' },
  };
  const rc = racketColors[racket] ?? racketColors.classic;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Avatar joueuse de tennis"
    >
      {/* Subtle sunlit clay shadow under feet */}
      <ellipse cx="104" cy="202" rx="56" ry="10" fill="rgba(180, 90, 50, 0.16)" />

      {/* Back Hair depending on style */}
      {hairStyle === 'ponytail' && (
        <path
          d="M138 66 C164 62, 174 92, 158 118 C150 108, 146 94, 136 86 Z"
          fill={hairColor}
        />
      )}
      {hairStyle === 'braids' && (
        <>
          <path d="M72 86 C64 106, 62 126, 68 142" stroke={hairColor} strokeWidth="12" strokeLinecap="round" />
          <path d="M134 86 C142 106, 144 126, 138 142" stroke={hairColor} strokeWidth="12" strokeLinecap="round" />
          <circle cx="68" cy="142" r="4.5" fill="#EE6C4D" />
          <circle cx="138" cy="142" r="4.5" fill="#EE6C4D" />
        </>
      )}
      {hairStyle === 'bun' && <circle cx="103" cy="36" r="18" fill={hairColor} />}
      {hairStyle === 'bob' && (
        <path
          d="M65 78 C64 114, 72 124, 82 124 L124 124 C134 124, 142 114, 141 78 Z"
          fill={hairColor}
        />
      )}

      {/* Legs & tennis shoes */}
      <rect x="86" y="156" width="12" height="34" rx="6" fill={skinColor} />
      <rect x="108" y="156" width="12" height="34" rx="6" fill={skinColor} />
      {/* Socks */}
      <rect x="85" y="178" width="14" height="10" rx="3" fill="#FFFFFF" />
      <rect x="107" y="178" width="14" height="10" rx="3" fill="#FFFFFF" />
      {/* Shoes */}
      <path d="M81 190 C81 185, 99 185, 100 193 L100 198 L79 198 C78 194, 79 191, 81 190 Z" fill="#EE6C4D" />
      <path d="M106 190 C107 185, 125 185, 127 193 L127 198 L106 198 Z" fill="#EE6C4D" />
      <rect x="79" y="196" width="22" height="3" rx="1.5" fill="#FFFFFF" />
      <rect x="105" y="196" width="22" height="3" rx="1.5" fill="#FFFFFF" />

      {/* Left Arm */}
      <path d="M80 120 C68 130, 62 142, 68 152" stroke={skinColor} strokeWidth="11" strokeLinecap="round" />

      {/* Right Arm holding racket */}
      <path d="M126 120 C140 128, 150 120, 156 108" stroke={skinColor} strokeWidth="11" strokeLinecap="round" />

      {/* Tennis Racket */}
      <g transform="translate(154, 108) rotate(-24)">
        {/* Handle */}
        <rect x="-3.5" y="0" width="7" height="22" rx="3" fill={rc.handle} />
        <rect x="-3.5" y="14" width="7" height="5" fill={rc.accent} />
        {/* Throat */}
        <path d="M-2 0 L-8 -16 M2 0 L8 -16" stroke={rc.rim} strokeWidth="3.5" strokeLinecap="round" />
        {/* Frame */}
        <ellipse cx="0" cy="-34" rx="17" ry="22" fill="rgba(255,255,255,0.65)" stroke={rc.rim} strokeWidth="4.5" />
        {racket === 'rainbow' && (
          <ellipse cx="0" cy="-34" rx="17" ry="22" stroke="#FACC15" strokeWidth="2" strokeDasharray="8 8" />
        )}
        {/* Strings */}
        <line x1="-10" y1="-48" x2="-10" y2="-20" stroke="#94A3B8" strokeWidth="1" />
        <line x1="-3" y1="-54" x2="-3" y2="-14" stroke="#94A3B8" strokeWidth="1" />
        <line x1="4" y1="-54" x2="4" y2="-14" stroke="#94A3B8" strokeWidth="1" />
        <line x1="11" y1="-48" x2="11" y2="-20" stroke="#94A3B8" strokeWidth="1" />
        <line x1="-15" y1="-42" x2="15" y2="-42" stroke="#94A3B8" strokeWidth="1" />
        <line x1="-16" y1="-34" x2="16" y2="-34" stroke="#94A3B8" strokeWidth="1" />
        <line x1="-15" y1="-26" x2="15" y2="-26" stroke="#94A3B8" strokeWidth="1" />
        {racket === 'star_pro' && (
          <circle cx="0" cy="-34" r="4" fill="#F5B429" opacity="0.85" />
        )}
      </g>

      {/* Tennis Dress / Top + Pleated Skirt */}
      <path
        d="M82 114 C82 108, 124 108, 124 114 L128 144 L78 144 Z"
        fill={outfitColor}
        stroke={outfitStroke}
        strokeWidth="2"
      />
      {/* Collar V-neck */}
      <path d="M94 111 L103 121 L112 111" stroke={isLightOutfit ? '#EE6C4D' : '#FFFFFF'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pleated Skirt */}
      <path
        d="M78 142 L128 142 L138 166 C122 170, 84 170, 68 166 Z"
        fill={isLightOutfit ? '#F8FAFC' : outfitColor}
        stroke={outfitStroke}
        strokeWidth="2"
      />
      <line x1="92" y1="143" x2="88" y2="167" stroke={outfitStroke} strokeWidth="1.5" />
      <line x1="103" y1="143" x2="103" y2="168" stroke={outfitStroke} strokeWidth="1.5" />
      <line x1="114" y1="143" x2="118" y2="167" stroke={outfitStroke} strokeWidth="1.5" />

      {/* Neck */}
      <rect x="96" y="98" width="14" height="14" rx="6" fill={skinColor} />

      {/* Head */}
      <circle cx="103" cy="76" r="30" fill={skinColor} />

      {/* Rosy cheeks */}
      <ellipse cx="85" cy="83" rx="5" ry="3" fill="#F4847A" opacity="0.45" />
      <ellipse cx="121" cy="83" rx="5" ry="3" fill="#F4847A" opacity="0.45" />

      {/* Eyes */}
      <circle cx="92" cy="75" r="3.8" fill="#2B2338" />
      <circle cx="114" cy="75" r="3.8" fill="#2B2338" />
      <circle cx="93.3" cy="73.6" r="1.3" fill="#FFFFFF" />
      <circle cx="115.3" cy="73.6" r="1.3" fill="#FFFFFF" />

      {/* Big Joyful Smile */}
      <path
        d="M93 86 Q103 95 113 86"
        stroke="#2B2338"
        strokeWidth="2.8"
        strokeLinecap="round"
        fill="none"
      />

      {/* Front Hair Bangs */}
      <path
        d="M72 72 C74 48, 92 42, 104 42 C118 42, 132 50, 134 72 C125 60, 114 57, 102 60 C92 56, 80 61, 72 72 Z"
        fill={hairColor}
      />

      {/* Headband / Visor */}
      {headband === 'coral' && (
        <path d="M74 63 Q103 49 132 63" stroke="#EE6C4D" strokeWidth="7" strokeLinecap="round" fill="none" />
      )}
      {headband === 'gold' && (
        <>
          <path d="M74 63 Q103 49 132 63" stroke="#F4B942" strokeWidth="7" strokeLinecap="round" fill="none" />
          <path d="M97 53 L103 44 L109 53 Z" fill="#F4B942" />
        </>
      )}
      {headband === 'star' && (
        <>
          <path d="M74 63 Q103 49 132 63" stroke="#3B73ED" strokeWidth="7" strokeLinecap="round" fill="none" />
          <text x="96" y="61" fontSize="14">⭐</text>
        </>
      )}
      {headband === 'visor' && (
        <>
          <path d="M72 62 Q103 48 134 62" stroke="#1E4D3B" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M70 64 Q103 55 136 64 Q103 70 70 64 Z" fill="#2A9D8F" />
        </>
      )}

      {/* Companion Mascot (Bottom Left) */}
      {companion === 'ball_buddy' && (
        <g transform="translate(36, 166)">
          <circle cx="18" cy="18" r="16" fill="#D9F94E" stroke="#A3C614" strokeWidth="2" />
          <path d="M6 10 Q16 18 6 26" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
          <path d="M30 10 Q20 18 30 26" stroke="#FFFFFF" strokeWidth="2.4" fill="none" />
          <circle cx="13" cy="15" r="2" fill="#2B2338" />
          <circle cx="23" cy="15" r="2" fill="#2B2338" />
          <path d="M14 21 Q18 25 22 21" stroke="#2B2338" strokeWidth="2" strokeLinecap="round" fill="none" />
        </g>
      )}
      {companion === 'puppy' && (
        <g transform="translate(24, 152)">
          <ellipse cx="24" cy="36" rx="14" ry="12" fill="#D4A373" />
          <circle cx="24" cy="20" r="14" fill="#E3B78B" />
          <ellipse cx="11" cy="22" rx="5" ry="9" fill="#9C6644" />
          <ellipse cx="37" cy="22" rx="5" ry="9" fill="#9C6644" />
          <circle cx="19" cy="18" r="2.2" fill="#2B2338" />
          <circle cx="29" cy="18" r="2.2" fill="#2B2338" />
          <ellipse cx="24" cy="23" rx="3" ry="2" fill="#2B2338" />
          <circle cx="34" cy="40" r="6" fill="#D9F94E" stroke="#A3C614" strokeWidth="1.5" />
        </g>
      )}
      {companion === 'star_cat' && (
        <g transform="translate(26, 154)">
          <polygon points="12,18 16,4 24,14" fill="#FDE68A" />
          <polygon points="36,18 32,4 24,14" fill="#FDE68A" />
          <circle cx="24" cy="24" r="14" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="19" cy="22" r="2.2" fill="#2B2338" />
          <circle cx="29" cy="22" r="2.2" fill="#2B2338" />
          <path d="M21 27 Q24 30 27 27" stroke="#2B2338" strokeWidth="1.8" strokeLinecap="round" fill="none" />
          <text x="17" y="47" fontSize="14">⭐</text>
        </g>
      )}
      {companion === 'trophy_owl' && (
        <g transform="translate(24, 150)">
          <ellipse cx="24" cy="30" rx="15" ry="18" fill="#8B5CF6" />
          <ellipse cx="24" cy="34" rx="10" ry="11" fill="#EDE9FE" />
          <circle cx="18" cy="22" r="5" fill="#FFFFFF" />
          <circle cx="30" cy="22" r="5" fill="#FFFFFF" />
          <circle cx="18" cy="22" r="2.2" fill="#1E1B4B" />
          <circle cx="30" cy="22" r="2.2" fill="#1E1B4B" />
          <polygon points="24,25 21,30 27,30" fill="#F59E0B" />
        </g>
      )}
    </svg>
  );
}
