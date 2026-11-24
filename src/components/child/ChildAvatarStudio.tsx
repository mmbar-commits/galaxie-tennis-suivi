import { useState } from 'react';
import { Check, Lock, Star } from 'lucide-react';
import { AVATAR_SHOP_ITEMS } from '../../data/galaxieCatalog';
import { fireStarCelebration } from '../../lib/confetti';
import { useTennisStore } from '../../lib/store';
import type { AvatarConfig } from '../../types/tennis';
import { AvatarSvg } from '../shared/AvatarSvg';

const SKIN_TONES = ['#FCE1CE', '#F4C7A6', '#DFAC83', '#B67D52', '#7D4E2D'];
const HAIR_COLORS = ['#2A1F1D', '#5B3A29', '#A16227', '#E6B85C', '#C4532E'];
const HAIR_STYLES: { id: AvatarConfig['hairStyle']; label: string; emoji: string }[] = [
  { id: 'ponytail', label: 'Queue de cheval', emoji: '🎀' },
  { id: 'bob', label: 'Carré', emoji: '💇‍♀️' },
  { id: 'braids', label: 'Tresses', emoji: '✨' },
  { id: 'bun', label: 'Chignon', emoji: '🩰' },
];

export function ChildAvatarStudio() {
  const { activeChild, updateChildAvatar, buyAvatarItem } = useTennisStore();
  const [tab, setTab] = useState<'look' | 'outfitColor' | 'headband' | 'racket' | 'companion'>(
    'look',
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleEquipOrBuy = (
    itemId: string,
    category: 'headband' | 'racket' | 'companion' | 'outfitColor',
    value: string,
    cost: number,
    label: string,
  ) => {
    const unlocked = cost === 0 || activeChild.unlockedItems.includes(itemId);
    const patch = { [category]: value } as Partial<AvatarConfig>;
    if (unlocked) {
      updateChildAvatar(patch);
      setMessage(`✨ ${label} équipé !`);
      return;
    }
    const ok = buyAvatarItem(itemId, cost, patch);
    if (ok) {
      fireStarCelebration();
      setMessage(`🎉 Bravo ! Tu as débloqué ${label} !`);
    } else {
      setMessage(`⭐ Il te manque ${cost - activeChild.starsBalance} étoiles pour débloquer ${label}.`);
    }
  };

  const shopTabs: {
    id: 'look' | 'outfitColor' | 'headband' | 'racket' | 'companion';
    label: string;
  }[] = [
    { id: 'look', label: '👩 Coiffure' },
    { id: 'outfitColor', label: '👗 Tenues' },
    { id: 'headband', label: '🎀 Bandeaux' },
    { id: 'racket', label: '🎾 Raquettes' },
    { id: 'companion', label: '🐶 Mascottes' },
  ];

  return (
    <div className="space-y-6 pb-8">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Live Avatar Preview */}
        <div className="child-card flex flex-col items-center justify-center p-6 lg:col-span-5">
          <span className="rounded-full bg-[#FFF4D6] px-4 py-1.5 text-sm font-extrabold text-[#9A6700]">
            <Star className="mr-1 inline h-4 w-4 fill-[#F4B942] text-[#F4B942]" />
            {activeChild.starsBalance} étoiles disponibles
          </span>
          <div className="my-4 rounded-[36px] bg-gradient-to-b from-[#FFF9EE] to-[#FFE7D1] p-4 shadow-inner">
            <AvatarSvg config={activeChild.avatarConfig} size={220} />
          </div>
          <h1 className="child-display text-2xl font-bold">{activeChild.name} sur le court !</h1>
          {message && (
            <p className="animate-pop-in mt-3 rounded-2xl bg-[#FFF6E8] px-4 py-2 text-center text-xs font-extrabold text-[#8A4D18]">
              {message}
            </p>
          )}
        </div>

        {/* Customization Controls */}
        <div className="child-card p-5 sm:p-6 lg:col-span-7">
          <div className="mb-5 flex flex-wrap gap-2">
            {shopTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setTab(t.id);
                  setMessage(null);
                }}
                className={`child-btn px-3.5 py-2 text-sm font-bold ${
                  tab === t.id
                    ? 'child-btn-primary'
                    : 'border-2 border-[var(--c-border)] bg-white text-[var(--c-ink)]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'look' ? (
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-sm font-extrabold">Style de coiffure (gratuit)</p>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {HAIR_STYLES.map((hs) => {
                    const active = activeChild.avatarConfig.hairStyle === hs.id;
                    return (
                      <button
                        key={hs.id}
                        type="button"
                        onClick={() => updateChildAvatar({ hairStyle: hs.id })}
                        className={`child-btn border-2 p-3 text-center ${
                          active
                            ? 'border-[#EE6C4D] bg-[#FFF5EE]'
                            : 'border-[var(--c-border)] bg-white'
                        }`}
                      >
                        <div className="text-2xl">{hs.emoji}</div>
                        <div className="mt-1 text-xs font-extrabold">{hs.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-extrabold">Couleur des cheveux</p>
                <div className="flex flex-wrap gap-3">
                  {HAIR_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateChildAvatar({ hairColor: color })}
                      className={`h-11 w-11 rounded-full border-4 transition ${
                        activeChild.avatarConfig.hairColor === color
                          ? 'scale-110 border-[#EE6C4D] shadow-md'
                          : 'border-white shadow-xs'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Couleur cheveux ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-extrabold">Teint de peau</p>
                <div className="flex flex-wrap gap-3">
                  {SKIN_TONES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateChildAvatar({ skinColor: color })}
                      className={`h-11 w-11 rounded-full border-4 transition ${
                        activeChild.avatarConfig.skinColor === color
                          ? 'scale-110 border-[#EE6C4D] shadow-md'
                          : 'border-white shadow-xs'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Teint ${color}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {AVATAR_SHOP_ITEMS.filter((item) => item.category === tab).map((item) => {
                const isUnlocked =
                  item.cost === 0 || activeChild.unlockedItems.includes(item.id);
                const isEquipped = activeChild.avatarConfig[item.category] === item.value;
                const canAfford = activeChild.starsBalance >= item.cost;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      handleEquipOrBuy(item.id, item.category, item.value, item.cost, item.label)
                    }
                    className={`child-btn relative flex flex-col items-center gap-1.5 border-2 p-4 text-center ${
                      isEquipped
                        ? 'border-[#2A9D8F] bg-[#ECFAF7]'
                        : isUnlocked
                          ? 'border-[var(--c-border)] bg-white hover:bg-[#FFF9F2]'
                          : canAfford
                            ? 'border-[#F4B942] bg-[#FFFDF4]'
                            : 'border-[#EAE4DD] bg-[#F8F6F4] opacity-80'
                    }`}
                  >
                    <span className="text-3xl">{item.emoji}</span>
                    <span className="text-xs font-extrabold leading-snug">{item.label}</span>

                    {isEquipped ? (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#2A9D8F] px-2.5 py-0.5 text-[11px] font-extrabold text-white">
                        <Check className="h-3 w-3" /> Porté
                      </span>
                    ) : isUnlocked ? (
                      <span className="mt-1 rounded-full bg-[#F1ECE6] px-2.5 py-0.5 text-[11px] font-bold text-[#4B4453]">
                        Choisir
                      </span>
                    ) : (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#FFF2C9] px-2.5 py-0.5 text-[11px] font-extrabold text-[#9A6700]">
                        {!canAfford && <Lock className="h-3 w-3" />}
                        {item.cost} ⭐
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
