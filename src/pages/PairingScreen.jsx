import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, UserCheck, ArrowRight, Sparkles } from 'lucide-react';

const PairingScreen = ({ onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Choose Profile, 2: Pairing Code
  const [selectedUser, setSelectedUser] = useState(null); // { name, gender }
  const [code, setCode] = useState(['', '', '', '', '', '']);

  const handleSelectUser = (name, gender) => {
    setSelectedUser({ name, gender });
    setStep(2);
  };

  const handleCodeChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`).focus();
    }
  };

  const handlePair = () => {
    if (code.every(c => c !== '')) {
      onSuccess(selectedUser);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark">
      <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full"></div>

      <motion.div 
        layout
        className="glass p-10 w-full max-w-lg mx-4 z-10"
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold mb-2">Siapa Kamu?</h1>
              <p className="text-white/60 mb-8">Pilih profilmu untuk memulai perjalanan.</p>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => handleSelectUser('Ilham', 'male')}
                  className="group relative flex flex-col items-center p-6 glass glass-hover border-blue-500/20 hover:border-blue-500/50"
                >
                  <div className="w-20 h-20 rounded-full bg-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User size={40} className="text-blue-400" />
                  </div>
                  <span className="text-xl font-bold">Ilham</span>
                  <span className="text-xs text-white/40 mt-1 uppercase tracking-widest">Male User</span>
                </button>

                <button 
                  onClick={() => handleSelectUser('Navisa', 'female')}
                  className="group relative flex flex-col items-center p-6 glass glass-hover border-pink-500/20 hover:border-pink-500/50"
                >
                  <div className="w-20 h-20 rounded-full bg-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <User size={40} className="text-pink-400" />
                  </div>
                  <span className="text-xl font-bold">Navisa</span>
                  <span className="text-xs text-white/40 mt-1 uppercase tracking-widest">Female User</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center"
            >
              <button 
                onClick={() => setStep(1)}
                className="text-white/40 hover:text-white mb-6 text-sm flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowRight size={14} className="rotate-180" /> Ganti Profil
              </button>

              <h1 className="text-3xl font-bold mb-2">Pasangkan Akun</h1>
              <p className="text-white/60 mb-8 font-inter">Masukkan kode unik dari pasanganmu.</p>

              <div className="flex justify-center gap-3 mb-8">
                {code.map((digit, i) => (
                  <input
                    key={i}
                    id={`code-${i}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(i, e.target.value)}
                    className="w-12 h-16 bg-white/5 border border-white/10 rounded-xl text-center text-2xl font-bold focus:outline-none focus:border-purple-500"
                  />
                ))}
              </div>

              <button
                onClick={handlePair}
                disabled={!code.every(c => c !== '')}
                className="w-full gradient-bg hover:opacity-90 py-4 rounded-xl font-bold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UserCheck size={20} />
                Hubungkan Sekarang
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-white/30 text-sm">
                <Sparkles size={14} />
                <span>Kode: 123456 (Demo)</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PairingScreen;
