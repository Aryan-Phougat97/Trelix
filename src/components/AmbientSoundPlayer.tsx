import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, VolumeX, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFocusMode } from "@/contexts/FocusModeContext";

// Using Web Audio API to generate ambient sound
// This creates a continuous white noise/rain-like sound without external files
export const AmbientSoundPlayer = () => {
  const { isSoundEnabled, toggleSound, isFocusMode } = useFocusMode();
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [isHovered, setIsHovered] = useState(false);

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
      startAmbientSound();
    } else {
      stopAmbientSound();
    }

    return () => {
      stopAmbientSound();
    };
  }, [isSoundEnabled, isFocusMode]);

  const startAmbientSound = () => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    // Create buffer for white noise (simulating rain/ambient sound)
    const bufferSize = audioContextRef.current.sampleRate * 2;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const output = buffer.getChannelData(0);

    // Generate pink noise (more pleasant than white noise)
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

    // Create and start source
    sourceRef.current = audioContextRef.current.createBufferSource();
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
  };

  if (!isFocusMode) return null;

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
        <Button
          onClick={toggleSound}
          size="icon"
          className={`h-16 w-16 rounded-full glass-card backdrop-blur-xl border-2 transition-all duration-300 ${
            isSoundEnabled
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
                  {isSoundEnabled ? "Ambient Sound On" : "Ambient Sound Off"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
