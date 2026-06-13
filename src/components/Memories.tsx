import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImageOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDrivePhotos } from '../hooks/useDrivePhotos';

const FOLDER_DISPLAY = '1qyTyrwiBdC0IfgAgqkZTvBKEPyOJ2t57';
const FOLDER_JUNTOS = '1hoy1mkwSVqjzx63fILpdVOpMSpxNTyvs';
const FOLDER_ALEATORIOS = '1yHmOk6d89OUItRhpubH_17cpyihdc4vt';

export const getDriveImageUrl = (id: string) => `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;

// Algoritmo Fisher-Yates shuffle
const shuffleArray = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

// Componente para lidar com o estado de erro das imagens
function DriveImage({ id, alt, className, containerClassName = "" }: { id: string; alt: string; className: string; containerClassName?: string }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`w-full flex-1 flex flex-col items-center justify-center bg-[#1a1025] min-h-[120px] h-full ${containerClassName}`}>
        <ImageOff className="text-[#c5a059]/30 mb-2" size={24} />
        <span className="text-[#c5a059]/40 font-mono text-[10px] lowercase text-center leading-tight">erro de link<br/>ou id</span>
      </div>
    );
  }

  return (
    <img 
      src={getDriveImageUrl(id)} 
      alt={alt} 
      onError={() => setHasError(true)}
      className={className} 
      loading="lazy"
    />
  );
}

function LightboxPortal({ children }: { children: React.ReactNode }) {
  return createPortal(children, document.body);
}

