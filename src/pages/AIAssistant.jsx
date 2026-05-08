import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, FileText, Sparkles, Send, Brain, Fingerprint, Lock } from 'lucide-react';

const AIAssistant = ({ user }) => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: `Halo ${user?.name}, saya AI Health Assistant pribadimu. Semua data kesehatanmu diproses secara lokal dan private. Ada yang ingin kamu tanyakan hari ini?`,
      time: '11:00'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input, time: '11:05' };
    setMessages([...messages, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on OpenHealth logic (local first)
    setTimeout(() => {
      const aiMsg = { 
        role: 'ai', 
        text: getAIResponse(input, user.gender), 
        time: '11:06' 
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (query, gender) => {
    const q = query.toLowerCase();
    if (q.includes('makan') || q.includes('diet')) {
      return `Berdasarkan profil ${gender === 'male' ? 'pria' : 'wanita'} kamu, saya sarankan fokus pada asupan protein tinggi dan kurangi karbohidrat olahan di malam hari untuk mengoptimalkan fat loss.`;
    }
    if (q.includes('workout') || q.includes('latihan')) {
      return `Untuk hari ini, kamu baru menyelesaikan 1 dari 4 latihan. Konsistensi adalah kunci. Jangan lupa stretching setelah selesai untuk menghindari cedera.`;
    }
    return "Saya sedang menganalisis data kesehatanmu secara lokal. Kamu bisa menanyakan tentang nutrisi, jadwal tidur, atau tips latihan yang sesuai dengan progresmu.";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 gradient-bg rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Zap size={24} className="text-white fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">OpenHealth AI</h1>
            <div className="flex items-center gap-2">
               <ShieldCheck size={14} className="text-green-500" />
               <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Privacy Secured • Local Analysis</span>
            </div>
          </div>
        </div>

        <div className="hidden md:flex gap-3">
           <div className="glass px-4 py-2 flex items-center gap-2 border-white/10">
              <Brain size={16} className="text-purple-400" />
              <span className="text-xs font-bold">Data Synced</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Features Sidebar */}
        <div className="hidden md:flex flex-col gap-4">
           <div className="glass p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">AI Capabilities</h3>
              <div className="space-y-3">
                 <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <FileText size={18} className="text-blue-400 mt-0.5" />
                    <div>
                       <p className="text-xs font-bold">Smart Parsing</p>
                       <p className="text-[10px] text-white/30">Menganalisis hasil lab & catatan medis.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <Sparkles size={18} className="text-pink-400 mt-0.5" />
                    <div>
                       <p className="text-xs font-bold">Pattern Recognition</p>
                       <p className="text-[10px] text-white/30">Mendeteksi kebiasaan kurang sehat.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                    <Fingerprint size={18} className="text-purple-400 mt-0.5" />
                    <div>
                       <p className="text-xs font-bold">Privacy First</p>
                       <p className="text-[10px] text-white/30">Data tidak pernah keluar dari device.</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass p-6 bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/10">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                 <Lock size={16} />
                 <span className="text-xs font-bold uppercase tracking-widest">Security Note</span>
              </div>
              <p className="text-[11px] text-white/40 leading-relaxed italic">
                 "Semua percakapan ini dienkkripsi dan hanya disimpan secara lokal untuk memberikan saran yang paling relevan bagi kesehatanmu."
              </p>
           </div>
        </div>

        {/* Chat Area */}
        <div className="md:col-span-2 glass flex flex-col overflow-hidden relative">
           <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                    ? 'bg-white/10 text-white rounded-tr-none' 
                    : 'bg-purple-500/10 text-white/90 border border-purple-500/20 rounded-tl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-purple-500/10 p-4 rounded-2xl flex gap-1 items-center">
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              )}
           </div>

           <form onSubmit={handleSend} className="p-6 border-t border-white/5">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Tanyakan sesuatu tentang kesehatanmu..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:border-purple-500 transition-all text-sm"
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white"
                >
                  <Send size={18} />
                </button>
              </div>
           </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
