import { useState } from 'react';
import { siteData } from '../data';
import { Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function MessageCard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-[#18100d] rounded-sm p-6 relative overflow-hidden mb-8 w-full border-2 border-[#8b7355] shadow-[0_0_20px_rgba(207,169,104,0.15)] group hover:border-[#cfa968] transition-all">
        {/* Baroque Pattern Background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8b7355 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2a1124]/40 to-transparent pointer-events-none"></div>

        <h3 className="text-[#c5a059] font-medium text-xs tracking-[0.2em] uppercase mb-3 relative z-10">Mensagem especial</h3>
        
        <p className="text-[#f5e6d3] font-serif font-bold text-2xl leading-snug mb-3 relative z-10 drop-shadow-md">
          Queria falar coisas bonitas mas sempre que falo voce trava :(.<Sparkles className="inline w-5 h-5 text-[#9b59b6] drop-shadow-[0_0_5px_rgba(155,89,182,0.8)]" />
        </p>
        
        <p className="text-[#c5a059]/60 font-serif italic text-lg line-clamp-2 mb-6 select-none relative z-10">
          Olha só 
        </p>

        <button 
          onClick={() => setIsOpen(true)}
          className="relative z-10 bg-[#0a060d] text-[#c5a059] border border-[#c5a059] font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-sm hover:bg-[#c5a059] hover:text-[#0a060d] hover:shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-all"
        >
          {siteData.terms.buttonText}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a060d]/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#1a1025] p-8 rounded-sm shadow-[0_0_50px_rgba(155,89,182,0.3)] max-w-sm w-full relative border-2 border-[#c5a059]"
            >
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-[#c5a059]/50 hover:text-[#c5a059] transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="flex justify-center mb-6 mt-2 relative">
                <Sparkles className="text-[#9b59b6] drop-shadow-[0_0_10px_rgba(155,89,182,0.8)]" size={36} />
              </div>
              
              <h3 className="text-[#e6e0f8] font-serif font-bold text-2xl text-center mb-6 drop-shadow-md">Nossa História</h3>
              
              <p className="text-[#c5a059] leading-relaxed text-center font-medium italic border-l-2 border-r-2 border-[#c5a059]/20 px-4">
                {siteData.terms.fullText}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
