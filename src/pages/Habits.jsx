import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Plus, Droplets, Dumbbell, Footprints, Moon, Ban, Coffee, Pizza, Sparkles } from 'lucide-react';

const Habits = ({ user }) => {
  const [habits, setHabits] = useState([
    { id: 1, title: 'Minum Air (2L)', icon: Droplets, completed: true, color: 'text-blue-400' },
    { id: 2, title: 'Workout 30 Menit', icon: Dumbbell, completed: false, color: 'text-green-400' },
    { id: 3, title: 'Jalan Kaki 5k Langkah', icon: Footprints, completed: false, color: 'text-orange-400' },
    { id: 4, title: 'Tidur Sebelum Jam 11', icon: Moon, completed: true, color: 'text-purple-400' },
    { id: 5, title: 'No Junk Food', icon: Pizza, completed: false, color: 'text-red-400' },
    { id: 6, title: 'No Sugary Drinks', icon: Coffee, completed: false, color: 'text-yellow-400' },
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  const completedCount = habits.filter(h => h.completed).length;
  const progress = (completedCount / habits.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habit Tracker</h1>
          <p className="text-white/60">Bangun rutinitas positif setiap hari.</p>
        </div>
        <div className="text-right">
          <p className="text-4xl font-bold gradient-text">{Math.round(progress)}%</p>
          <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Hari Ini</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass p-2 h-6 w-full rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full gradient-bg rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-500"
        />
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit, i) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => toggleHabit(habit.id)}
            className={`glass p-5 flex items-center justify-between cursor-pointer group transition-all ${
              habit.completed ? 'bg-white/10 border-purple-500/30' : 'hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                habit.completed ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-white/20 group-hover:text-white/40'
              }`}>
                <habit.icon size={24} />
              </div>
              <div>
                <h3 className={`font-bold transition-all ${habit.completed ? 'text-white/40 line-through' : 'text-white'}`}>
                  {habit.title}
                </h3>
                <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Daily Habit</p>
              </div>
            </div>

            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
              habit.completed 
              ? 'bg-purple-500 border-purple-500 text-white' 
              : 'border-white/10 group-hover:border-white/30'
            }`}>
              {habit.completed && <Check size={18} strokeWidth={3} />}
            </div>
          </motion.div>
        ))}

        <button className="w-full glass p-5 flex items-center justify-center gap-3 text-white/40 hover:text-white hover:bg-white/5 transition-all border-dashed border-white/10">
          <Plus size={20} />
          <span className="font-bold">Tambah Habit Sendiri</span>
        </button>
      </div>

      {/* Partner Activity Small Card */}
      <div className="glass p-6 border-purple-500/10 bg-purple-500/5 relative overflow-hidden group">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center">
              <span className="font-bold text-pink-400">{user?.name === 'Ilham' ? 'N' : 'I'}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-dark rounded-full"></div>
          </div>
          <div>
            <p className="text-sm font-bold">{user?.name === 'Ilham' ? 'Navisa' : 'Ilham'} baru saja menyelesaikan:</p>
            <p className="text-xs text-purple-400 font-medium italic">"Minum Air (2L)" • 2 menit yang lalu</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="ml-auto w-10 h-10 glass flex items-center justify-center text-pink-400 cursor-pointer"
          >
            <Sparkles size={18} className="fill-current" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Habits;
