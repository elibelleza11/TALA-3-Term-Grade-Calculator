import React from 'react';

export type MascotMood = 'thinking' | 'excited' | 'celebrating' | 'encouraging';

interface CarabaoTalaMascotProps {
  mood?: MascotMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CarabaoTalaMascot: React.FC<CarabaoTalaMascotProps> = ({
  mood = 'encouraging',
  message,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-32 h-32 sm:w-36 sm:h-36'
  }[size];

  const defaultMessages: Record<MascotMood, string> = {
    thinking: 'Mabuhay! I am Tala the Carabao. Enter your scores or final grades, and I will compute your official standing!',
    excited: 'Ang galing! Click "REVEAL MY GRADES" below to see your Initial Grade and DO 15, s. 2026 Descriptor!',
    celebrating: '🌟 Napakahusay! Mabuhay ang masipag na Batang Makabansa! Congratulations on your wonderful performance!',
    encouraging: 'Tala reminder: Consistent effort and perseverance lead to excellence! Every score helps you learn and grow.'
  };

  const displayMessage = message || defaultMessages[mood];

  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Animated Carabao Tala Mascot Graphic */}
      <div className={`relative ${sizeClasses} shrink-0 transition-transform duration-300 hover:scale-105 group`}>
        <svg
          viewBox="0 0 140 140"
          className="w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Ground shadow */}
          <ellipse cx="70" cy="130" rx="42" ry="7" fill="#CBD5E1" opacity="0.6" />

