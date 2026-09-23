import React, { useState, useEffect, useRef, useCallback } from 'react';
import { playPop, playWhoosh, playBoing, playGrip, playCelebrationChime } from '../utils/audio';
import { Move, RefreshCw, X, Sparkles, Compass } from 'lucide-react';

export type TaliPetMode = 'idle' | 'held' | 'thrown' | 'climbing_left' | 'climbing_right' | 'sitting_floor';

interface InteractiveTaliPetProps {
  descriptorLevel?: string;
  isInitialActive?: boolean;
}

export const InteractiveTaliPet: React.FC<InteractiveTaliPetProps> = ({
  descriptorLevel,
  isInitialActive = true
}) => {
  const [isActive, setIsActive] = useState<boolean>(isInitialActive);
  const [mode, setMode] = useState<TaliPetMode>('idle');
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: 24, y: 160 });
  const [rotation, setRotation] = useState<number>(0);
  const [speech, setSpeech] = useState<string>('Kumusta! Drag or throw me anywhere! 🐾');
  const [showControls, setShowControls] = useState<boolean>(false);
  const [isWinking, setIsWinking] = useState<boolean>(false);
  const [pawsClimbingStep, setPawsClimbingStep] = useState<number>(0);
  const [sparks, setSparks] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Physics refs
  const posRef = useRef(pos);
  posRef.current = pos;
  const velRef = useRef<{ vx: number; vy: number }>({ vx: 0, vy: 0 });
  const modeRef = useRef<TaliPetMode>(mode);
  modeRef.current = mode;

  const dragStartRef = useRef<{ mouseX: number; mouseY: number; startX: number; startY: number }>({
    mouseX: 0,
    mouseY: 0,
    startX: 0,
    startY: 0
  });

  const recentMovesRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const animFrameRef = useRef<number | null>(null);
  const climbTimerRef = useRef<number | null>(null);

  const PET_SIZE = 92; // px width & height of mascot

  // Initialize position to bottom right or cozy spot safely on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialX = Math.max(16, window.innerWidth - PET_SIZE - 28);
      const initialY = Math.max(120, Math.min(window.innerHeight - PET_SIZE - 80, 240));
      setPos({ x: initialX, y: initialY });
      // Climb the right edge right from the start to show off the cute feature!
      setMode('climbing_right');
      setSpeech('I found the right ledge! Peek-a-boo! 👀');
    }
  }, []);

  // Periodic tarsier blink
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsWinking(true);
      setTimeout(() => setIsWinking(false), 240);
    }, 4500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Climbing ledge animation step loop (when on left or right wall)
  useEffect(() => {
    if (mode === 'climbing_left' || mode === 'climbing_right') {
      let climbDirection = -1; // -1 for upward, 1 for downward
      const climbInterval = window.setInterval(() => {
        setPawsClimbingStep((prev) => (prev + 1) % 4);

        setPos((current) => {
          const minY = 60;
          const maxY = window.innerHeight - PET_SIZE - 60;
          let nextY = current.y + climbDirection * 14;

          if (nextY <= minY) {
            climbDirection = 1;
            nextY = minY;
          } else if (nextY >= maxY) {
            climbDirection = -1;
            nextY = maxY;
          }

          // Ensure locked to ledge
          const targetX = mode === 'climbing_left' ? 4 : window.innerWidth - PET_SIZE - 4;
          return { x: targetX, y: nextY };
        });
      }, 700);

      climbTimerRef.current = climbInterval;
      return () => clearInterval(climbInterval);
    }
  }, [mode]);

  // Main Physics Simulation Loop for "thrown" mode
  useEffect(() => {
    if (mode !== 'thrown') return;

    let lastTime = performance.now();

    const loop = (currentTime: number) => {
      const dt = Math.min(32, currentTime - lastTime) / 16.66; // normalized frame factor
      lastTime = currentTime;

      const currentPos = posRef.current;
      const currentVel = velRef.current;

      // Apply air friction / damping
      currentVel.vx *= 0.982;
      currentVel.vy *= 0.982;

      // Gentle gravity
      currentVel.vy += 0.38 * dt;

      // New position
      let nextX = currentPos.x + currentVel.vx * dt;
      let nextY = currentPos.y + currentVel.vy * dt;

      // Screen boundary collisions
      const minX = 0;
      const maxX = window.innerWidth - PET_SIZE;
      const minY = 10;
      const maxY = window.innerHeight - PET_SIZE - 12;

      // Rotation tilts in direction of motion
      const speed = Math.hypot(currentVel.vx, currentVel.vy);
      if (speed > 1) {
        setRotation(Math.max(-45, Math.min(45, currentVel.vx * 3)));
      } else {
        setRotation(0);
      }

      // Check wall latching (Left ledge)
      if (nextX <= minX + 10) {
        playGrip();
        setMode('climbing_left');
        setPos({ x: 2, y: Math.max(minY, Math.min(maxY, nextY)) });
        setRotation(0);
        velRef.current = { vx: 0, vy: 0 };
        setSpeech('Caught the left ledge! Clinging tight! 🧗');
        return;
      }

      // Check wall latching (Right ledge)
      if (nextX >= maxX - 10) {
        playGrip();
        setMode('climbing_right');
        setPos({ x: maxX - 2, y: Math.max(minY, Math.min(maxY, nextY)) });
        setRotation(0);
        velRef.current = { vx: 0, vy: 0 };
        setSpeech('Grabbed the right ledge! Peek-a-boo! 👀');
        return;
      }

      // Bounce off floor
      if (nextY >= maxY) {
        nextY = maxY;
        if (Math.abs(currentVel.vy) > 2) {
          playBoing();
          currentVel.vy = -currentVel.vy * 0.55;
        } else {
          currentVel.vy = 0;
          // Settled on floor
          if (Math.abs(currentVel.vx) < 1) {
            setMode('sitting_floor');
            setSpeech('Landed safely on the floor! Ready for your grades! 🌟');
            velRef.current = { vx: 0, vy: 0 };
            setRotation(0);
            return;
          }
        }
      }

      // Bounce off top ceiling
      if (nextY <= minY) {
        nextY = minY;
        currentVel.vy = -currentVel.vy * 0.55;
      }

      setPos({ x: nextX, y: nextY });

      // Continue flight
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [mode]);

  // Pointer drag handler (works seamlessly for mouse and mobile touch!)
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Capture pointer
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (climbTimerRef.current) clearInterval(climbTimerRef.current);

    playPop();
    setMode('held');
    setRotation(0);
    setSpeech('Wheeee! Taking me for a ride? 🐾');

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pos.x,
      startY: pos.y
    };

    recentMovesRef.current = [{ x: e.clientX, y: e.clientY, t: performance.now() }];
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (modeRef.current !== 'held') return;

    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;

    let targetX = dragStartRef.current.startX + dx;
    let targetY = dragStartRef.current.startY + dy;

    // Bounds checking
    targetX = Math.max(-10, Math.min(window.innerWidth - PET_SIZE + 10, targetX));
    targetY = Math.max(10, Math.min(window.innerHeight - PET_SIZE, targetY));

    setPos({ x: targetX, y: targetY });

    // Track velocities
    const now = performance.now();
    recentMovesRef.current.push({ x: e.clientX, y: e.clientY, t: now });
    if (recentMovesRef.current.length > 5) {
      recentMovesRef.current.shift();
    }

    // Dynamic tilt while being held
    setRotation(Math.max(-25, Math.min(25, dx * 0.4)));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (modeRef.current !== 'held') return;

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    // Calculate throw velocity based on recent move history
    const history = recentMovesRef.current;
    let vx = 0;
    let vy = 0;

    if (history.length >= 2) {
      const first = history[0];
      const last = history[history.length - 1];
      const dt = Math.max(10, last.t - first.t);
      vx = ((last.x - first.x) / dt) * 16.66;
      vy = ((last.y - first.y) / dt) * 16.66;
    }

    // Clamp throw velocity to fun, controllable limits
    const maxSpeed = 38;
    vx = Math.max(-maxSpeed, Math.min(maxSpeed, vx * 1.25));
    vy = Math.max(-maxSpeed, Math.min(maxSpeed, vy * 1.25));

    const throwSpeed = Math.hypot(vx, vy);

    // If near edge and low speed, snap directly to climb
    const minX = 0;
    const maxX = window.innerWidth - PET_SIZE;

    if (pos.x <= minX + 25 && throwSpeed < 8) {
      playGrip();
      setMode('climbing_left');
      setPos({ x: 2, y: pos.y });
      setRotation(0);
      setSpeech('Holding on to the left edge! 🧗');
      return;
    }

    if (pos.x >= maxX - 25 && throwSpeed < 8) {
      playGrip();
      setMode('climbing_right');
      setPos({ x: maxX - 2, y: pos.y });
      setRotation(0);
      setSpeech('Hanging on the right edge! 🧗');
      return;
    }

    // If thrown with momentum:
    if (throwSpeed >= 4) {
      playWhoosh();
      velRef.current = { vx, vy };
      setMode('thrown');
      setSpeech('WOOOOSH! Catch me if you can! 🚀');
    } else {
      // Gentle drop
      setMode('idle');
      setSpeech('Here I am! Tarsier paws ready! ✨');
      setRotation(0);
    }
  };

  // Quick Action: Throw to Left Ledge
  const launchToLedge = (side: 'left' | 'right') => {
    playWhoosh();
    const targetX = side === 'left' ? 4 : window.innerWidth - PET_SIZE - 4;
    const targetY = Math.max(80, Math.min(window.innerHeight - 200, pos.y));
    setPos({ x: targetX, y: targetY });
    setMode(side === 'left' ? 'climbing_left' : 'climbing_right');
    setRotation(0);
    setSpeech(side === 'left' ? 'Scampered to the left ledge! 🧗' : 'Climbed to the right ledge! 🐾');
    setShowControls(false);
  };

  // Quick Action: High Flying Leap
  const launchLeap = () => {
    playWhoosh();
    velRef.current = { vx: (Math.random() - 0.5) * 26, vy: -28 };
    setMode('thrown');
    setSpeech('HIGH JUMP! Wheeeeee! 🚀');
    setShowControls(false);
  };

  // Quick Action: Reset to cozy bottom
  const resetToCorner = () => {
    playPop();
    const targetX = Math.max(20, window.innerWidth - PET_SIZE - 24);
    const targetY = window.innerHeight - PET_SIZE - 80;
    setPos({ x: targetX, y: targetY });
    setMode('sitting_floor');
    setRotation(0);
    setSpeech('Back in my cozy corner! ☕');
    setShowControls(false);
  };

  // Spawn tap sparks
  const handleTapTali = (e: React.MouseEvent) => {
    e.stopPropagation();
    playCelebrationChime();
    const newSparks = ['⭐', '🌟', '💖', '🐾', '✨'].map((char, idx) => ({
      id: Date.now() + idx,
      text: char,
      x: (idx - 2) * 24,
      y: -15 - Math.random() * 20
    }));
    setSparks((prev) => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks([]);
    }, 900);
  };

  if (!isActive) {
    return (
      <button
        onClick={() => {
          playPop();
          setIsActive(true);
        }}
        className="fixed bottom-4 right-4 z-50 btn-3d px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-xl border-b-4 border-indigo-800 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105"
        title="Summon interactive Tali the Tarsier"
      >
        <span>🐾</span>
        <span>Summon Tali Companion</span>
      </button>
    );
  }

  const isClimbing = mode === 'climbing_left' || mode === 'climbing_right';

  return (
    <div
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0px) rotate(${rotation}deg)`,
        width: `${PET_SIZE}px`,
        height: `${PET_SIZE}px`,
        touchAction: 'none'
      }}
      className={`fixed top-0 left-0 z-50 select-none cursor-grab active:cursor-grabbing transition-shadow ${
        mode === 'held' ? 'scale-110 drop-shadow-2xl' : 'drop-shadow-lg'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Speech Bubble */}
      <div
        className={`absolute -top-14 left-1/2 -translate-x-1/2 min-w-[170px] max-w-[220px] bg-white dark:bg-slate-900 border-2 border-indigo-500 text-indigo-950 dark:text-indigo-100 text-[11px] font-black rounded-2xl px-2.5 py-1.5 shadow-lg text-center pointer-events-none transition-all duration-300 ${
          speech ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
        }`}
      >
        {speech}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white dark:bg-slate-900 border-r-2 border-b-2 border-indigo-500 rotate-45" />
      </div>

      {/* Floating Sparkles on Tap */}
      {sparks.map((spark) => (
        <span
          key={spark.id}
          style={{
            transform: `translate(${spark.x}px, ${spark.y}px)`
          }}
          className="absolute top-0 left-1/2 -translate-x-1/2 text-xl pointer-events-none animate-bounce-subtle z-50"
        >
          {spark.text}
        </span>
      ))}

      {/* Main Tarsier SVG with Suction Paws and Climbing Variations */}
      <div
        onClick={handleTapTali}
        className={`w-full h-full relative transition-transform duration-300 ${
          mode === 'climbing_left' ? 'scale-x-[-1]' : ''
        }`}
      >
        <svg
          viewBox="0 0 160 160"
          className={`w-full h-full ${
            mode === 'thrown'
              ? 'animate-pulse'
              : mode === 'idle'
              ? 'animate-bounce-subtle'
              : ''
          }`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="petFur" x1="40" y1="20" x2="120" y2="150" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FAF7F5" />
              <stop offset="60%" stopColor="#EDE9FE" />
              <stop offset="100%" stopColor="#DDD6FE" />
            </linearGradient>

            <radialGradient id="petIris" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#451A03" />
            </radialGradient>

            <linearGradient id="petEar" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBCFE8" />
              <stop offset="100%" stopColor="#C4B5FD" />
            </linearGradient>
          </defs>

          {/* Tail */}
          <path
            d={
              isClimbing
                ? 'M102 126 C124 136 142 110 135 88 C130 70 120 74 130 50'
                : 'M102 126 C124 134 142 120 138 98 C135 80 115 76 118 60 C120 48 134 46 138 56'
            }
            stroke="#C4B5FD"
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Left & Right Ears */}
          <ellipse cx="32" cy="52" rx="18" ry="23" transform="rotate(-25 32 52)" fill="#DDD6FE" stroke="#4F46E5" strokeWidth="2.5" />
          <ellipse cx="34" cy="52" rx="12" ry="16" transform="rotate(-25 34 52)" fill="url(#petEar)" />
          <ellipse cx="128" cy="52" rx="18" ry="23" transform="rotate(25 128 52)" fill="#DDD6FE" stroke="#4F46E5" strokeWidth="2.5" />
          <ellipse cx="126" cy="52" rx="12" ry="16" transform="rotate(25 126 52)" fill="url(#petEar)" />

          {/* Body and Head */}
          <path
            d="M48 94 C48 70 60 52 80 52 C100 52 112 70 112 94 C112 120 102 138 80 138 C58 138 48 120 48 94 Z"
            fill="url(#petFur)"
            stroke="#4338CA"
            strokeWidth="3.5"
          />
          <circle cx="80" cy="76" r="44" fill="url(#petFur)" stroke="#4338CA" strokeWidth="3.5" />

          {/* White Chest */}
          <path d="M66 98 C66 88 72 82 80 82 C88 82 94 88 94 98 C94 116 88 128 80 128 C72 128 66 116 66 98 Z" fill="#FFFDFB" opacity="0.9" />

          {/* Massive Tarsier Eyes */}
          <ellipse cx="60" cy="72" rx="19" ry="20" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
          <ellipse cx="100" cy="72" rx="19" ry="20" fill="#FFFFFF" stroke="#4338CA" strokeWidth="3" />
          <ellipse cx="60" cy="72" rx="15" ry="16" fill="url(#petIris)" />
          <ellipse cx="100" cy="72" rx="15" ry="16" fill="url(#petIris)" />

          {isWinking ? (
            <>
              <circle cx="60" cy="72" r="10" fill="#1E1B4B" />
              <path d="M89 72 Q100 82 111 72" stroke="#1E1B4B" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <circle cx="60" cy="72" r="10" fill="#1E1B4B" />
              <circle cx="100" cy="72" r="10" fill="#1E1B4B" />
              <circle cx="55" cy="67" r="4.2" fill="#FFFFFF" />
              <circle cx="65" cy="76" r="2" fill="#FFFFFF" />
              <circle cx="95" cy="67" r="4.2" fill="#FFFFFF" />
              <circle cx="105" cy="76" r="2" fill="#FFFFFF" />
            </>
          )}

          {/* Nose & Smile */}
          <polygon points="80,84 76,81 84,81" fill="#7C3AED" />
          <path d="M76 87 Q80 92 84 87" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Cheeks */}
          <ellipse cx="44" cy="85" rx="6" ry="3.5" fill="#F472B6" opacity="0.45" />
          <ellipse cx="116" cy="85" rx="6" ry="3.5" fill="#F472B6" opacity="0.45" />

          {/* Oversized Round Glasses */}
          <path d="M74 69 Q80 65 86 69" stroke="#312E81" strokeWidth="4" strokeLinecap="round" fill="none" />
          <rect x="39" y="52" width="36" height="36" rx="18" fill="#818CF8" fillOpacity="0.15" stroke="#312E81" strokeWidth="3.5" />
          <rect x="85" y="52" width="36" height="36" rx="18" fill="#818CF8" fillOpacity="0.15" stroke="#312E81" strokeWidth="3.5" />

          {/* SUCTION-PAD CLIMBING PAWS (Dynamic during wall climb or grabbing) */}
          {isClimbing ? (
            /* Clinging Paws grasping the screen ledge! */
            <g className={pawsClimbingStep % 2 === 0 ? '-translate-y-1' : 'translate-y-1'}>
              {/* Left Wall Gripping Paw */}
              <ellipse cx="140" cy="50" rx="9" ry="6" fill="#DDD6FE" stroke="#4338CA" strokeWidth="2" />
              <circle cx="142" cy="48" r="2.5" fill="#FFFDFB" />
              <circle cx="146" cy="52" r="2.5" fill="#FFFDFB" />
              {/* Lower Gripping Paw */}
              <ellipse cx="142" cy="98" rx="9" ry="6" fill="#DDD6FE" stroke="#4338CA" strokeWidth="2" />
              <circle cx="144" cy="96" r="2.5" fill="#FFFDFB" />
              <circle cx="147" cy="100" r="2.5" fill="#FFFDFB" />
            </g>
          ) : mode === 'held' ? (
            /* Waving Held Paws */
            <g className="animate-pulse">
              <ellipse cx="40" cy="92" rx="7" ry="5" fill="#DDD6FE" stroke="#4338CA" strokeWidth="2" />
              <ellipse cx="120" cy="92" rx="7" ry="5" fill="#DDD6FE" stroke="#4338CA" strokeWidth="2" />
            </g>
          ) : (
            /* Normal Feet */
            <g>
              <ellipse cx="62" cy="136" rx="8" ry="5" fill="#C4B5FD" stroke="#4338CA" strokeWidth="2" />
              <ellipse cx="98" cy="136" rx="8" ry="5" fill="#C4B5FD" stroke="#4338CA" strokeWidth="2" />
            </g>
          )}
        </svg>
      </div>

      {/* Floating Mini Action Menu (Reveals on hover/tap) */}
      <div
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-1 rounded-xl border border-indigo-200 dark:border-indigo-800 shadow-md"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => launchToLedge('left')}
          className="p-1 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
          title="Climb Left Ledge"
        >
          ⬅️
        </button>
        <button
          type="button"
          onClick={launchLeap}
          className="p-1 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
          title="Throw High / Leap"
        >
          🚀
        </button>
        <button
          type="button"
          onClick={() => launchToLedge('right')}
          className="p-1 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
          title="Climb Right Ledge"
        >
          ➡️
        </button>
        <button
          type="button"
          onClick={resetToCorner}
          className="p-1 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded text-slate-700 dark:text-slate-300 hover:text-indigo-600 transition-colors"
          title="Rest at Bottom Corner"
        >
          🏠
        </button>
        <button
          type="button"
          onClick={() => setIsActive(false)}
          className="p-1 hover:bg-red-50 dark:hover:bg-red-950/40 rounded text-slate-400 hover:text-red-500 transition-colors"
          title="Hide Tali Pet"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
