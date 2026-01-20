'use client';

import { useState, useRef, useEffect } from 'react';
import AIAvatar3D from '@/components/AIAvatar3D';
import { Send, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Halo! Saya AsistenAI AgriSmart, siap membantu Anda dengan pertanyaan tentang budidaya kakao, kelapa sawit, dan kelapa di Indonesia. Ada yang bisa saya bantu?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsTalking(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/ai/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ question: input })
      });

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.answer || 'Maaf, saya tidak dapat memproses pertanyaan Anda saat ini.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simulate talking animation duration
      setTimeout(() => setIsTalking(false), 2000);

      // Text-to-speech (if browser supports it and not muted)
      if (!isMuted && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(assistantMessage.content);
        utterance.lang = 'id-ID';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Maaf, terjadi kesalahan. Pastikan server backend berjalan.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTalking(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser Anda tidak mendukung speech recognition');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.continuous = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const quickQuestions = [
    'Bagaimana cara menanam kakao yang baik?',
    'Berapa jarak tanam optimal untuk kelapa sawit?',
    'Apa hama utama pada tanaman kelapa?',
    'Bagaimana cara meningkatkan produktivitas kakao?',
    'Berapa dosis pupuk untuk kelapa sawit umur 5 tahun?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-yellow-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🤖 Asisten AI Pertanian
          </h1>
          <p className="text-gray-600">
            Tanyakan apa saja tentang budidaya kakao, kelapa sawit, dan kelapa di Indonesia
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 3D Avatar Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">AgriBot</h2>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-gray-600" />
                ) : (
                  <Volume2 className="w-6 h-6 text-green-600" />
                )}
              </button>
            </div>

            <div className="h-[500px] bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg overflow-hidden">
              <AIAvatar3D isTalking={isTalking} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">Status</div>
                <div className="text-sm font-semibold text-green-700">
                  {isLoading ? 'Berpikir...' : isTalking ? 'Berbicara...' : 'Siap'}
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-xs text-gray-600">Pesan</div>
                <div className="text-sm font-semibold text-blue-700">
                  {messages.length} percakapan
                </div>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col h-[670px]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Chat</h2>

            {/* Quick Questions */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Pertanyaan cepat:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(question)}
                    className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                  >
                    {question.substring(0, 30)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.role === 'user'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className="text-xs mt-2 opacity-70">
                      {message.timestamp.toLocaleTimeString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <button
                onClick={toggleVoiceInput}
                className={`p-3 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />

              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* All Quick Questions */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Pertanyaan Populer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => setInput(question)}
                className="text-left p-3 bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg hover:from-green-100 hover:to-yellow-100 transition-colors border border-green-200"
              >
                <p className="text-sm text-gray-700">{question}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
