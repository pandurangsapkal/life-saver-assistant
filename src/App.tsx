/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Heart, Info, CheckCircle, Droplets, Send, Search, MapPin, Loader2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateResponse } from './services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Camp {
  city: string;
  location: string;
  date: string;
}

const STATIC_CAMPS: Camp[] = [
  { city: 'Mumbai', location: 'St. George Hospital', date: 'March 20, 2026' },
  { city: 'Mumbai', location: 'Andheri West Metro Station', date: 'March 22, 2026' },
  { city: 'Delhi', location: 'Red Cross Society, Main Road', date: 'March 21, 2026' },
  { city: 'Delhi', location: 'AIIMS Blood Bank', date: 'March 25, 2026' },
  { city: 'Bangalore', location: 'Victoria Hospital', date: 'March 18, 2026' },
  { city: 'Pune', location: 'Sassoon Hospital', date: 'March 24, 2026' },
  { city: 'Hyderabad', location: 'Osmania General Hospital', date: 'March 26, 2026' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your Life-Saver Assistant. Ready to make a difference today? How can I help you with blood donation?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [filteredCamps, setFilteredCamps] = useState<Camp[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const response = await generateResponse(messageText);
    const assistantMessage: Message = { role: 'assistant', content: response };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citySearch.trim()) {
      setFilteredCamps([]);
      return;
    }
    const results = STATIC_CAMPS.filter(camp => 
      camp.city.toLowerCase().includes(citySearch.toLowerCase())
    );
    setFilteredCamps(results);
  };

  const quickActions = [
    { name: 'Check Eligibility', prompt: 'Main blood donate kar sakta hoon ya nahi? Mujhse sawal pucho.' },
    { name: 'Why Donate?', prompt: 'Blood donate karne ke 3 bade fayde aur importance batao.' },
    { name: 'Preparation Tips', prompt: 'Camp aane se pehle mujhe kya khana-peena chahiye?' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-stone-900">
      {/* Hero Section */}
      <header className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-[#8B0000]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="inline-block mb-6"
          >
            <Heart size={80} className="text-white fill-white" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Donate Blood, Save Life
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto font-light">
            Your 15 minutes can give someone a lifetime. Join the movement and become a hero today.
          </p>
        </motion.div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Info & Search */}
        <div className="lg:col-span-1 space-y-12">
          {/* Quick Actions */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Info className="text-[#8B0000]" /> Quick Actions
            </h2>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  onClick={() => handleSend(action.prompt)}
                  className="w-full text-left p-4 rounded-xl border border-stone-200 hover:border-[#8B0000] hover:bg-red-50 transition-all group flex justify-between items-center"
                >
                  <span className="font-medium">{action.name}</span>
                  <CheckCircle size={18} className="text-stone-300 group-hover:text-[#8B0000]" />
                </button>
              ))}
            </div>
          </section>

          {/* Camp Search */}
          <section className="p-8 rounded-2xl bg-stone-50 border border-stone-100">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-[#8B0000]" /> Find a Camp
            </h2>
            <form onSubmit={handleCitySearch} className="relative mb-6">
              <input
                type="text"
                placeholder="Enter your city (e.g. Mumbai)"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#8B0000] focus:border-transparent"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            </form>

            <div className="space-y-4">
              {filteredCamps.length > 0 ? (
                filteredCamps.map((camp, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i}
                    className="p-4 bg-white rounded-xl shadow-sm border border-stone-100"
                  >
                    <div className="font-bold text-[#8B0000]">{camp.location}</div>
                    <div className="text-sm text-stone-500">{camp.city} • {camp.date}</div>
                  </motion.div>
                ))
              ) : citySearch && (
                <p className="text-sm text-stone-500 italic">No camps found in "{citySearch}". Try Mumbai, Delhi, or Pune.</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: AI Assistant Chat */}
        <div className="lg:col-span-2 flex flex-col h-[700px] rounded-3xl border border-stone-200 shadow-2xl overflow-hidden bg-white">
          <div className="bg-[#8B0000] p-6 text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <MessageSquare size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Life-Saver Assistant</h3>
              <p className="text-xs text-red-200">Online • Always here to help</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50">
            <AnimatePresence initial={false}>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#8B0000] text-white rounded-tr-none'
                        : 'bg-white text-stone-800 border border-stone-100 rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl border border-stone-100 flex items-center gap-2">
                  <Loader2 className="animate-spin text-[#8B0000]" size={18} />
                  <span className="text-sm text-stone-500 italic">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white border-t border-stone-100">
            <div className="relative flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about eligibility, pain, or safety..."
                className="flex-1 pl-4 pr-12 py-4 rounded-2xl bg-stone-100 border-none focus:ring-2 focus:ring-[#8B0000] text-sm"
              />
              <button
                onClick={() => handleSend()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 p-2 bg-[#8B0000] text-white rounded-xl hover:bg-red-800 disabled:opacity-50 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="mt-3 text-[10px] text-center text-stone-400 uppercase tracking-widest">
              Every drop counts • Powered by Gemini
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-12 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Droplets className="mx-auto mb-6 text-[#8B0000]" size={40} />
          <h2 className="text-2xl font-bold mb-4">Be the reason for someone's heartbeat.</h2>
          <p className="text-stone-400 max-w-md mx-auto mb-8">
            Blood donation is a noble cause. Join us in our mission to ensure no one suffers due to blood shortage.
          </p>
          <div className="flex justify-center gap-8 text-sm text-stone-500">
            <span>© 2026 Blood Donation Camp</span>
            <span>Privacy Policy</span>
            <span>Contact Us</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
