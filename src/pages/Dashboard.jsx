import React from 'react';
import { motion } from 'framer-motion';
import { 
  Flame, 
  Droplets, 
  Activity, 
  Moon, 
  Smile, 
  Scale, 
  ChevronRight,
  TrendingUp,
  Quote
} from 'lucide-react';

const Dashboard = ({ user }) => {
  const partnerName = user?.name === 'Ilham' ? 'Navisa' : 'Ilham';
  const partnerGender = user?.gender === 'male' ? 'female' : 'male';

  const stats = [
    { label: 'Kalori', value: '1.420', unit: 'kcal', icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Air Minum', value: '6/8', unit: 'gelas', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Workout', value: '1/1', unit: 'selesai', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Tidur', value: '7.5', unit: 'jam', icon: Moon, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Top Section: Greeting & Streak */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">
            Halo, <span className="gradient-text">{user?.name}</span>! 👋
          </h1>
          <p className="text-white/60 mt-1">Semangat untuk hari ini ya, sayang!</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="glass px-6 py-3 flex items-center gap-3 border-orange-500/20">
            <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
              <Flame size={20} className="text-orange-500 fill-current" />
            </div>
            <div>
              <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Streak Kita</p>
              <p className="text-xl font-bold">14 Hari</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Section */}
      <div className="glass p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
          <Quote size={80} />
        </div>
        <p className="text-lg italic font-medium leading-relaxed max-w-2xl relative z-10">
          "Kesehatan adalah bukti cinta kita pada diri sendiri dan pasangan. Mari bertumbuh bersama, satu langkah setiap hari."
        </p>
        <p className="text-sm text-white/40 mt-4">— CoupleSync Motivation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-6 glass-hover"
            >
              <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="text-[10px] text-white/30 font-bold">{stat.unit}</span>
              </div>
            </motion.div>
          ))}
          
          {/* Mood & Weight Large Cards */}
          <div className="col-span-2 glass p-6 flex items-center justify-between glass-hover cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-pink-500/10 rounded-2xl flex items-center justify-center">
                <Smile size={32} className="text-pink-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Mood Hari Ini</p>
                <p className="text-xl font-bold">Sangat Bahagia</p>
              </div>
            </div>
            <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
          </div>

          <div className="col-span-2 glass p-6 flex items-center justify-between glass-hover cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <Scale size={32} className="text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Berat Badan</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold">{user?.gender === 'male' ? '75.4' : '52.1'} kg</span>
                  <span className="text-xs text-green-400 font-bold">-0.3 kg</span>
                </div>
              </div>
            </div>
            <ChevronRight className="text-white/20 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Couple Sync Card */}
        <div className="glass p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full"></div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <TrendingUp size={20} className="text-purple-400" />
              Couple Sync Progress
            </h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{user?.name}</span>
                  <span className="text-purple-400">85%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full gradient-bg rounded-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm font-bold text-white/60">
                  <span>{partnerName}</span>
                  <span>72%</span>
                </div>
                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '72%' }}
                    className="h-full bg-white/20 rounded-full"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 text-center">
                <p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-2">Total Couple Progress</p>
                <p className="text-4xl font-bold gradient-text">78.5%</p>
                <p className="text-sm text-purple-400/80 mt-2 font-medium">
                  3 hari lagi mencapai streak baru! 🔥
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Relationship Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass p-6 flex items-center gap-4 sunset-gradient bg-opacity-10 border-none">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Heart size={24} className="text-white fill-current" />
          </div>
          <div>
            <p className="font-bold">"Kalian sudah konsisten 14 hari bersama."</p>
            <p className="text-xs text-white/70">Terus pertahankan semangatnya!</p>
          </div>
        </div>
        <div className="glass p-6 flex items-center gap-4 bg-purple-900/20 border-purple-500/20">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Flame size={24} className="text-purple-400" />
          </div>
          <div>
            <p className="font-bold">Total turun 7.4kg bersama!</p>
            <p className="text-xs text-white/50">Navisa turun 3.2kg • Ilham turun 4.2kg</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
