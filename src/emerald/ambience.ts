/**
 * Emerald Bay ambient shoreline — procedural, original and offline.
 * No third-party audio, privacy tracking, autoplay or licensing dependencies.
 * Activated only through the visitor's explicit sound button.
 */
export function createCoastalAmbience(ctx: AudioContext) {
  const length=Math.floor(ctx.sampleRate * 7);
  const buffer=ctx.createBuffer(1,length,ctx.sampleRate);
  const channel=buffer.getChannelData(0);
  let seed=7419,brown=0;
  for(let i=0;i<length;i++){
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    const white=(seed/4294967296)*2-1;
    brown=(brown+white*.032)/1.018;
    channel[i]=Math.max(-1,Math.min(1,brown*3.3));
  }
  const master=ctx.createGain();master.gain.value=.7;master.connect(ctx.destination);
  const wash=ctx.createBufferSource();wash.buffer=buffer;wash.loop=true;
  const washLP=ctx.createBiquadFilter();washLP.type="lowpass";washLP.frequency.value=780;
  const washVol=ctx.createGain();washVol.gain.value=.025;
  wash.connect(washLP);washLP.connect(washVol);washVol.connect(master);
  const breeze=ctx.createBufferSource();breeze.buffer=buffer;breeze.loop=true;
  const breezeHP=ctx.createBiquadFilter();breezeHP.type="highpass";breezeHP.frequency.value=160;
  const breezeLP=ctx.createBiquadFilter();breezeLP.type="lowpass";breezeLP.frequency.value=2400;
  const breezeVol=ctx.createGain();breezeVol.gain.value=.008;
  breeze.connect(breezeHP);breezeHP.connect(breezeLP);breezeLP.connect(breezeVol);breezeVol.connect(master);
  const tide=ctx.createOscillator();tide.type="sine";tide.frequency.value=.17;
  const tideDepth=ctx.createGain();tideDepth.gain.value=.018;
  tide.connect(tideDepth);tideDepth.connect(washVol.gain);
  wash.start();breeze.start(0,1.6);tide.start();
  return {
    dispose() {
      for(const node of [wash,breeze,tide]){try{node.stop()}catch{/* already stopped */}node.disconnect();}
      washLP.disconnect();washVol.disconnect();breezeHP.disconnect();breezeLP.disconnect();
      breezeVol.disconnect();tideDepth.disconnect();master.disconnect();
    }
  };
}
