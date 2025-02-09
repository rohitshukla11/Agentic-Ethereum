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
  Wallet,
  Hexagon
} from 'lucide-react';

const AIBot = () => {
  const [isMuted, setIsMuted] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ware AI ONLINE. AWAITING YOUR COMMAND.' }
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

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!pageLoaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "IPhone AirPods MacBook Air MacBook Pro".split("");
    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0ff";
      ctx.font = "15px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const matrixInterval = setInterval(draw, 33);

    return () => clearInterval(matrixInterval);
  }, [pageLoaded]);

  if (!pageLoaded) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center space-y-4 overflow-hidden"
      >
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
    <div className="fixed inset-0 bg-[#000510] font-mono overflow-hidden">
      <canvas ref={canvasRef} className="fixed inset-0 opacity-20" />

      <div className="relative h-full max-w-7xl mx-auto p-4 z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-900/10 to-cyan-900/20" />
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            {[...Array(6)].map((_, i) => (
              <Hexagon
                key={i}
                className="absolute text-cyan-500"
                style={{
                  transform: `rotate(${i * 60}deg) translateX(2rem)`,
                  opacity: 0.2
                }}
              />
            ))}
          </div>

          <div className="flex justify-between items-center relative z-10">
            <div className="text-cyan-400 text-2xl font-bold tracking-wider">
              WARE AI
              <div className="h-0.5 bg-gradient-to-r from-cyan-500 via-cyan-400 to-transparent" />
            </div>

            <button
              onClick={isConnected ? () => disconnect() : handleConnect}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-900/50 to-blue-900/50 text-cyan-400 hover:from-cyan-800/50 hover:to-blue-800/50 transition-all group"
            >
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                <span>{isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect'}</span>
              </div>
            </button>
          </div>
        </div>

        {/* Status indicators with animated borders */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: 'iPhone 16', value: '99%', icon: Cpu },
            { label: 'AirPods', value: '85%', icon: Network },
            { label: 'MacBook Air', value: '92%', icon: Radio },
            { label: 'MacBook Pro', value: '100%', icon: Shield },
            { label: 'AirPods Pro', value: '95%', icon: Zap }
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="relative group perspective">
              <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 rounded-xl p-4 border border-cyan-500/30 transform transition-all hover:translate-z-10 hover:shadow-xl hover:shadow-cyan-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-cyan-500/10 animate-pulse" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs text-cyan-400">{label}</span>
                  </div>
                  <span className="text-cyan-400 text-sm font-bold">{value}</span>
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
              className="min-h-[calc(100vh-18rem)] overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-500/30 scrollbar-track-transparent overflow-x-hidden"
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
    </div>
  );
};

export default AIBot;