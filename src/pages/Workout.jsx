import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, CheckCircle2, Timer, Flame, Award, ChevronRight, Info } from 'lucide-react';

const Workout = ({ user }) => {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const malePlan = [
    { id: 1, name: 'Push Up', reps: '10x', duration: 45, icon: '💪' },
    { id: 2, name: 'Squat', reps: '15x', duration: 45, icon: '🦵' },
    { id: 3, name: 'Plank', reps: '30s', duration: 30, icon: '🧘' },
    { id: 4, name: 'Jalan Cepat', reps: '15m', duration: 900, icon: '🚶' },
  ];

  const femalePlan = [
    { id: 1, name: 'Squat', reps: '15x', duration: 45, icon: '🍑' },
    { id: 2, name: 'Glute Bridge', reps: '15x', duration: 45, icon: '🧘' },
    { id: 3, name: 'March In Place', reps: '1m', duration: 60, icon: '🏃' },
    { id: 4, name: 'Stretching', reps: '5m', duration: 300, icon: '✨' },
  ];

  const plan = user?.gender === 'male' ? malePlan : femalePlan;

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setIsCompleted(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startWorkout = (workout) => {
    setActiveWorkout(workout);
    setTimeLeft(workout.duration);
    setIsActive(true);
    setIsCompleted(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Workout Hari Ini</h1>
          <p className="text-white/60">Fokus: {user?.gender === 'male' ? 'Fat Loss & Strength' : 'Fat Loss & Toning'}</p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-4 py-2 flex items-center gap-2">
            <Timer size={16} className="text-purple-400" />
            <span className="text-sm font-bold">Total: {user?.gender === 'male' ? '25m' : '20m'}</span>
          </div>
          <div className="glass px-4 py-2 flex items-center gap-2">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-bold">~150 kcal</span>
          </div>
        </div>
      </div>

      {!activeWorkout ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plan.map((exercise, i) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 glass-hover group flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="text-4xl w-16 h-16 glass flex items-center justify-center bg-white/5">
                  {exercise.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{exercise.name}</h3>
                  <p className="text-purple-400 font-bold">{exercise.reps}</p>
                </div>
              </div>
              <button 
                onClick={() => startWorkout(exercise)}
                className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform"
              >
                <Play size={20} className="text-white fill-current ml-1" />
              </button>
            </motion.div>
          ))}

          <div className="col-span-full glass p-8 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-white/5 rounded-full">
              <Info size={32} className="text-white/20" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white/60">Rest Day Tomorrow</h3>
              <p className="text-white/30 text-sm max-w-xs">Jadwal besok adalah pemulihan dan stretching ringan untuk menjaga otot tetap rileks.</p>
            </div>
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-12 flex flex-col items-center text-center space-y-8"
        >
          <div className="text-6xl mb-4 animate-float">{activeWorkout.icon}</div>
          <div>
            <h2 className="text-4xl font-bold mb-2">{activeWorkout.name}</h2>
            <p className="text-xl text-white/40">{activeWorkout.reps}</p>
          </div>

          <div className="relative w-64 h-64 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="120"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
                fill="transparent"
              />
              <motion.circle
                cx="128"
                cy="128"
                r="120"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray="754"
                initial={{ strokeDashoffset: 0 }}
                animate={{ strokeDashoffset: 754 - (754 * timeLeft) / activeWorkout.duration }}
                fill="transparent"
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute text-6xl font-bold font-inter tabular-nums">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="flex gap-6">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-white/10 text-white' : 'gradient-bg text-white'
              }`}
            >
              {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
            </button>
            <button 
              onClick={() => { setActiveWorkout(null); setIsActive(false); }}
              className="w-20 h-20 rounded-full bg-white/5 text-white/40 flex items-center justify-center hover:bg-white/10 transition-all"
            >
              <RotateCcw size={32} />
            </button>
          </div>

          <AnimatePresence>
            {isCompleted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 glass bg-dark/80 flex flex-col items-center justify-center p-8 z-20"
              >
                <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                  <CheckCircle2 size={48} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-2">Hebat! 🔥</h3>
                <p className="text-white/60 mb-8">{activeWorkout.name} Selesai</p>
                <button 
                  onClick={() => setActiveWorkout(null)}
                  className="px-8 py-4 gradient-bg rounded-xl font-bold flex items-center gap-2"
                >
                  Lanjut Latihan <ChevronRight size={20} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Shared Achievement Card */}
      <div className="glass p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-yellow-500/20 rounded-2xl">
            <Award size={40} className="text-yellow-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Unlock Badge: Morning Warrior</h3>
            <p className="text-sm text-white/50">Kalian berdua menyelesaikan workout sebelum jam 9 pagi!</p>
          </div>
          <div className="ml-auto hidden md:flex -space-x-4">
            <div className="w-12 h-12 rounded-full border-4 border-dark bg-blue-500 flex items-center justify-center font-bold">I</div>
            <div className="w-12 h-12 rounded-full border-4 border-dark bg-pink-500 flex items-center justify-center font-bold">N</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Workout;
