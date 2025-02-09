"use client"
import React, { useState, useRef, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import {
  Send,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Shield,
  Cpu,
  VolumeX,
  Volume2,
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
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const recognition = useRef<SpeechRecognition | null>(null);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  useEffect(() => {
    setTimeout(() => setPageLoaded(true), 2000);
  }, []);

  // Keep input visible by adjusting container height
  useEffect(() => {
    const adjustHeight = () => {
      if (chatContainerRef.current) {
        const container = chatContainerRef.current;
        container.style.height = `calc(100vh - ${(inputRef.current?.offsetHeight || 0) + 320}px)`;
      }
    };

    adjustHeight();
    window.addEventListener("resize", adjustHeight);
    return () => window.removeEventListener("resize", adjustHeight);
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

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
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

  const speakResponse = (text: string | undefined) => {
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
      await connect({ connector: connectors[1] });
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
            Ware AI
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#080C24] font-mono overflow-hidden perspective-1000">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0" style={{ perspective: '1000px' }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={`grid-${i}`}
              className="absolute w-full h-px bg-cyan-500/10 "
              style={{
                top: `${i * 5}%`,
                transform: `rotateX(60deg) translateZ(${Math.sin(i / 10) * 50}px)`,
              }}
            />
          ))}
          {[...Array(20)].map((_, i) => (
            <div
              key={`grid-vert-${i}`}
              className="absolute h-full w-px bg-cyan-500/10"
              style={{
                left: `${i * 5}%`,
                transform: `rotateY(60deg) translateZ(${Math.cos(i / 10) * 50}px)`,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(10)].map((_, i) => (
            <div
              key={`rain-${i}`}
              className="absolute top-0 text-cyan-500 text-xs whitespace-nowrap"
              style={{
                left: `${i * 10}%`,
                animation: `digitalRain ${5 + Math.random() * 5}s infinite linear`,
                animationDelay: `${-Math.random() * 5}s`,
              }}
            >
              {[...Array(20)].map(() => String.fromCharCode(0x30A0 + Math.random() * 96)).join('')}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#00f2fe_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-grid-pattern opacity-90" />

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
        <div className="flex justify-between items-center mb-6 transform hover:scale-102 transition-transform">
          <div className="relative">
            <div className="text-cyan-400 text-xl font-bold">
              Ware AI
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-500 to-transparent" />
            </div>
          </div>
          {isConnected}
          <button
            onClick={isConnected ? () => disconnect() : handleConnect}
            className="relative group px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 transform -skew-x-12 group-hover:skew-x-12 transition-transform" />
            <div className="relative flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <span>{isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}</span>
            </div>
          </button>
        </div>

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

        <div className="relative transform perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-3xl transform -translate-y-1 translate-x-1 blur-md" />

          <div className="relative bg-gray-900/40 rounded-3xl border border-cyan-500/30 backdrop-blur-md overflow-hidden">
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
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes digitalRain {
          from { transform: translateY(-100%); }
          to { transform: translateY(100vh); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default AIBot;