function KuromiJuntosButton({
  photos, loading, onClick
}: {
  photos: string[]; loading: boolean; onClick: () => void;
}) {
  const [showBalloon, setShowBalloon] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!showBalloon || photos.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showBalloon, photos.length]);

  const visiblePhotos = photos.length > 0 ? [0, 1, 2].map(i => photos[(slideIndex + i) % photos.length]) : [];

  return (
    <div className="flex flex-col select-none w-full">
      <p className="text-[#c5a059] font-serif italic font-bold text-sm sm:text-base mb-2 text-right drop-shadow-md pr-2">
        Nós Juntos
      </p>

      <div className="flex flex-col items-end px-1">
        <img
          src="https://media1.tenor.com/m/hdVDLbT1oW4AAAAC/kuromi-cute-kuromilove.gif"
          alt="Kuromi"
          title="Ver fotinhas 💜"
          className="w-[120px] h-[120px] object-contain cursor-pointer transition-transform hover:scale-110 relative z-10 self-end"
          onClick={() => setShowBalloon(prev => !prev)}
          style={{ filter: 'drop-shadow(0 0 12px rgba(155,89,182,0.9))' }}
        />

        <AnimatePresence>
          {showBalloon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative mt-2 bg-[#1a0a2e] border-2 border-[#9b59b6] rounded-[16px] p-3 w-full max-w-full cursor-pointer shadow-[0_0_15px_rgba(155,89,182,0.5)] z-20 overflow-hidden"
              onClick={() => {
                if (!loading && photos.length > 0) onClick();
                setShowBalloon(false);
              }}
            >
              <p className="text-[#c5a059] font-serif italic text-[11px] text-center leading-none mb-2">
                fotinhas 💜
              </p>
              <div key={slideIndex} className="flex gap-2">
                {loading ? (
                  [0,1,2].map(i => (
                    <div key={i} className="flex-1 h-[80px] rounded-md bg-[#2a1124] animate-pulse border border-[#9b59b6]/30" />
                  ))
                ) : visiblePhotos.map((id, index) => (
                  <div key={index} className="flex-1 h-[80px] rounded-md border border-[#9b59b6]/50 overflow-hidden">
                    <img
                      src={`https://drive.google.com/thumbnail?id=${id}&sz=w200`}
                      alt=""
                      className="w-full h-full object-cover transition-opacity duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              {/* Triangulo apontando para cima no canto direito */}
              <div className="absolute -top-1.5 right-8 w-3 h-3 bg-[#1a0a2e] border-t-2 border-l-2 border-[#9b59b6] transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MimikyuAleatoriosButton({
  photos, loading, onClick
}: {
  photos: string[]; loading: boolean; onClick: () => void;
}) {
  const [showBalloon, setShowBalloon] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (!showBalloon || photos.length === 0) return;
    const interval = setInterval(() => {
      setSlideIndex(prev => (prev + 1) % photos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showBalloon, photos.length]);

  const visiblePhotos = photos.length > 0 ? [0, 1, 2].map(i => photos[(slideIndex + i) % photos.length]) : [];

  return (
    <div className="flex flex-col select-none w-full">
      <p className="text-[#c5a059] font-serif italic font-bold text-sm sm:text-base mb-2 text-left drop-shadow-md pl-2">
        Fotos Aleatórias
      </p>

      <div className="flex flex-col items-start px-1">
        <img
          src="https://media1.tenor.com/m/xSVOM61BLDwAAAAC/mimikyu-mudae.gif"
          alt="Mimikyu"
          title="Ver fotinhas ✨"
          className="w-[100px] h-[100px] object-contain cursor-pointer transition-transform hover:scale-110 relative z-10 self-start"
          onClick={() => setShowBalloon(prev => !prev)}
          style={{ filter: 'drop-shadow(0 0 12px rgba(197,160,89,0.9))' }}
        />

        <AnimatePresence>
          {showBalloon && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative mt-2 bg-[#1a0a2e] border-2 border-[#c5a059] rounded-[16px] p-3 w-full max-w-full cursor-pointer shadow-[0_0_15px_rgba(197,160,89,0.5)] z-20 overflow-hidden"
              onClick={() => {
                if (!loading && photos.length > 0) onClick();
                setShowBalloon(false);
              }}
            >
              <p className="text-[#c5a059] font-serif italic text-[11px] text-center leading-none mb-2">
                fotinhas ✨
              </p>
              <div key={slideIndex} className="flex gap-2">
                {loading ? (
                  [0,1,2].map(i => (
                    <div key={i} className="flex-1 h-[80px] rounded-md bg-[#2a1124] animate-pulse border border-[#c5a059]/30" />
                  ))
                ) : visiblePhotos.map((id, index) => (
                  <div key={index} className="flex-1 h-[80px] rounded-md border border-[#c5a059]/50 overflow-hidden">
                    <img
                      src={`https://drive.google.com/thumbnail?id=${id}&sz=w200`}
                      alt=""
                      className="w-full h-full object-cover transition-opacity duration-500"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
              {/* Triangulo apontando para cima no canto esquerdo */}
              <div className="absolute -top-1.5 left-8 w-3 h-3 bg-[#1a0a2e] border-t-2 border-l-2 border-[#c5a059] transform rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Memories() {
  const { photos: displayPhotos, loading: loadingDisplay } = useDrivePhotos(FOLDER_DISPLAY);
  const { photos: juntosPhotos, loading: loadingJuntos } = useDrivePhotos(FOLDER_JUNTOS);
  const { photos: aleatoriosPhotos, loading: loadingAleatorios } = useDrivePhotos(FOLDER_ALEATORIOS);

  const [lightbox, setLightbox] = useState<{ isOpen: boolean; title: string; images: string[]; currentIndex: number }>({ 
    isOpen: false, 
    title: '', 
    images: [],
    currentIndex: 0
  });

  const openGridPhoto = (index: number) => {
    setLightbox({
      isOpen: true,
      title: 'Nossas Memórias',
      images: displayPhotos,
      currentIndex: index
    });
  };

  const openAleatorios = () => {
    if (aleatoriosPhotos.length === 0) return;
    setLightbox({ 
      isOpen: true, 
      title: 'Fotos Aleatórias', 
      images: shuffleArray(aleatoriosPhotos),
      currentIndex: 0
    });
  };

  const openJuntos = () => {
    if (juntosPhotos.length === 0) return;
    setLightbox({ 
      isOpen: true, 
      title: 'Nós Juntos', 
      images: juntosPhotos,
      currentIndex: 0
    });
  };

  const closeGallery = () => {
    setLightbox(prev => ({ ...prev, isOpen: false }));
  };

  const nextPhoto = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }));
  };

  const prevPhoto = () => {
    setLightbox(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.images.length) % prev.images.length
    }));
  };

  useEffect(() => {
    if (lightbox.isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [lightbox.isOpen]);

  return (
    <div className="mb-10 w-full relative z-10 flex flex-col items-center">
      
      {/* Overlay de pássaros góticos no fundo da seção */}
      <div className="absolute inset-x-0 top-0 h-full bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none"></div>

      <div className="w-full mb-6 relative z-10">
        <h2 className="text-[#c5a059] font-bold text-xl mb-4 pl-1 font-serif italic drop-shadow-md">Nossas Memórias</h2>
        
        {/* Mural "Display" */}
        <div className="grid grid-cols-2 gap-3 w-full border border-[#c5a059]/30 rounded-sm p-3 bg-[#1a1025] shadow-[0_4px_15px_rgba(0,0,0,0.5)] relative group hover:border-[#c5a059]/60 transition-all duration-500">
           {/* Arabescos (Pattern) */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #8b7355 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
           
           {loadingDisplay && (
             <>
               <div className="flex flex-col gap-3 w-full relative z-10">
                 <div className="rounded-[2px] h-28 bg-[#c5a059]/10 animate-pulse border border-[#c5a059]/20 w-full"></div>
                 <div className="rounded-[2px] h-36 bg-[#c5a059]/10 animate-pulse border border-[#c5a059]/20 w-full"></div>
               </div>
               <div className="flex flex-col gap-3 w-full relative z-10">
                 <div className="rounded-[2px] h-36 bg-[#c5a059]/10 animate-pulse border border-[#c5a059]/20 w-full"></div>
                 <div className="rounded-[2px] h-28 bg-[#c5a059]/10 animate-pulse border border-[#c5a059]/20 w-full"></div>
               </div>
             </>
           )}

           {!loadingDisplay && displayPhotos.length === 0 && (
             <div className="col-span-2 flex items-center justify-center h-48 text-[#c5a059]/50 font-serif italic relative z-10">
                Nenhuma memória encontrada...
             </div>
           )}

           {!loadingDisplay && displayPhotos.length > 0 && (
             <>
               <div className="flex flex-col gap-3 relative z-10">
                 <div 
                   className="rounded-[2px] overflow-hidden h-28 border border-[#c5a059]/40 relative group/item cursor-pointer" 
                   onClick={() => displayPhotos[3] && openGridPhoto(3)}
                 >
                    {displayPhotos[3] && (
                      <DriveImage 
                        id={displayPhotos[3]} 
                        alt="Memória 4" 
                        className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover/item:mix-blend-normal group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500" 
                      />
                    )}
                 </div>
                 <div 
                   className="rounded-[2px] overflow-hidden h-36 border border-[#c5a059]/40 relative group/item cursor-pointer" 
                   onClick={() => displayPhotos[1] && openGridPhoto(1)}
                 >
                    {displayPhotos[1] && (
                      <DriveImage 
                        id={displayPhotos[1]} 
                        alt="Memória 2" 
                        className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover/item:mix-blend-normal group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500" 
                      />
                    )}
                 </div>
               </div>
               <div className="flex flex-col gap-3 relative z-10">
                 <div 
                   className="rounded-[2px] overflow-hidden h-36 border border-[#c5a059]/40 relative group/item cursor-pointer" 
                   onClick={() => displayPhotos[2] && openGridPhoto(2)}
                 >
                    {displayPhotos[2] && (
                      <DriveImage 
                        id={displayPhotos[2]} 
                        alt="Memória 3" 
                        className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover/item:mix-blend-normal group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500" 
                      />
                    )}
                 </div>
                 <div 
                   className="rounded-[2px] overflow-hidden h-28 border border-[#c5a059]/40 relative group/item cursor-pointer" 
                   onClick={() => displayPhotos[0] && openGridPhoto(0)}
                 >
                    {displayPhotos[0] && (
                      <DriveImage 
                        id={displayPhotos[0]} 
                        alt="Memória 1" 
                        className="w-full h-full object-cover mix-blend-luminosity opacity-80 group-hover/item:mix-blend-normal group-hover/item:opacity-100 group-hover/item:scale-105 transition-all duration-500" 
                      />
                    )}
                 </div>
               </div>
             </>
           )}
        </div>
      </div>

      {/* Gallery Buttons */}
      <div className="flex flex-col gap-6 w-full relative z-10 mt-4">
        {/* Mimikyu Aleatorios Button */}
        <MimikyuAleatoriosButton
          photos={aleatoriosPhotos}
          loading={loadingAleatorios}
          onClick={openAleatorios}
        />
        
        {/* Kuromi Juntos Button */}
        <KuromiJuntosButton
          photos={juntosPhotos}
          loading={loadingJuntos}
          onClick={openJuntos}
        />
      </div>

      {/* Modal Tela Cheia (Lightbox / Carousel) */}
      <LightboxPortal>
        <AnimatePresence>
          {lightbox.isOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ isolation: 'isolate' }}
              className="fixed inset-0 z-[9999] bg-[#0a060d] flex flex-col"
              onClick={closeGallery}
            >
              {/* Header / Close button */}
              <div 
                className="p-6 flex justify-between items-center w-full max-w-[420px] mx-auto border-b border-[#c5a059]/20 relative z-20"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-[#cfa968] font-serif italic text-2xl drop-shadow-md">
                  {lightbox.title}
                </h3>
                <button 
                  onClick={closeGallery}
                  className="w-10 h-10 rounded-full border-2 border-[#c5a059]/50 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0a060d] hover:shadow-[0_0_15px_rgba(197,160,89,0.6)] transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Carousel Area */}
              <div className="flex-1 w-full relative flex items-center justify-center p-4">
                {/* Background birds subtle */}
                <div className="absolute inset-x-0 top-0 h-64 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-10 pointer-events-none z-0"></div>

                {lightbox.images.length > 0 && (
                  <div 
                    className="relative w-full max-w-[420px] aspect-[4/5] sm:aspect-auto sm:h-[70vh] flex items-center justify-center z-10 group/carousel"
                    onClick={(e) => e.stopPropagation()}
                  >
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={lightbox.currentIndex}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full flex items-center justify-center rounded-[2px] border-2 border-[#8b7355]/40 bg-[#1a1025] shadow-[0_0_20px_rgba(155,89,182,0.2)] overflow-hidden p-1 relative"
                      >
                        <DriveImage 
                          id={lightbox.images[lightbox.currentIndex]} 
                          alt={`Galeria ${lightbox.currentIndex}`} 
                          className="w-full h-full object-contain mix-blend-normal block" 
                          containerClassName="h-full"
                        />
                        
                        {/* Count indicator */}
                        <div className="absolute bottom-3 right-3 bg-[#0a060d]/80 text-[#c5a059] text-xs font-mono px-2 py-1 rounded-sm border border-[#c5a059]/30">
                          {lightbox.currentIndex + 1} / {lightbox.images.length}
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Nav Buttons */}
                    {lightbox.images.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
                          className="absolute left-[-10px] sm:left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#c5a059]/50 bg-[#0a060d]/80 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0a060d] hover:shadow-[0_0_15px_rgba(197,160,89,0.6)] transition-all z-20"
                        >
                          <ChevronLeft size={24} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
                          className="absolute right-[-10px] sm:right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-2 border-[#c5a059]/50 bg-[#0a060d]/80 flex items-center justify-center text-[#c5a059] hover:bg-[#c5a059] hover:text-[#0a060d] hover:shadow-[0_0_15px_rgba(197,160,89,0.6)] transition-all z-20"
                        >
                          <ChevronRight size={24} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </LightboxPortal>
    </div>
  );
}
