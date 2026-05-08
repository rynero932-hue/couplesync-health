import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart } from 'lucide-react';

const PasswordScreen = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // For MVP, we use a simple password. In production, this would be validated.
    if (password === '1234' || password.toLowerCase() === 'ilhamnavisa') {
      onSuccess();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full animate-pulse-slow"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 w-full max-w-md mx-4 text-center z-10"
      >
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full animate-float">
            <Heart size={32} className="text-white fill-current" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">CoupleSync</h1>
        <p className="text-white/60 mb-8 font-inter">Tumbuh Sehat Bersama Walaupun Berjauhan</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan Password"
              className={`w-full bg-white/5 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl py-4 px-12 focus:outline-none focus:border-purple-500 transition-all text-center tracking-[0.5em] text-xl`}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          </div>

          <button
            type="submit"
            className="w-full gradient-bg hover:opacity-90 py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/20"
          >
            Masuk ke Dunia Kita
          </button>
        </form>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-400 mt-4 text-sm font-inter"
          >
            Password salah, coba lagi ya ❤️
          </motion.p>
        )}

        <div className="mt-12 pt-8 border-t border-white/5 text-white/20 text-xs font-inter uppercase tracking-widest">
          Private Shared Journey
        </div>
      </motion.div>
    </div>
  );
};

export default PasswordScreen;
