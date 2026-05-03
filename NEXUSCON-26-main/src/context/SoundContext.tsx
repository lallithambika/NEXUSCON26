import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playHover: () => void;
  playClick: () => void;
  playTransition: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nexus-sound-enabled') !== 'false';
    }
    return true;
  });

  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    localStorage.setItem('nexus-sound-enabled', String(newState));
  };

  // Sound URLs - You can replace these with your own hosted files
  // For now using reliable public placeholders
  const sounds = {
    hover: 'https://raw.githubusercontent.com/PiyushYadav01/audio-assets/main/hover.mp3',
    click: 'https://raw.githubusercontent.com/PiyushYadav01/audio-assets/main/click.mp3',
    transition: 'https://raw.githubusercontent.com/PiyushYadav01/audio-assets/main/whoosh.mp3'
  };

  const playSound = useCallback((url: string, volume: number = 0.5) => {
    if (!isSoundEnabled) return;
    try {
      const audio = new Audio(url);
      audio.volume = volume;
      audio.play().catch(() => {
        // Silently catch autoplay restrictions
      });
    } catch (e) {
      console.warn('Audio playback failed', e);
    }
  }, [isSoundEnabled]);

  const playHover = () => playSound(sounds.hover, 0.15);
  const playClick = () => playSound(sounds.click, 0.4);
  const playTransition = () => playSound(sounds.transition, 0.3);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, playHover, playClick, playTransition }}>
      {children}
    </SoundContext.Provider>
  );
};
