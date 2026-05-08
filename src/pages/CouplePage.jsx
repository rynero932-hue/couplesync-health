import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Heart, Smile, Zap, MessageCircle, MoreVertical, Coffee, Moon } from 'lucide-react';

const CouplePage = ({ user }) => {
  const partnerName = user?.name === 'Ilham' ? 'Navisa' : 'Ilham';
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: partnerName, text: 'Semangat workoutnya sayang! ❤️', time: '10:30' },
    { id: 2, sender: user?.name, text: 'Iyaa, kamu juga jangan lupa minum air yaa', time: '10:32' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now(),
      sender: user?.name,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const reactions = [
    { icon: '❤️', label: 'Love' },
    { icon: '🔥', label: 'Semangat' },
    { icon: '💪', label: 'Strong' },
    { icon: '🍎', label: 'Sehat' },
    { icon: '💧', label: 'Minum' },
    { icon: '💤', label: 'Tidur' },
  ];

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-160px)] min-h-[600px] animate-in fade-in duration-700">
      {/* Sidebar: Couple Info & Mood */}
      <div className="space-y-6">
        <div className="glass p-8 text-center space-y-6 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-2 gradient-bg"></div>
           
           <div className="flex justify-center -space-x-4">
              <div className="w-20 h-20 rounded-full border-4 border-dark bg-blue-500 flex items-center justify-center text-3xl font-bold z-10">I</div>
              <div className="w-20 h-20 rounded-full border-4 border-dark bg-pink-500 flex items-center justify-center text-3xl font-bold">N</div>
           </div>
           
           <div>
              <h2 className="text-2xl font-bold">Ilham & Navisa</h2>
              <p className="text-sm text-white/40 italic">"Tumbuh sehat bersama sejak 2024"</p>
           </div>

           <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">XP Level</p>
                 <p className="text-xl font-bold text-purple-400">Lv. 12</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                 <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Badges</p>
                 <p className="text-xl font-bold text-pink-400">24</p>
              </div>
           </div>
        </div>

        <div className="glass p-6 space-y-6">
           <h3 className="font-bold flex items-center gap-2">
              <Smile size={18} className="text-yellow-400" />
              Status Pasangan
           </h3>
           
           <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5">
                 <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center text-xl">😊</div>
                 <div>
                    <p className="text-sm font-bold">{partnerName}</p>
                    <p className="text-xs text-white/40 italic">"Feeling energetic today!"</p>
                 </div>
              </div>
              <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 opacity-50">
                 <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-xl">☕</div>
                 <div>
                    <p className="text-sm font-bold">{user?.name}</p>
                    <p className="text-xs text-white/40 italic">"Focus mode on..."</p>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="lg:col-span-2 glass flex flex-col overflow-hidden relative border-purple-500/10">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-500/20 rounded-full flex items-center justify-center font-bold text-pink-400">
              {partnerName[0]}
            </div>
            <div>
              <h3 className="font-bold">{partnerName}</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <MoreVertical size={20} className="text-white/40" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === user?.name ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] space-y-1 ${msg.sender === user?.name ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl ${
                  msg.sender === user?.name 
                  ? 'gradient-bg text-white rounded-tr-none shadow-lg shadow-purple-500/20' 
                  : 'glass rounded-tl-none border-white/10'
                }`}>
                  <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                </div>
                <p className="text-[10px] text-white/20 font-bold px-1">{msg.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reactions */}
        <div className="px-6 pb-2">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {reactions.map((r) => (
              <button 
                key={r.label}
                className="px-4 py-2 glass glass-hover text-sm whitespace-nowrap flex items-center gap-2 border-white/5"
              >
                <span>{r.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSendMessage} className="p-6 pt-2">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Kirim pesan ke ${partnerName}...`}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 pr-14 focus:outline-none focus:border-purple-500 transition-all"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 gradient-bg rounded-xl flex items-center justify-center text-white hover:scale-105 transition-transform"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CouplePage;