          {/* Left Crescent Carabao Horn */}
          <path
            d="M52 46 C36 42 16 30 18 14 C26 14 38 26 50 36 Z"
            fill="#475569"
          />
          {/* Horn ridge / shine */}
          <path
            d="M22 17 C26 24 38 34 46 38"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Golden horn tip */}
          <path
            d="M18 14 C19 19 24 20 25 15 C23 13 20 13 18 14 Z"
            fill="#F59E0B"
          />

          {/* Right Crescent Carabao Horn */}
          <path
            d="M88 46 C104 42 124 30 122 14 C114 14 102 26 90 36 Z"
            fill="#475569"
          />
          {/* Right Horn ridge */}
          <path
            d="M118 17 C114 24 102 34 94 38"
            stroke="#94A3B8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Golden horn tip */}
          <path
            d="M122 14 C121 19 116 20 115 15 C117 13 120 13 122 14 Z"
            fill="#F59E0B"
          />

          {/* Floppy Left Ear */}
          <ellipse cx="32" cy="56" rx="14" ry="8" transform="rotate(-20 32 56)" fill="#475569" />
          <ellipse cx="32" cy="56" rx="9" ry="5" transform="rotate(-20 32 56)" fill="#F472B6" opacity="0.5" />

          {/* Floppy Right Ear */}
          <ellipse cx="108" cy="56" rx="14" ry="8" transform="rotate(20 108 56)" fill="#475569" />
          <ellipse cx="108" cy="56" rx="9" ry="5" transform="rotate(20 108 56)" fill="#F472B6" opacity="0.5" />

          {/* Carabao Tala Body */}
          <ellipse cx="70" cy="85" rx="46" ry="44" fill="#334155" />
          {/* Belly - Slate Grey */}
          <ellipse cx="70" cy="95" rx="33" ry="30" fill="#475569" />

          {/* Academic Graduation Cap on Tala's Head */}
          <g className="origin-center animate-bounce-subtle">
            {/* Diamond mortarboard */}
            <polygon points="70,12 108,24 70,36 32,24" fill="#0F172A" />
            <polygon points="70,14 104,24 70,34 36,24" fill="#1E293B" />
            <path d="M48 29 Q70 37 92 29 L92 35 Q70 43 48 35 Z" fill="#334155" />
            {/* Tassel Button */}
            <circle cx="70" cy="24" r="3" fill="#FBBF24" />
            {/* Tassel ribbon */}
            <path d="M70 24 Q86 28 84 44" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <polygon points="84,44 80,52 88,52" fill="#D97706" />
          </g>

          {/* Carabao Tala Face (Head) */}
          <ellipse cx="70" cy="62" rx="32" ry="28" fill="#475569" />

          {/* The Golden Star ("Tala") on Forehead */}
          <g transform="translate(62, 36) scale(0.9)">
            <polygon
              points="9,0 12,6 18,7 13.5,12 15,18 9,14.5 3,18 4.5,12 0,7 6,6"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="0.8"
              className={mood === 'celebrating' || mood === 'excited' ? 'animate-pulse' : ''}
            />
          </g>

          {/* Carabao Snout / Muzzle */}
          <rect x="44" y="72" width="52" height="32" rx="16" fill="#64748B" />
          <rect x="47" y="74" width="46" height="28" rx="14" fill="#94A3B8" opacity="0.3" />

          {/* Nostrils */}
          <ellipse cx="58" cy="85" rx="3.5" ry="4.5" fill="#1E293B" />
          <ellipse cx="82" cy="85" rx="3.5" ry="4.5" fill="#1E293B" />

          {/* Cheerful Carabao Smile */}
          {mood === 'celebrating' || mood === 'excited' ? (
            <path
              d="M58 92 Q70 102 82 92"
              stroke="#0F172A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="#F43F5E"
            />
          ) : (
            <path
              d="M60 92 Q70 98 80 92"
              stroke="#0F172A"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Cute Rosy Cheeks */}
          <ellipse cx="44" cy="74" rx="6" ry="4" fill="#FB7185" opacity="0.6" />
          <ellipse cx="96" cy="74" rx="6" ry="4" fill="#FB7185" opacity="0.6" />

          {/* Expressive Big Eyes (Duolingo Style) */}
          {mood === 'celebrating' ? (
            // Joyful curved squinting eyes (happy arc)
            <>
              <path d="M48 60 Q57 50 64 60" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M76 60 Q83 50 92 60" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            // Big sparkling round eyes
            <>
              {/* Left eye */}
              <ellipse cx="55" cy="58" rx="10" ry="12" fill="white" />
              <ellipse cx="56" cy="58" rx="6" ry="8" fill="#0F172A" />
              <circle cx="58" cy="55" r="2.8" fill="white" />
              <circle cx="53" cy="62" r="1.2" fill="white" />

              {/* Right eye */}
              <ellipse cx="85" cy="58" rx="10" ry="12" fill="white" />
              <ellipse cx="84" cy="58" rx="6" ry="8" fill="#0F172A" />
              <circle cx="86" cy="55" r="2.8" fill="white" />
              <circle cx="81" cy="62" r="1.2" fill="white" />
            </>
          )}

          {/* Carabao Hooves / Hands */}
          {mood === 'celebrating' ? (
            // Raising hooves in celebration
            <>
              <ellipse cx="28" cy="76" rx="9" ry="8" fill="#1E293B" transform="rotate(-30 28 76)" />
              <ellipse cx="112" cy="76" rx="9" ry="8" fill="#1E293B" transform="rotate(30 112 76)" />
              {/* Confetti sparkle dots around */}
              <circle cx="20" cy="38" r="3" fill="#10B981" />
              <circle cx="120" cy="40" r="3" fill="#F59E0B" />
              <circle cx="70" cy="6" r="3" fill="#3B82F6" />
            </>
          ) : (
            // Holding a pencil or resting gently
            <>
              <ellipse cx="40" cy="108" rx="9" ry="8" fill="#1E293B" />
              <ellipse cx="100" cy="108" rx="9" ry="8" fill="#1E293B" />
              {/* Golden Star Medal around neck */}
              <g transform="translate(63, 105) scale(0.8)">
                <polygon
                  points="9,0 12,6 18,7 13.5,12 15,18 9,14.5 3,18 4.5,12 0,7 6,6"
                  fill="#FBBF24"
                  stroke="#B45309"
                  strokeWidth="1"
                />
              </g>
            </>
          )}
        </svg>
      </div>

      {/* Speech Bubble with speech pointer */}
      <div className="flex-1 bg-white dark:bg-slate-800 border-2 border-emerald-500/30 dark:border-emerald-500/40 rounded-2xl p-3 sm:p-4 shadow-2xs relative">
        {/* Triangle pointer */}
        <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-3 h-3 bg-white dark:bg-slate-800 border-l-2 border-b-2 border-emerald-500/30 dark:border-emerald-500/40 rotate-45" />

        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400 font-display flex items-center gap-1">
            <span>⭐ Tala the Carabao Mascot</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            · DepEd Study Buddy
          </span>
        </div>

        <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 leading-snug">
          {displayMessage}
        </p>
      </div>
    </div>
  );
};
