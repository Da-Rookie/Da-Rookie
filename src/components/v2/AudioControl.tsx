import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const STORAGE_KEY = 'heritage-v2-sound';

type AmbientRig = {
  context: AudioContext;
  oscillator: OscillatorNode;
  overtone: OscillatorNode;
  master: GainNode;
};

function makeRig(): AmbientRig {
  const context = new AudioContext();
  const master = context.createGain();
  const filter = context.createBiquadFilter();
  const oscillator = context.createOscillator();
  const overtone = context.createOscillator();
  const baseGain = context.createGain();
  const overtoneGain = context.createGain();

  master.gain.value = 0;
  filter.type = 'lowpass';
  filter.frequency.value = 720;
  filter.Q.value = 0.25;

  oscillator.type = 'sine';
  oscillator.frequency.value = 65.406;
  baseGain.gain.value = 0.68;

  overtone.type = 'sine';
  overtone.frequency.value = 98;
  overtone.detune.value = -4;
  overtoneGain.gain.value = 0.28;

  oscillator.connect(baseGain);
  overtone.connect(overtoneGain);
  baseGain.connect(master);
  overtoneGain.connect(master);
  master.connect(filter);
  filter.connect(context.destination);

  oscillator.start();
  overtone.start();

  return { context, oscillator, overtone, master };
}

export default function AudioControl() {
  const rigRef = useRef<AmbientRig | null>(null);
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  });
  const [blocked, setBlocked] = useState(false);

  const fadeTo = async (target: number) => {
    try {
      if (!rigRef.current) rigRef.current = makeRig();
      const rig = rigRef.current;
      if (target > 0) await rig.context.resume();
      const now = rig.context.currentTime;
      rig.master.gain.cancelScheduledValues(now);
      rig.master.gain.setValueAtTime(rig.master.gain.value, now);
      rig.master.gain.linearRampToValueAtTime(target, now + (target > 0 ? 1.6 : 0.55));
      setBlocked(false);
    } catch {
      if (target > 0) setBlocked(true);
    }
  };

  useEffect(() => {
    const unlock = () => {
      if (enabled) void fadeTo(0.045);
    };

    if (enabled) void fadeTo(0.045);
    window.addEventListener('pointerdown', unlock, { passive: true, once: true });
    window.addEventListener('keydown', unlock, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      const rig = rigRef.current;
      if (rig) {
        try { rig.oscillator.stop(); } catch { /* already stopped */ }
        try { rig.overtone.stop(); } catch { /* already stopped */ }
        void rig.context.close();
      }
      rigRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    if (enabled) void fadeTo(0.045);
    else {
      void fadeTo(0);
      setBlocked(false);
    }
  }, [enabled]);

  return (
    <button
      type="button"
      className="audio-control"
      onClick={() => setEnabled((value) => !value)}
      aria-label={enabled ? 'Mute ambient sound' : 'Enable ambient sound'}
      title={blocked && enabled ? 'Tap once to enable sound' : enabled ? 'Sound on' : 'Sound off'}
    >
      <span className={`audio-pulse ${enabled && !blocked ? 'is-playing' : ''}`} />
      {enabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span>{enabled ? (blocked ? 'Tap for sound' : 'Sound on') : 'Sound off'}</span>
    </button>
  );
}
