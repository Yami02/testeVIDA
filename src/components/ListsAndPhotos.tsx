import { siteData } from '../data';
import { useState, useMemo } from 'react';
import { Gamepad2, Dice5, Tv, Utensils, Star, Bird, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const categoryIcons: Record<string, React.ReactNode> = {
  jogos: <Gamepad2 size={18} />,
  tabuleiro: <Dice5 size={18} />,
  animes: <Tv size={18} />,
  comida: <Utensils size={18} />,
};

export default function ListsAndPhotos() {
  const [activeFilter, setActiveFilter] = useState('todos');

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(siteData.listItems.map(item => item.categoria))
    );
    return [
      { id: 'todos', label: 'Todos' },
      ...unique.map(cat => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1)
      }))
    ];
  }, []);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'todos') return siteData.listItems;
    return siteData.listItems.filter(item => item.categoria === activeFilter);
  }, [activeFilter]);

  return (
    <div className="mb-10 min-h-[300px]">
      
      {/* Content */}
      <div className="flex flex-col">
            <h2 className="text-[#c5a059] font-bold text-xl mb-4 pl-1 font-serif italic drop-shadow-md">Nossas Listas</h2>
            
            {/* Category Medallions (Baroque Filter) */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar mb-8 pb-4 px-1">
               {categories.map(cat => {
                 const isActive = activeFilter === cat.id;
                 return (
                 <button
                   key={cat.id}
                   onClick={() => setActiveFilter(cat.id)}
                   className={`shrink-0 flex items-center justify-center gap-2 px-6 py-3 text-xs font-serif font-bold rounded-full whitespace-nowrap transition-all border-2 
                     ${isActive 
                       ? 'bg-[#1c120e] text-[#f4d485] border-[#cfa968] shadow-[0_0_20px_rgba(207,169,104,0.4)] relative' 
                       : 'bg-[#0a0604] text-gray-500 border-[#3a2e28] hover:border-[#8b7355] hover:text-[#cfa968] hover:shadow-[0_0_10px_rgba(139,115,85,0.3)]'} 
                     `}
                 >
                   {isActive && (
                     <div className="absolute inset-0 -z-10 rounded-full blur-md bg-[#cfa968] opacity-20"></div>
                   )}
                   {categoryIcons[cat.id]}
                   <span className="uppercase tracking-[0.15em]">{cat.label}</span>
                 </button>
               )})}
            </div>

            {/* Grid of Custom Baroque Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <AnimatePresence>
                {filteredItems.map((item, idx) => (
                  <motion.div
                    key={`${item.categoria}-${item.titulo}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    layout
                    className="bg-[#18100d] p-7 rounded-sm border-2 border-[#8b7355] flex flex-col gap-4 group hover:border-[#cfa968] hover:shadow-[0_0_30px_rgba(207,169,104,0.15)] transition-all overflow-hidden relative"
                  >
                    {/* Baroque Pattern Background */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8b7355 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2a1124]/10 to-[#000000]/40 pointer-events-none"></div>
                    
                    {/* Corner Golden Birds */}
                    <Bird size={20} className="absolute top-2 left-2 text-[#8b7355] opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-all duration-500" />
                    <Bird size={20} className="absolute top-2 right-2 text-[#8b7355] opacity-40 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all duration-500" style={{ transform: 'scaleX(-1)' }} />
                    
                    <div className="flex justify-between items-start gap-4 mt-2 relative z-10">
                      <div className="flex items-center gap-3 flex-1 overflow-hidden">
                        <h4 className="text-[#f5e6d3] font-serif font-bold text-[22px] leading-tight truncate drop-shadow-md">
                          {item.titulo}
                        </h4>
                      </div>
                      {/* Kuromi-inspired Oval Tag */}
                      <div 
                        className="px-3.5 py-1 rounded-full border-2 shrink-0 shadow-[0_4px_10px_rgba(0,0,0,0.5)]" 
                        style={{ backgroundColor: item.corStatus, borderColor: '#cfa968' }}
                      >
                        <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] drop-shadow-md">
                          {item.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-[#aeb1b5] text-sm italic font-medium leading-relaxed relative z-10 border-l px-3" style={{ borderLeftColor: item.corStatus }}>
                      "{item.comentario}"
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#8b7355]/30 relative z-10">
                       {/* Kuromi Skull Seal */}
                       <div className="flex items-center gap-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
                          <Skull size={14} className="text-[#ff007f] drop-shadow-[0_0_5px_rgba(255,0,127,0.5)]" />
                          <span className="text-[10px] text-[#ff007f] font-bold uppercase tracking-[0.2em]">Nota</span>
                       </div>

                       {/* Rating (Gold Birds / Stars) */}
                       <div className="flex items-center gap-1">
                         <span className="text-[#cfa968] font-serif font-bold tracking-widest">{item.nota}</span>
                         {item.nota !== "-" && (
                           <Star size={14} className="text-[#cfa968] fill-[#cfa968] opacity-90 drop-shadow-[0_0_5px_rgba(207,169,104,0.5)]" />
                         )}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

      </div>
    </div>
  );
}
