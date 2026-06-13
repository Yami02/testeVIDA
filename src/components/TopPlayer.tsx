import { useState, useRef, useEffect } from 'react';
import { ChevronDown, MoreHorizontal, Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, CheckCircle2 } from 'lucide-react';

const PLAYLIST_ID = 'PL_Iqf9Vunjxp5UoyqADnCSVK9xaSl164U';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function TopPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffleMode, setIsShuffleMode] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoData, setVideoData] = useState({ title: 'Carregando playlist...', author: '', video_id: '' });
  
  const playerRef = useRef<any>(null);
  const isLoopingRef = useRef(isLooping);

  useEffect(() => {
    isLoopingRef.current = isLooping;
  }, [isLooping]);

  useEffect(() => {
    // 1. Carregar a API do YouTube de forma assíncrona
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    // 2. Inicializar o player
    function initializePlayer() {
      // Se player já existir, recria ou detroi o anterior para evitar erro do React HMR
      if (playerRef.current) {
        if (typeof playerRef.current.destroy === 'function') {
          try { playerRef.current.destroy(); } catch(e) {}
        }
      }

      const container = document.getElementById('ytplayer-container');
      if (!container) return;

      playerRef.current = new window.YT.Player(container, {
        height: '100%', 
        width: '100%',  
        playerVars: {
          listType: 'playlist',
          list: PLAYLIST_ID,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          disablekb: 1,
          fs: 0,
          rel: 0
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      });
    }

    function onPlayerReady(event: any) {
      console.log('YouTube Player Pronto');
      event.target.setVolume(100);
    }

    function onPlayerStateChange(event: any) {
      console.log('Estado atual:', event.data);
      // event.data: 1 = PLAYING, 2 = PAUSED, 0 = ENDED
      setIsPlaying(event.data === 1);

      if (event.data === 0 && isLoopingRef.current) {
        if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
          playerRef.current.seekTo(0);
          playerRef.current.playVideo();
        }
      }
      
      if (playerRef.current && typeof playerRef.current.getVideoData === 'function') {
        const data = playerRef.current.getVideoData();
        if (data && data.video_id) {
          setVideoData({
            title: data.title || 'Música',
            author: data.author || 'YouTube',
            video_id: data.video_id
          });
        }
      }
    }

    // 4. Cria o loop de sincronização da barra
    const syncInterval = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        setCurrentTime(playerRef.current.getCurrentTime() || 0);
        setDuration(playerRef.current.getDuration() || 0);
      }
    }, 500);

    return () => {
      clearInterval(syncInterval);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try { playerRef.current.destroy(); } catch (e) {}
      }
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current || typeof playerRef.current.getPlayerState !== 'function') return;

    const state = playerRef.current.getPlayerState();

    if (state === 1) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const toggleShuffle = () => {
    if (playerRef.current && typeof playerRef.current.setShuffle === 'function') {
      const newShuffleState = !isShuffleMode;
      setIsShuffleMode(newShuffleState);
      playerRef.current.setShuffle(newShuffleState);
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const nextTrack = () => {
    if (playerRef.current && typeof playerRef.current.nextVideo === 'function') {
      playerRef.current.nextVideo();
    }
  };

  const prevTrack = () => {
    if (playerRef.current && typeof playerRef.current.previousVideo === 'function') {
      playerRef.current.previousVideo();
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || typeof playerRef.current.seekTo !== 'function') return;
    const bar = e.currentTarget;
    const clickX = e.clientX - bar.getBoundingClientRect().left;
    const percent = clickX / bar.offsetWidth;
    const newTime = percent * duration;
    
    playerRef.current.seekTo(newTime, true);
    setCurrentTime(newTime);
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;
  
  const coverUrl = videoData.video_id 
    ? `https://i.ytimg.com/vi/${videoData.video_id}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop';

  return (
    <div id="isolated-music-player" className="bg-gradient-to-t from-[#0a060d] to-[#1a1025] w-full min-h-[600px] flex flex-col pt-10 px-6 pb-24 shadow-2xl relative z-10 font-sans text-[#e6e0f8] border-b border-[#c5a059]/20">
      
      {/* Pássaros Góticos (Overlay) */}
      <div className="absolute inset-x-0 top-0 h-32 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] opacity-20 pointer-events-none"></div>
      
      {/* Player do YouTube (Tamanho real cobrindo o fundo, mas invisível) */}
      <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1px', height: '1px' }}>
        <div id="ytplayer-container" style={{ width: '1px', height: '1px' }} />
      </div>

      {/* Header do Player */}
      <div className="flex justify-between items-center mb-10 mt-6 relative z-10">
        <button className="text-[#c5a059] hover:opacity-80 transition-opacity">
          <ChevronDown size={28} />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#c5a059]/70 uppercase tracking-[0.2em] mb-1 font-semibold">
            Tocando da Playlist do YouTube
          </span>
          <h2 className="text-sm font-serif font-bold tracking-wide italic text-[#e6e0f8]">
            Para minha Princessa 🖤
          </h2>
        </div>
        <button className="text-[#c5a059] hover:opacity-80 transition-opacity">
          <MoreHorizontal size={28} />
        </button>
      </div>

      {/* Capa do Álbum Estática (Com Animação e Mimikyu) */}
      <div className="w-full aspect-square bg-[#0a060d] rounded-sm shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden mb-10 object-cover border-2 border-[#c5a059]/40 relative group">
        <img 
          src={coverUrl} 
          alt={`Capa do vídeo ${videoData.title}`}
          className={`w-full h-full object-cover opacity-80 mix-blend-luminosity transition-transform duration-[10s] ease-linear ${isPlaying ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a060d] to-transparent opacity-60 pointer-events-none"></div>
        {/* Mimikyu Easter Egg */}
        <img 
          src="https://media.tenor.com/-eJ2K9-5M-EAAAAi/mimikyu-pokemon.gif" // Link da imagem do Mimikyu aqui
          alt="Mimikyu"
          className="absolute bottom-2 right-2 w-16 h-16 opacity-70 z-20 drop-shadow-lg pointer-events-none"
        />
      </div>

      {/* Informações da Música */}
      <div className="flex justify-between items-end mb-8 relative z-10">
        <div className="flex flex-col overflow-hidden pr-4">
          <h1 className="text-[#e6e0f8] text-2xl font-serif font-bold truncate mb-1 drop-shadow-md">
            {videoData.title}
          </h1>
          <p className="text-[#c5a059] text-md font-medium opacity-80 truncate">
            {videoData.author}
          </p>
        </div>
        <CheckCircle2 size={26} className="text-[#0a060d] fill-[#c5a059] drop-shadow-[0_0_8px_rgba(197,160,89,0.5)] bg-transparent rounded-full flex-shrink-0" />
      </div>

      {/* Barra de Progresso */}
      <div className="mb-8 w-full flex flex-col relative z-10">
        {/* Barra de Fundo e Preenchimento */}
        <div 
          className="w-full h-1.5 bg-black rounded-full mb-3 cursor-pointer relative border border-[#c5a059]/30"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full bg-[#c5a059] rounded-full pointer-events-none transition-all duration-100" 
            style={{ width: `${progressPercent}%` }}
          />
          {/* Bolinha do cursor (thumb) */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-[#e6e0f8] rounded-full shadow-[0_0_10px_#9b59b6] pointer-events-none transition-all duration-100 border-2 border-[#9b59b6]"
            style={{ left: `calc(${Math.max(0, progressPercent)}% - 8px)` }}
          />
        </div>
        
        {/* Tempos (Atual / Restante) */}
        <div className="flex justify-between text-xs text-[#c5a059] font-medium font-mono">
          <span>{formatTime(currentTime)}</span>
          <span className="opacity-80">-{formatTime(duration - currentTime)}</span>
        </div>
      </div>

      {/* Controles de Mídia */}
      <div className="flex items-center justify-between w-full relative z-10">
        <button 
          onClick={toggleShuffle}
          className={`transition-all ${isShuffleMode ? 'text-[#9b59b6] opacity-100 drop-shadow-[0_0_8px_rgba(155,89,182,0.8)]' : 'text-[#c5a059]/50 hover:text-[#c5a059]'}`}
        >
          <Shuffle size={24} />
        </button>
        
        <button 
          onClick={prevTrack} 
          className="text-[#e6e0f8] hover:text-[#c5a059] hover:scale-110 hover:drop-shadow-[0_0_5px_rgba(197,160,89,0.5)] transition-all"
        >
          <SkipBack size={36} fill="currentColor" />
        </button>
        
        <button 
          onClick={togglePlay}
          className="w-[72px] h-[72px] bg-[#1a1025] text-[#c5a059] border-2 border-[#c5a059] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(197,160,89,0.2)] hover:shadow-[0_0_25px_rgba(155,89,182,0.6)] hover:border-[#9b59b6] hover:text-[#e6e0f8] hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? (
            <Pause size={32} fill="currentColor" />
          ) : (
            <Play size={32} fill="currentColor" className="ml-1.5" />
          )}
        </button>

        <button 
          onClick={nextTrack}
          className="text-[#e6e0f8] hover:text-[#c5a059] hover:scale-110 hover:drop-shadow-[0_0_5px_rgba(197,160,89,0.5)] transition-all"
        >
          <SkipForward size={36} fill="currentColor" />
        </button>

        <button 
          onClick={toggleLoop}
          className={`transition-all ${isLooping ? 'text-[#9b59b6] opacity-100 drop-shadow-[0_0_8px_rgba(155,89,182,0.8)]' : 'text-[#c5a059]/50 hover:text-[#c5a059]'}`}
        >
          <Repeat size={24} />
        </button>
      </div>

    </div>
  );
}

