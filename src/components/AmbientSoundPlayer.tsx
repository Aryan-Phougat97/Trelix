import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Waves, Droplets, Wind, Coffee, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/contexts/FocusModeContext";

type SoundType = 'rain' | 'ocean' | 'forest' | 'coffee' | 'whitenoise';

interface SoundOption {
  id: SoundType;
  name: string;
  icon: React.ReactNode;
}

const soundOptions: SoundOption[] = [
  { id: 'rain', name: 'Rain', icon: <Droplets className="h-4 w-4" /> },
  { id: 'ocean', name: 'Ocean', icon: <Waves className="h-4 w-4" /> },
  { id: 'forest', name: 'Forest', icon: <Wind className="h-4 w-4" /> },
  { id: 'coffee', name: 'Coffee Shop', icon: <Coffee className="h-4 w-4" /> },
  { id: 'whitenoise', name: 'White Noise', icon: <Radio className="h-4 w-4" /> },
];

// Using Web Audio API to generate ambient sounds
export const AmbientSoundPlayer = () => {
  const { isSoundEnabled, toggleSound, isFocusMode } = useFocusMode();
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [selectedSound, setSelectedSound] = useState<SoundType>('rain');

  useEffect(() => {
    if (!isFocusMode) return;

    // Initialize Audio Context
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
      gainNodeRef.current.gain.value = 0.15; // Low volume for ambient sound
    }

    if (isSoundEnabled) {
      startAmbientSound(selectedSound);
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [isSoundEnabled, isFocusMode, selectedSound]);

  const generatePinkNoise = (audioContext: AudioContext, bufferSize: number) => {
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  };

  const generateBrownNoise = (audioContext: AudioContext, bufferSize: number) => {
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; // Amplify
    }
    return buffer;
  };

  const generateWhiteNoise = (audioContext: AudioContext, bufferSize: number) => {
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  };

  const generateFilteredNoise = (audioContext: AudioContext, bufferSize: number, lowFreq: number, highFreq: number) => {
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate white noise first
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    // Simple low-pass filter for ocean-like sound
    const filterStrength = 0.95;
    let lastValue = 0;
    for (let i = 0; i < bufferSize; i++) {
      output[i] = filterStrength * lastValue + (1 - filterStrength) * output[i];
      lastValue = output[i];
    }

    return buffer;
  };

  const startAmbientSound = (soundType: SoundType) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    stopAmbientSound(); // Stop any existing sound

    const audioContext = audioContextRef.current;
    const bufferSize = audioContext.sampleRate * 2;

    let buffer: AudioBuffer;

    switch (soundType) {
      case 'rain':
        buffer = generatePinkNoise(audioContext, bufferSize);
        break;
      case 'ocean':
        buffer = generateFilteredNoise(audioContext, bufferSize, 20, 200);
        // Add low frequency oscillation for wave effect
        oscillatorRef.current = audioContext.createOscillator();
        oscillatorRef.current.type = 'sine';
        oscillatorRef.current.frequency.value = 0.2; // Very slow oscillation
        const oscGain = audioContext.createGain();
        oscGain.gain.value = 0.05;
        oscillatorRef.current.connect(oscGain);
        oscGain.connect(gainNodeRef.current);
        oscillatorRef.current.start();
        break;
      case 'forest':
        buffer = generatePinkNoise(audioContext, bufferSize);
        // Reduce volume for forest ambience
        if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = 0.1;
        }
        break;
      case 'coffee':
        buffer = generateBrownNoise(audioContext, bufferSize);
        break;
      case 'whitenoise':
        buffer = generateWhiteNoise(audioContext, bufferSize);
        break;
      default:
        buffer = generatePinkNoise(audioContext, bufferSize);
    }

    // Create and start source
    sourceRef.current = audioContext.createBufferSource();
    sourceRef.current.buffer = buffer;
    sourceRef.current.loop = true;
    sourceRef.current.connect(gainNodeRef.current);
    sourceRef.current.start();
  };

  const stopAmbientSound = () => {
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    // Reset gain
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = 0.15;
    }
  };

  const handleSoundChange = (soundType: SoundType) => {
    setSelectedSound(soundType);
    setShowSoundMenu(false);
  };

  if (!isFocusMode) return null;

  const currentSoundOption = soundOptions.find(s => s.id === selectedSound);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="fixed bottom-6 left-6 z-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sound Menu */}
      <AnimatePresence>
        {showSoundMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-20 left-0 glass-card backdrop-blur-xl border rounded-xl p-2 shadow-2xl min-w-[180px]"
          >
            <div className="space-y-1">
              {soundOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleSoundChange(option.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${selectedSound === option.id
                      ? 'bg-cool-blue/20 text-cool-blue border border-cool-blue/30'
                      : 'hover:bg-foreground/5 text-foreground'
                    }`}
                >
                  {option.icon}
                  <span className="font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="relative"
        animate={{
          scale: isSoundEnabled ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 2,
          repeat: isSoundEnabled ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <div className="flex gap-2">
          {/* Sound Type Button */}
          {isSoundEnabled && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                onClick={() => setShowSoundMenu(!showSoundMenu)}
                size="icon"
                className="h-16 w-16 rounded-full glass-card backdrop-blur-xl border-2 border-cool-blue/30 bg-cool-blue/5 hover:bg-cool-blue/10 transition-all duration-300"
              >
                {currentSoundOption?.icon}
              </Button>
            </motion.div>
          )}

          {/* Main Toggle Button */}
          <Button
            onClick={toggleSound}
            size="icon"
            className={`h-16 w-16 rounded-full glass-card backdrop-blur-xl border-2 transition-all duration-300 ${isSoundEnabled
                ? "border-cool-blue/50 bg-cool-blue/10 hover:bg-cool-blue/20"
                : "hover:bg-foreground/5"
              }`}
            style={{
              boxShadow: isSoundEnabled
                ? "0 0 30px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)"
                : "0 0 20px rgba(0, 0, 0, 0.3)",
            }}
          >
            {isSoundEnabled ? (
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Volume2 className="h-6 w-6 text-cool-blue" strokeWidth={2} />
              </motion.div>
            ) : (
              <VolumeX className="h-6 w-6" strokeWidth={2} />
            )}
          </Button>
        </div>

        {/* Sound Wave Animation */}
        <AnimatePresence>
          {isSoundEnabled && (
            <motion.div
              className="absolute inset-0 rounded-full pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 rounded-full border-2 border-cool-blue/30"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 1.5 + i * 0.3, opacity: 0 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                    ease: "easeOut",
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Label on Hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 glass-card rounded-lg px-4 py-2 backdrop-blur-xl border whitespace-nowrap shadow-2xl"
            >
              <div className="flex items-center gap-2">
                <Waves className="h-3 w-3 text-cool-blue" />
                <span className="text-xs font-medium">
                  {isSoundEnabled ? `${currentSoundOption?.name} Playing` : "Ambient Sound Off"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
