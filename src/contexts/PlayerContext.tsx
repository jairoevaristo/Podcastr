import { createContext, ReactNode, useContext, useState } from 'react';

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isShuffling: boolean;
  isLooping: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  toggleShuffle: () => void;
  toggleLooping: () => void;
  setPlayingState: (state: boolean) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  clearPlayerState: () => void;
  playPrevious: () => void;
}

export const playerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContentProvider({ children }: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  
  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true)
  }
  
  function togglePlay() {
    setIsPlaying(!isPlaying); 
  }
  
  function toggleLooping() {
    setIsLooping(!isLooping); 
  }
  
  function toggleShuffle() {
    setIsShuffling(!isShuffling); 
  }
  
  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length

  function playNext() {  
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  
  return (
    <playerContext.Provider value={{ 
        episodeList, 
        currentEpisodeIndex, 
        play,
        isPlaying,
        hasNext, 
        hasPrevious,
        togglePlay,
        setPlayingState,
        playList,
        playNext,
        playPrevious,
        isLooping,
        toggleLooping,
        clearPlayerState,
        isShuffling,
        toggleShuffle
      }}
    >
      {children}
    </playerContext.Provider>
  )
}

export const usePlayer = () => {
  return useContext(playerContext);
}