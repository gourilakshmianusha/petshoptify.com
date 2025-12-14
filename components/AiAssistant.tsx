import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ChatMessage, Product } from '../types';
import { generateChatResponse, generateImage } from '../services/geminiService';
import { MOCK_PRODUCTS } from '../constants';

interface AiAssistantProps {
  onAddToCart: (product: Product) => void;
}

const AiAssistant: React.FC<AiAssistantProps> = ({ onAddToCart }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Woof! 🐾 I\'m Paw. I can help you find products or even paint pictures! Try asking: "I need cute images of cats and dogs".' }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen, isGeneratingImage]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Add user message
    const newMessages = [...messages, { role: 'user', text: userMsg } as ChatMessage];
    setMessages(newMessages);

    try {
      // Prepare history for API (excluding detailed product objects, just roles/text)
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await generateChatResponse(history, userMsg);
      
      let generatedImageUrl: string | undefined = undefined;
      let finalResponseText = response.text;

      // Check if image generation is requested
      if (response.imageGenerationPrompt) {
        setIsGeneratingImage(true);
        // We temporarily add the text response while generating the image
        // Actually, let's just generate the image and then add the message
        try {
          const base64Image = await generateImage(response.imageGenerationPrompt);
          if (base64Image) {
            generatedImageUrl = base64Image;
          } else {
            finalResponseText += "\n\n(I tried to paint that for you, but I ran out of virtual ink! 🎨❌)";
          }
        } catch (e) {
          finalResponseText += "\n\n(Image generation failed temporarily.)";
        }
        setIsGeneratingImage(false);
      }

      setMessages(prev => [...prev, {
        role: 'model',
        text: finalResponseText,
        recommendedProductIds: response.recommendedProductIds,
        generatedImage: generatedImageUrl
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'model',
        text: "Oops! My tail got tangled in the wires. Please try asking me again."
      }]);
      setIsGeneratingImage(false);
    } finally {
      setIsLoading(false);
    }
  };

  const getRecommendedProducts = (ids?: string[]) => {
    if (!ids) return [];
    return MOCK_PRODUCTS.filter(p => ids.includes(p.id));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-4 bg-orange-600 text-white rounded-full shadow-lg hover:bg-orange-700 hover:shadow-xl hover:scale-105 transition-all duration-300 group ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Open AI Assistant"
      >
        <Sparkles className="absolute -top-1 -right-1 text-yellow-300 w-5 h-5 animate-pulse" />
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-[400px] sm:bottom-6 sm:right-6 bg-white sm:rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right overflow-hidden ${
          isOpen ? 'h-[600px] opacity-100 scale-100' : 'h-0 opacity-0 scale-90 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-orange-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">Paw Assistant</h3>
              <p className="text-xs text-orange-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Online & Ready to help
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200' : 'bg-orange-100 text-orange-600'
              }`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              
              <div className={`max-w-[80%] space-y-2`}>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm whitespace-pre-wrap ${
                  msg.role === 'user' 
                    ? 'bg-orange-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>

                {/* Generated Image */}
                {msg.generatedImage && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm mt-2 bg-white">
                    <img 
                      src={msg.generatedImage} 
                      alt="AI Generated" 
                      className="w-full h-auto object-cover"
                    />
                    <div className="bg-slate-100 px-3 py-1.5 text-xs text-slate-500 flex items-center gap-1">
                      <Sparkles size={12} className="text-orange-500" />
                      Generated by Paw AI
                    </div>
                  </div>
                )}

                {/* Recommended Products */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide snap-x mt-2">
                    {getRecommendedProducts(msg.recommendedProductIds).map(product => (
                      <div key={product.id} className="min-w-[140px] w-[140px] bg-white p-2 rounded-xl border border-slate-200 shadow-sm snap-start">
                        <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                        <p className="text-xs font-bold text-slate-800 line-clamp-1">{product.name}</p>
                        <p className="text-xs text-orange-600 font-bold mb-2">${product.price}</p>
                        <button 
                          onClick={() => onAddToCart(product)}
                          className="w-full bg-slate-900 text-white text-[10px] py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                          Add to Cart
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {(isLoading || isGeneratingImage) && (
             <div className="flex items-start gap-3">
               <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                 <Bot size={16} />
               </div>
               <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-2">
                   {isGeneratingImage ? (
                     <>
                      <ImageIcon size={14} className="text-orange-500 animate-pulse" />
                      <span className="text-xs text-slate-500 font-medium animate-pulse">Painting a picture...</span>
                     </>
                   ) : (
                     <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                     </div>
                   )}
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for products or images..."
              className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all outline-none"
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-orange-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AiAssistant;