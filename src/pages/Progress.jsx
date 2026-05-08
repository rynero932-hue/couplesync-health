import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, TrendingDown, Target, Activity, Calendar, ChevronRight, Plus } from 'lucide-react';

const Progress = ({ user }) => {
  const currentWeight = user?.gender === 'male' ? 75.4 : 52.1;
  const targetWeight = user?.gender === 'male' ? 70.0 : 48.0;
  const startWeight = user?.gender === 'male' ? 82.0 : 56.0;
  const progress = ((startWeight - currentWeight) / (startWeight - targetWeight)) * 100;

  const logs = [
    { date: '08 Mei', weight: currentWeight, change: '-0.3 kg' },
    { date: '07 Mei', weight: currentWeight + 0.3, change: '-0.2 kg' },
    { date: '06 Mei', weight: currentWeight + 0.5, change: '+0.1 kg' },
    { date: '05 Mei', weight: currentWeight + 0.4, change: '-0.5 kg' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Progress Berat Badan</h1>
          <p className="text-white/60">Terus pantau perubahanmu bersama pasangan.</p>
        </div>
        <button className="gradient-bg px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20">
          <Plus size={20} /> Catat Berat Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Summary Card */}
        <div className="glass p-8 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Scale size={32} className="text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Berat Sekarang</p>
            <p className="text-4xl font-bold">{currentWeight} <span className="text-lg text-white/40">kg</span></p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full">
            <TrendingDown size={14} className="text-green-400" />
            <span className="text-xs font-bold text-green-400">-{ (startWeight - currentWeight).toFixed(1) } kg total</span>
          </div>
        </div>

        {/* Target Card */}
        <div className="md:col-span-2 glass p-8 space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
                <Target size={20} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold">Target Perjalanan</p>
                <p className="text-xs text-white/40">{targetWeight} kg Goals</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold gradient-text">{Math.round(progress)}%</p>
              <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">Selesai</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden p-1">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full gradient-bg rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)]"
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-white/20 uppercase tracking-tighter">
              <span>Mulai: {startWeight} kg</span>
              <span>Sisa: { (currentWeight - targetWeight).toFixed(1) } kg lagi</span>
              <span>Target: {targetWeight} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Graph Visualization (Mock) */}
      <div className="glass p-8 space-y-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Activity size={18} className="text-blue-400" />
          Tren 7 Hari Terakhir
        </h3>
        <div className="h-48 w-full flex items-end justify-between gap-2 px-4">
          {[40, 55, 45, 70, 60, 85, 65].map((height, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="w-full relative">
                 <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  className={`w-full rounded-t-lg transition-all ${i === 6 ? 'gradient-bg' : 'bg-white/10 group-hover:bg-white/20'}`}
                />
              </div>
              <span className="text-[10px] font-bold text-white/20">0{i+2}</span>
            </div>
          ))}
        </div>
      </div>

      {/* History Table */}
      <div className="glass overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="font-bold flex items-center gap-2">
            <Calendar size={18} className="text-white/40" />
            Riwayat Pencatatan
          </h3>
        </div>
        <div className="divide-y divide-white/5">
          {logs.map((log, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xs font-bold text-white/40">
                  {log.date}
                </div>
                <div>
                  <p className="font-bold">{log.weight} kg</p>
                  <p className={`text-xs font-bold ${log.change.includes('-') ? 'text-green-400' : 'text-red-400'}`}>
                    {log.change}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/10" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Progress;
