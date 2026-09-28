import { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const STORAGE_KEY = 'heritage-v2-sound';

type AmbientRig = {
  ctx: AudioContext;
  master: GainNode;
  oscillators: OscillatorNode[];
  lfos: OscillatorNode[];
};

function createAmbientRig(): AmbientRig {
  const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) throw new Error('Web Audio API unavailable');

  const ctx = new AudioContextClass();
  const master = ctx.createGain();
  const filter = ctx.createBiquadFilter();
  master.gain.value = 0;
  filter.type = 'lowpass';
  filter.frequency.value = 980;
  filter.Q.value = 0.35;
  master.connect(filter);
  filter.connect(ctx.destination);

  const tones = [65.406, 98, 130.813, 164.814];
  const oscillators: OscillatorNode[] = [];
  const lfos: OscillatorNode[] = [];

  tones.forEach((frequency, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const lfo = ctx.createOscillator();
    const lfoDepth = ctx.createGain();

    osc.type = index % 2 === 0 ? 'sine' : 'triangle';
    osc.frequency.value = frequency;
    osc.detune.value = index * 2.5 - 3;
    gain.gain.value = 0.11 / (index + 1);

    lfo.type = 'sine';
    lfo.frequency.value = 0.024 + index * 0.006;
    lfoDepth.gain.value = 0.025 / (index + 1);
    lfo.connect(lfoDepth);
    lfoDepth.connect(gain.gain);

    osc.connect(gain);
    gain.connect(master);
    osc.start();
    lfo.start();
    oscillators.push(osc);
    lfos.push(lfo);
  });

  return { ctx, master, oscillators, lfos };
}

export default function AudioControl() {
  const rigRef = useRef<AmbientRig | null>(null);
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) !== 'off';
  });
  const [blocked, setBlocked] = useState(false);

  const ensureRig = async () => {
    try {
      if (!rigRef.current) rigRef.current = createAmbientRig();
      const rig = rigRef.current;
      await rig.ctx.resume();
      const now = rig.ctx.currentTime;
      rig.master.gain.cancelScheduledValues(now);
      rig.master.gain.setValueAtTime(rig.master.gain.value, now);
      rig.master.gain.linearRampToValueAtTime(0.055, now + 1.8);
      setBlocked(false);
      return true;
    } catch {
      setBlocked(true);
      return false;
    }
  };

  const silence = () => {
    const rig = rigRef.current;
    if (!rig) return;
    const now = rig.ctx.currentTime;
    rig.master.gain.cancelScheduledValues(now);
    rig.master.gain.setValueAtTime(rig.master.gain.value, now);
    rig.master.gain.linearRampToValueAtTime(0, now + 0.7);
  };

  useEffect(() => {
    if (enabled) void ensureRig();

    const unlock = () => {
      if (enabled && rigRef.current?.ctx.state !== 'running') void ensureRig();
    };
    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      rigRef.current?.oscillators.forEach((osc) => osc.stop());
      rigRef.current?.lfos.forEach((lfo) => lfo.stop());
      void rigRef.current?.ctx.close();
      rigRef.current = null;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off');
    if (enabled) void ensureRig();
    else {
      silence();
      setBlocked(false);
    }
  }, [enabled]);

  return (
    <button
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
