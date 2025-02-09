"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { useOnchainKit } from '@coinbase/onchainkit';
import {
  Send,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Shield,
  Activity,
  Cpu,
  Hexagon,
  Database,
  Power,
  Globe,
  VolumeX,
  Volume2,
  Command,
  Network,
  Radio,
  Zap,
  Wallet
} from 'lucide-react';

const AIBot = () => {
  const [isMuted, setIsMuted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'NEXUS-7 ONLINE. AWAITING YOUR COMMAND.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  const recognition = useRef(null);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 2000);
  }, []);

  // Keep input visible by adjusting container height
  useEffect(() => {
    const adjustHeight = () => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current;
        const scrollHeight = container.scrollHeight;
        container.style.height = `calc(100vh - ${inputRef.current?.offsetHeight + 320}px)`;
      }
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, [messages]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Speech recognition setup
  useEffect(() => {
    if (window.webkitSpeechRecognition) {
      recognition.current = new window.webkitSpeechRecognition();
      recognition.current.continuous = true;
      recognition.current.interimResults = true;

      recognition.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setInput(transcript);
      };
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('https://autonome.alt.technology/jarvis-jwyusa/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' + btoa(`jarvis:vJqoesTGbL`)
        },
        body: JSON.stringify({ message: input.trim() })
      });

      if (!response.ok) throw new Error('API call failed');

      const data = await response.json();
      const aiResponse = {
        role: 'assistant',
        content: data.response || 'I apologize, but I was unable to process your request.'
      };

      setMessages(prev => [...prev, aiResponse]);

      if (!isMuted) {
        speakResponse(aiResponse.content);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but there was an error processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakResponse = (text) => {
    if (speechSynthesis && !isMuted) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.current?.stop();
    } else {
      recognition.current?.start();
    }
    setIsListening(!isListening);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (speechSynthesis && isSpeaking) {
      speechSynthesis.cancel();
    }
  };

  const handleConnect = async () => {
    try {
      await connect({ connector: connectors[0] });
    } catch (error) {
      console.error('Connection error:', error);
    }
  };

  if (!pageLoaded) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 animate-spin-slow">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 border-2 border-cyan-500/30"
                style={{
                  transform: `rotate(${i * 60}deg)`,
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
              />
            ))}
          </div>
          <div className="text-cyan-400 text-6xl font-mono animate-pulse relative z-10 p-8">
            NEXUS-7
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#080C24] font-mono overflow-hidden perspective-1000">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00f2fe_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />

        {/* Floating Hexagons */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 transform rotate-45 border border-cyan-500/20"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${-Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="relative h-full max-w-7xl mx-auto p-4">
        {/* Enhanced Header */}
        <div className="flex justify-between items-center mb-6 transform hover:scale-102 transition-transform">
          <div className="relative">
            <div className="text-cyan-400 text-xl font-bold">
              NEXUS-7 QUANTUM INTERFACE
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
            </div>
          </div>
          <button
            onClick={isConnected ? disconnect : handleConnect}
            className="relative group px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 transform -skew-x-12 group-hover:skew-x-12 transition-transform" />
            <div className="relative flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span>{isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}</span>
            </div>
          </button>
        </div>

        {/* Enhanced System Status Dashboard */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'QUANTUM CORE', value: '99%', icon: Cpu, color: 'cyan' },
            { label: 'NEURAL SYNC', value: '85%', icon: Network, color: 'cyan' },
            { label: 'DATA STREAM', value: '92%', icon: Radio, color: 'cyan' },
            { label: 'SECURITY', value: '100%', icon: Shield, color: 'cyan' },
            { label: 'POWER', value: '95%', icon: Zap, color: 'cyan' }
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="relative group">
              <div className="absolute inset-0 bg-cyan-500/5 rounded-xl transform group-hover:scale-105 transition-transform" />
              <div className="relative bg-gray-900/40 rounded-xl p-4 border border-cyan-500/30 backdrop-blur-md hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-5 h-5 text-${color}-400`} />
                    <span className="text-xs text-cyan-400">{label}</span>
                  </div>
                  <div className="relative">
                    <span className={`text-${color}-400 text-sm`}>{value}</span>
                    <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Main Chat Interface */}
        <div className="relative transform perspective-1000">
          {/* 3D Frame Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl transform -translate-y-1 translate-x-1 blur-md" />

          <div className="relative bg-gray-900/40 rounded-3xl border border-cyan-500/30 backdrop-blur-md overflow-hidden">
            {/* Chat Container with Fixed Height */}
            <div
              ref={chatContainerRef}
              className="min-h-[calc(100vh-18rem)] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'} transform hover:scale-102 transition-transform`}
                >
                  <div className={`
                    relative max-w-[80%] p-4 rounded-2xl group
                    ${message.role === 'assistant' ? 'bg-cyan-500/10' : 'bg-blue-500/10'}
                  `}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transform -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                    <div className="flex items-start gap-3">
                      <div className={`
                        relative w-8 h-8 rounded-full flex items-center justify-center
                        ${message.role === 'assistant' ? 'bg-cyan-500/20' : 'bg-blue-500/20'}
                      `}>
                        {message.role === 'assistant' ? (
                          <Bot className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <User className="w-5 h-5 text-blue-400" />
                        )}
                        <div className="absolute inset-0 rounded-full border border-cyan-500/50 animate-ping-slow opacity-50" />
                      </div>
                      <div className="text-gray-300">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Input Area */}
            <div ref={inputRef} className="sticky bottom-0 p-4 bg-gray-900/90 border-t border-cyan-500/30">
              <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 rounded-xl blur animate-pulse" />
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="INITIATE QUANTUM COMMAND SEQUENCE..."
                  className="w-full bg-gray-800/50 text-cyan-400 rounded-xl px-6 py-4 pr-36 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transform transition-all"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className={`p-2 rounded-lg transform hover:scale-110 transition-transform ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`p-2 rounded-lg transform hover:scale-110 transition-transform ${isListening ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'}`}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transform hover:scale-110 transition-transform"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBot;