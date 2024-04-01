'use client'
import { useEffect, useRef, useState } from 'react'
import { Howl } from 'howler'
import { playlist } from '../data'

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const [songIndex, setSongIndex] = useState<number>(0)

  const [seek, setSeek] = useState<number>(0)
  const [elapsedTime, setElapsedTime] = useState<string>('00:00')

  const [volume, setVolume] = useState<number>(0.5)
  const [volumeBeforeMute, setVolumeBeforeMute] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)

  const sound = useRef<Howl | null>(null)

  useEffect(() => {

    function initializeHowler() {
      sound.current = new Howl({
        preload: 'metadata',
        autoplay: isPlaying,
        src: [playlist[songIndex].url],
        volume: 0.5,
        onend: () => {
          handleNextSong()
        }
      });

      if (isPlaying) {
        sound.current?.seek(seek);
      }
    }
    initializeHowler();

    return () => {
      sound.current?.unload();
    };
  }, [seek, songIndex, isPlaying]);

  useEffect(() => {
    if (!isMuted) {
      sound.current?.volume(volume)
    } else {
      sound.current?.volume(0)
    }
  }, [volume, isMuted])

  useEffect(() => {
  if (isPlaying) {
    const interval = setInterval(() => {
      const seconds = Math.floor(sound.current?.seek() as number);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      setElapsedTime(`${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`);
    }, 1000);
    return () => clearInterval(interval);
  }
}, [isPlaying]);

  function handlePlayPause() {
    if (!isPlaying) {
      sound.current?.play()
      setIsPlaying(true)
    } else {
      sound.current?.pause()
      setIsPlaying(false)
      setSeek(sound.current?.seek() as number)
    }
  }

  function handleNextSong() {
    setSongIndex((prevIndex) =>
      prevIndex === playlist.length - 1 ? 0 : prevIndex + 1
    );
    setIsPlaying(true);
    setSeek(0)
  }

  function handlePrevSong() {
    setSongIndex((prevIndex) =>
      prevIndex === 0 ? playlist.length - 1 : prevIndex - 1
    );
    setIsPlaying(true);
    setSeek(0);
  }

  function handleVolumeChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.preventDefault()
    const newVolume = parseFloat(event.target.value)
    setVolume(newVolume)
    setVolumeBeforeMute(newVolume)
    sound.current?.volume(newVolume)
  }

  function toggleMute() {
    if (!isMuted) {
      setVolumeBeforeMute(volume)
      setVolume(0)
    } else {
      setVolume(volumeBeforeMute)
    }
    setIsMuted((prevIsMuted) => !prevIsMuted)
  }

  const currentSong = playlist[songIndex]

  return {
    elapsedTime,
    isPlaying,
    volume,
    handlePlayPause,
    handleNextSong,
    handlePrevSong,
    handleVolumeChange,
    toggleMute,
    currentSong
  }
}
