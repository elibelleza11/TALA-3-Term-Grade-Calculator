import React, { useState, useEffect } from 'react';
import { playPop, playCelebrationChime, playDoubleTap } from '../utils/audio';
import { Target, ArrowRight } from 'lucide-react';

export type MascotMood = 'thinking' | 'excited' | 'celebrating' | 'encouraging' | 'determined';
export type TaliState = 'idle' | 'empty' | 'advancing' | 'connecting' | 'benchmarking' | 'developing' | 'emerging';

interface TaliTarsierMascotProps {
  mood?: MascotMood;
  state?: TaliState;
  descriptorLevel?: string;
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onGoalPlannerClick?: () => void;
  className?: string;
  compact?: boolean;
}

export const TaliTarsierMascot: React.FC<TaliTarsierMascotProps> = ({
  mood = 'encouraging',
  state,
  descriptorLevel,
  message,
  size = 'md',
  onGoalPlannerClick,
  className = '',
  compact = false
}) => {
  const [isWinking, setIsWinking] = useState(false);
  const [glassesPushed, setGlassesPushed] = useState(false);
  const [tapRipples, setTapRipples] = useState<number[]>([]);
  const [floatingSparks, setFloatingSparks] = useState<{ id: number; text: string; x: number }[]>([]);
  const [customCheer, setCustomCheer] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Derive active behavioral state from descriptorLevel if provided
  const activeState: TaliState = state || (() => {
    if (descriptorLevel === 'Advancing') return 'advancing';
    if (descriptorLevel === 'Benchmarking') return 'benchmarking';
    if (descriptorLevel === 'Connecting') return 'connecting';
    if (descriptorLevel === 'Developing') return 'developing';
    if (descriptorLevel === 'Emerging') return 'emerging';
    if (descriptorLevel === 'Empty') return 'empty';
    if (mood === 'celebrating') return 'advancing';
    if (mood === 'determined') return 'emerging';
    return 'idle';
  })();

  const sizeClasses = {
    sm: 'w-20 h-20',
    md: 'w-28 h-28 sm:w-32 sm:h-32',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    xl: 'w-48 h-48 sm:w-56 sm:h-56'
  }[size];

  // Duolingo-style adaptive messages based on DepEd DO 15 performance level
  const stateMessages: Record<TaliState, string> = {
    advancing:
      '🌟 WOOHOO! My eyes are literally spinning stars! Exemplary mastery (Advancing)! Holding my glowing Tala parol high for you!',
    benchmarking:
      '👓 *Double taps screen* Solid work, you\'re right on track! Solid mastery of core competencies. Pushing my glasses up with pride!',
    connecting:
      '👍 *Taps screen twice* "Solid work, you\'re right on track!" You meet the academic honors benchmark. Keep this momentum!',
    developing:
      '💪 Building foundational strength takes real effort! *wipes sweat* Let\'s head to the Goal Planner to strategize for your next assessment!',
    emerging:
      '🔥 Growth mindset engaged! Red panyo tied tight! Let\'s not get discouraged—click the Target Goal Planner below and let\'s find the exact score you need to pass!',
    empty:
      '📓 Handa na ba ang iyong scores? Open your notebook and input your Written Works, PTs, and Exams above. Tali is analyzing ready!',
    idle:
      'Kumusta! I am Tali the Tarsier, your 3-term academic learning analyzer. Pushing my glasses up to track your scores and progress!'
  };

  const cheerQuotes = [
    "🌟 Kaya mo 'yan! (You've got this!) Keep shining!",
    "👓 *Pushes glasses up* I calculated your potential: 100% awesome!",
    "✨ High-five! Remember to study with joy and curiosity!",
    "⭐ Great study habits make bright futures!",
    "💡 Pro-Tip: Performance tasks are worth 50% to 60% of your grade!",
    "🥤 Don't forget to drink water and take 5-minute brain breaks!"
  ];

  const displayMessage = customCheer || message || stateMessages[activeState];

  // Periodic blinking effect for tarsier realism
  useEffect(() => {
    const interval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 220);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  const handleTaliClick = () => {
    if (activeState === 'advancing') {
      playCelebrationChime();
    } else if (activeState === 'connecting' || activeState === 'benchmarking') {
      playDoubleTap();
      setTapRipples((prev) => [...prev, Date.now()]);
      setTimeout(() => {
        setTapRipples((prev) => prev.slice(1));
      }, 800);
    } else {
      playPop();
    }

    // Spawn floating playful hearts/stars
    const icons = ['⭐', '✨', '🌟', '💖', '🐾', '🎯'];
    const chosenIcon = icons[Math.floor(Math.random() * icons.length)];
    const sparkId = Date.now();
    const randomX = Math.floor(Math.random() * 60) - 30;
    setFloatingSparks((prev) => [...prev, { id: sparkId, text: chosenIcon, x: randomX }]);
    setTimeout(() => {
      setFloatingSparks((prev) => prev.filter((s) => s.id !== sparkId));
    }, 1000);

    // Random cheerful quote
    const randomQuote = cheerQuotes[Math.floor(Math.random() * cheerQuotes.length)];
    setCustomCheer(randomQuote);
    setTimeout(() => {
      setCustomCheer(null);
    }, 6000);

    setGlassesPushed(true);
    setIsWinking(true);
    setTimeout(() => {
      setGlassesPushed(false);
      setIsWinking(false);
    }, 900);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 select-none relative w-full ${className}`}>
      {/* Tap Ripples Effect when tapping screen from inside */}
      {tapRipples.map((id) => (
        <span
          key={id}
          className="absolute left-10 top-10 w-16 h-16 rounded-full border-2 border-indigo-400 bg-indigo-300/20 animate-ping pointer-events-none z-30"
        />
      ))}

      {/* Floating Sparkles / Hearts on Click */}
      {floatingSparks.map((spark) => (
        <span
          key={spark.id}
          style={{ transform: `translateX(${spark.x}px)` }}
          className="absolute -top-4 sm:top-2 left-1/2 sm:left-14 -translate-x-1/2 text-2xl animate-bounce-subtle pointer-events-none z-40 transition-all duration-700 opacity-90 drop-shadow-md select-none"
        >
          {spark.text}
        </span>
      ))}

      {/* SVG TARSIER VECTOR ART WITH DUOLINGO EXPRESSIONS */}
      <div
        onClick={handleTaliClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative ${sizeClasses} shrink-0 transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer group`}
        title="Tap Tali the Tarsier for friendly cheer and tricks! 👓"
        role="button"
        aria-label="Tali the Tarsier mascot"
      >
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full drop-shadow-md ${
            activeState === 'advancing' ? 'animate-bounce-subtle' : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Fur gradient: soft cream with deep violet/indigo tint */}
            <linearGradient id="taliFur" x1="40" y1="20" x2="120" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FAF7F5" />
              <stop offset="60%" stopColor="#EDE9FE" />
              <stop offset="100%" stopColor="#DDD6FE" />
            </linearGradient>

            {/* Inner ear pinkish-violet gradient */}
            <linearGradient id="taliEar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>

            {/* Massive Tarsier Hazel-Golden Eye Gradient */}
            <radialGradient id="taliIris" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>

            {/* Glowing Parol / Star Gradient */}
            <radialGradient id="starGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FEF08A" />
              <stop offset="60%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </radialGradient>

            {/* Lens Reflection Filter */}
            <linearGradient id="lensGlint" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#818CF8" stopOpacity="0.25" />
            </linearGradient>

            {/* Star bloom aura */}
            <filter id="bloomAura" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Ground Shadow */}
          <ellipse cx="80" cy="148" rx="46" ry="8" fill="#4338CA" opacity="0.16" />

          {/* 2. Star-Curled Tarsier Tail */}
          <g className="transition-transform duration-500 origin-bottom group-hover:rotate-6">
            <path
              d="M102 126 C124 134 142 120 138 98 C135 80 115 76 118 60 C120 48 134 46 138 56 C141 64 135 74 144 80 C150 84 156 74 150 64 C144 52 148 40 140 34 C132 28 120 34 116 46 C110 65 130 75 125 96 C121 114 108 120 94 120"
              stroke="#C4B5FD"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tail tip star tuft */}
            <polygon
              points="140,28 143,36 151,36 145,41 147,49 140,44 133,49 135,41 129,36 137,36"
              fill="#FBBF24"
              className={activeState === 'advancing' ? 'animate-pulse' : ''}
            />
          </g>

          {/* 3. Tarsier Ears */}
          <g className="transition-transform duration-300 origin-center group-hover:-rotate-3">
            <ellipse cx="32" cy="52" rx="19" ry="24" transform="rotate(-25 32 52)" fill="#DDD6FE" stroke="#4F46E5" strokeWidth="2.5" />
            <ellipse cx="34" cy="52" rx="13" ry="17" transform="rotate(-25 34 52)" fill="url(#taliEar)" />
            <path d="M26 46 C30 50 34 56 36 62" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M32 42 C36 46 40 52 42 58" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </g>
          <g className="transition-transform duration-300 origin-center group-hover:rotate-3">
            <ellipse cx="128" cy="52" rx="19" ry="24" transform="rotate(25 128 52)" fill="#DDD6FE" stroke="#4F46E5" strokeWidth="2.5" />
            <ellipse cx="126" cy="52" rx="13" ry="17" transform="rotate(25 126 52)" fill="url(#taliEar)" />
            <path d="M134 46 C130 50 126 56 124 62" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M128 42 C124 46 120 52 118 58" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </g>

          {/* 4. Chubby Body and Head */}
          <path
            d="M48 94 C48 70 60 52 80 52 C100 52 112 70 112 94 C112 120 102 138 80 138 C58 138 48 120 48 94 Z"
            fill="url(#taliFur)"
            stroke="#4338CA"
            strokeWidth="3.5"
          />
          <circle
            cx="80"
            cy="76"
            r="44"
            fill="url(#taliFur)"
            stroke="#4338CA"
            strokeWidth="3.5"
          />
          {/* White Chest */}
          <path
            d="M66 98 C66 88 72 82 80 82 C88 82 94 88 94 98 C94 116 88 128 80 128 C72 128 66 116 66 98 Z"
            fill="#FFFDFB"
            opacity="0.9"
          />

          {/* Feet */}
          <ellipse cx="62" cy="136" rx="8" ry="5" fill="#C4B5FD" stroke="#4338CA" strokeWidth="2" />
          <ellipse cx="98" cy="136" rx="8" ry="5" fill="#C4B5FD" stroke="#4338CA" strokeWidth="2" />

          {/* 5. MASSIVE TARSIER EYES (DYNAMIC BEHAVIOR BY PERFORMANCE LEVEL) */}
          {/* Sockets */}
          <ellipse cx="60" cy="72" rx="19" ry="20" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
          <ellipse cx="100" cy="72" rx="19" ry="20" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />

          {/* Irises */}
          <ellipse cx="60" cy="72" rx="15" ry="16" fill="url(#taliIris)" />
          <ellipse cx="100" cy="72" rx="15" ry="16" fill="url(#taliIris)" />

          {/* SPECIAL ADVANCING EYES: Literal Glowing Spinning Stars! */}
          {activeState === 'advancing' ? (
            <g className="animate-spin-slow origin-center">
              {/* Star pupil left */}
              <polygon
                points="60,59 63,67 72,67 65,72 68,80 60,75 52,80 55,72 48,67 57,67"
                fill="#FEF08A"
                stroke="#D97706"
                strokeWidth="1.5"
                filter="url(#bloomAura)"
              />
              <circle cx="60" cy="72" r="3.5" fill="#1E1B4B" />

              {/* Star pupil right */}
              <polygon
                points="100,59 103,67 112,67 105,72 108,80 100,75 92,80 95,72 88,67 97,67"
                fill="#FEF08A"
                stroke="#D97706"
                strokeWidth="1.5"
                filter="url(#bloomAura)"
              />
              <circle cx="100" cy="72" r="3.5" fill="#1E1B4B" />
            </g>
          ) : isWinking ? (
            /* Winking Eye */
            <>
              <circle cx="60" cy="72" r="10" fill="#1E1B4B" />
              <path d="M89 72 Q100 82 111 72" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            /* Normal Massive Pupils */
            <>
              <circle cx={glassesPushed || activeState === 'connecting' ? 62 : 60} cy={72} r="10" fill="#1E1B4B" />
              <circle cx={glassesPushed || activeState === 'connecting' ? 102 : 100} cy={72} r="10" fill="#1E1B4B" />
              {/* Big Duolingo Highlights */}
              <circle cx="55" cy="67" r="4.2" fill="#FFFFFF" />
              <circle cx="65" cy="76" r="2" fill="#FFFFFF" />
              <circle cx="95" cy="67" r="4.2" fill="#FFFFFF" />
              <circle cx="105" cy="76" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* 6. Nose & Mouth */}
          <polygon points="80,84 76,81 84,81" fill="#7C3AED" />
          <path
            d={
              activeState === 'advancing'
                ? 'M74 86 Q80 95 86 86' // Big open happy smile
                : activeState === 'emerging'
                ? 'M76 87 L84 87' // Determined focused mouth
                : 'M76 87 Q80 91 84 87' // Gentle smile
            }
            stroke="#4338CA"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Cheeks */}
          <ellipse cx="44" cy="85" rx="6" ry="3.5" fill="#F472B6" opacity="0.45" />
          <ellipse cx="116" cy="85" rx="6" ry="3.5" fill="#F472B6" opacity="0.45" />

          {/* 7. OVERSIZED ACADEMIC GLASSES */}
          <g className={`transition-all duration-300 ${glassesPushed || activeState === 'connecting' ? '-translate-y-1.5' : ''}`}>
            {/* Bridge */}
            <path d="M74 69 Q80 65 86 69" stroke="#312E81" strokeWidth="4" strokeLinecap="round" fill="none" />
            <path d="M75 70 Q80 67 85 70" stroke="#4F46E5" strokeWidth="2" fill="none" />
            {/* Left Glass */}
            <rect x="39" y="52" width="36" height="36" rx="18" fill="url(#lensGlint)" stroke="#312E81" strokeWidth="4" />
            <path d="M45 61 L58 54" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            {/* Right Glass */}
            <rect x="85" y="52" width="36" height="36" rx="18" fill="url(#lensGlint)" stroke="#312E81" strokeWidth="4" />
            <path d="M91 61 L104 54" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* 8. DESCRIPTOR-SPECIFIC ACCESSORIES & ACTIONS */}

          {/* EMPTY STATE: Holding Blank Notebook */}
          {activeState === 'empty' && (
            <g className="animate-pulse">
              {/* Little blue school notebook */}
              <rect x="62" y="98" width="36" height="28" rx="4" fill="#3B82F6" stroke="#1E3A8A" strokeWidth="2" />
              <rect x="66" y="100" width="30" height="24" rx="2" fill="#FFFFFF" />
              <line x1="70" y1="106" x2="90" y2="106" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <line x1="70" y1="112" x2="86" y2="112" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              <line x1="70" y1="118" x2="88" y2="118" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
              {/* Little pencil */}
              <polygon points="98,96 102,93 105,96 101,99" fill="#F59E0B" />
            </g>
          )}

          {/* CONNECTING / BENCHMARKING: Pushing glasses + Firm Thumbs-Up */}
          {(activeState === 'connecting' || activeState === 'benchmarking') && (
            <g>
              {/* Left paw pushing up glasses */}
              <ellipse cx="80" cy="62" rx="5" ry="4" fill="#C4B5FD" stroke="#312E81" strokeWidth="2" />
              <circle cx="77" cy="60" r="1.5" fill="#FFFDFB" />
              <circle cx="80" cy="59" r="1.5" fill="#FFFDFB" />
              <circle cx="83" cy="60" r="1.5" fill="#FFFDFB" />
              {/* Right paw giving a firm encouraging thumbs-up! */}
              <g transform="translate(108, 92)">
                <ellipse cx="10" cy="14" rx="7" ry="6" fill="#C4B5FD" stroke="#312E81" strokeWidth="2" />
                {/* Thumb sticking up */}
                <rect x="8" y="2" width="5.5" height="11" rx="2.5" fill="#C4B5FD" stroke="#312E81" strokeWidth="2" />
                <circle cx="10.5" cy="3.5" r="1.2" fill="#FFFDFB" />
              </g>
            </g>
          )}

          {/* DEVELOPING: Sweat bead + Wobbly stack of textbooks on head */}
          {activeState === 'developing' && (
            <g>
              {/* Tiny bead of sweat being wiped */}
              <path
                d="M48 64 C48 61 51 58 53 58 C55 58 58 61 58 64 C58 67 55 70 53 70 C51 70 48 67 48 64 Z"
                fill="#38BDF8"
                className="animate-bounce"
              />
              {/* Paw wiping forehead */}
              <ellipse cx="48" cy="66" rx="6" ry="5" fill="#C4B5FD" stroke="#312E81" strokeWidth="2" />

              {/* Slightly wobbly stack of textbooks on head */}
              <g className="transition-transform duration-300 hover:rotate-3 origin-bottom">
                {/* Book 1 (Bottom - Blue) */}
                <rect x="58" y="26" width="44" height="8" rx="2" fill="#2563EB" stroke="#1E3A8A" strokeWidth="1.5" />
                <line x1="60" y1="30" x2="100" y2="30" stroke="#93C5FD" strokeWidth="1" />
                {/* Book 2 (Middle - Red, slightly tilted) */}
                <rect x="62" y="18" width="38" height="8" rx="2" transform="rotate(-3 80 22)" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
                {/* Book 3 (Top - Emerald, tilted) */}
                <rect x="66" y="10" width="32" height="8" rx="2" transform="rotate(4 80 14)" fill="#059669" stroke="#065F46" strokeWidth="1.5" />
              </g>

              {/* Small thought bubble with bicep */}
              <g transform="translate(112, 16)">
                <ellipse cx="14" cy="14" rx="16" ry="14" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" />
                <circle cx="0" cy="22" r="3" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.2" />
                <text x="7" y="19" fontSize="14">💪</text>
              </g>
            </g>
          )}

          {/* EMERGING: Fiercely determined with Red Panyo (Headband) and Mini Whiteboard */}
          {activeState === 'emerging' && (
            <g>
              {/* Tiny Red Panyo (Handkerchief tied like a sweatband around forehead) */}
              <path
                d="M40 46 C60 41 100 41 120 46 L121 52 C101 47 59 47 39 52 Z"
                fill="#DC2626"
                stroke="#991B1B"
                strokeWidth="1.5"
              />
              {/* Knotted tails on the left side */}
              <path d="M38 48 C32 44 26 48 24 54 C28 55 33 53 36 50 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />
              <path d="M36 50 C32 54 28 60 27 66 C31 64 34 60 37 54 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1.2" />

              {/* Determined focused eyebrows */}
              <line x1="46" y1="56" x2="68" y2="60" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />
              <line x1="114" y1="56" x2="92" y2="60" stroke="#991B1B" strokeWidth="3" strokeLinecap="round" />

              {/* Miniature Whiteboard that says "Let's plan!" */}
              <g transform="translate(50, 94)">
                <rect x="0" y="0" width="60" height="34" rx="4" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
                {/* Whiteboard header */}
                <rect x="0" y="0" width="60" height="7" rx="2" fill="#E2E8F0" />
                {/* Text: Let's plan! */}
                <text x="30" y="21" fill="#DC2626" fontSize="9" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">
                  Let's plan! 🎯
                </text>
                <text x="30" y="29" fill="#1E293B" fontSize="6.5" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
                  Target Simulator →
                </text>
              </g>
            </g>
          )}

          {/* ADVANCING: Glowing Parol Star + Confetti Sparks */}
          {activeState === 'advancing' && (
            <g>
              {/* Glowing Mini Parol */}
              <circle cx="126" cy="34" r="19" fill="#FBBF24" opacity="0.45" filter="url(#bloomAura)" className="animate-pulse" />
              <polygon
                points="126,18 130,28 141,29 133,37 136,48 126,42 116,48 119,37 111,29 122,28"
                fill="url(#starGlowGrad)"
                stroke="#D97706"
                strokeWidth="1.5"
                className="animate-spin-slow origin-center"
              />
              <circle cx="126" cy="34" r="3.5" fill="#FFFBEB" />
              {/* Parol Buntot (tails) */}
              <path d="M123 44 C122 50 120 54 121 58 M129 44 C130 50 132 54 131 58" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />

              {/* Confetti sparks */}
              <g className="animate-pulse">
                <circle cx="28" cy="30" r="2.5" fill="#F43F5E" />
                <polygon points="34,22 36,25 39,23 37,26 39,29 36,27 34,30 35,26" fill="#3B82F6" />
                <circle cx="138" cy="80" r="2" fill="#10B981" />
                <polygon points="20,70 23,72 21,75 24,74 25,77 25,73 28,73 25,71" fill="#F59E0B" />
              </g>
            </g>
          )}

          {/* Idle default paws */}
          {activeState === 'idle' && (
            <>
              <ellipse cx="58" cy="106" rx="6" ry="5" fill="#C4B5FD" stroke="#4338CA" strokeWidth="2" />
              <ellipse cx="102" cy="106" rx="6" ry="5" fill="#C4B5FD" stroke="#4338CA" strokeWidth="2" />
            </>
          )}
        </svg>
      </div>

      {/* SPEECH BUBBLE (Duolingo-styled friendly card) */}
      {!compact && (
        <div className="flex-1 w-full bg-white dark:bg-slate-800 rounded-2xl p-3.5 sm:p-4 border-2 border-slate-200 dark:border-slate-700 shadow-xs relative transition-all">
          {/* Top pointer on mobile, Left pointer on desktop */}
          <div className="sm:hidden absolute -top-2 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-white dark:bg-slate-800 border-l-2 border-t-2 border-slate-200 dark:border-slate-700 rotate-45" />
          <div className="hidden sm:block absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-l-2 border-b-2 border-slate-200 dark:border-slate-700 rotate-45" />

          <div className="relative z-10 flex flex-col justify-center">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-xs sm:text-sm text-indigo-700 dark:text-indigo-400 font-display">
                  Tali the Tarsier
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${
                    activeState === 'advancing'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : activeState === 'connecting' || activeState === 'benchmarking'
                      ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300'
                      : activeState === 'developing'
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                      : activeState === 'emerging'
                      ? 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300'
                  }`}
                >
                  {activeState === 'advancing'
                    ? 'Advancing Coach 🌟'
                    : activeState === 'connecting' || activeState === 'benchmarking'
                    ? 'Connecting Coach 👍'
                    : activeState === 'developing'
                    ? 'Effort & Growth 💪'
                    : activeState === 'emerging'
                    ? 'Determined Coach 🔥'
                    : activeState === 'empty'
                    ? 'Ready for Scores 📓'
                    : 'Academic Mascot 👓'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                Tap Tali to push glasses! 👓
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
              {displayMessage}
            </p>

            {/* Quick action button for Developing & Emerging states */}
            {(activeState === 'developing' || activeState === 'emerging') && onGoalPlannerClick && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">
                  {activeState === 'emerging'
                    ? '🔥 Find the exact score needed on your next task:'
                    : '💡 Strategize your target grades:'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    onGoalPlannerClick();
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-xl transition-all flex items-center gap-1 shadow-2xs cursor-pointer ${
                    activeState === 'emerging'
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Open Goal Planner</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
