import { useEffect, useRef, useState, type MutableRefObject, type PointerEvent } from "react";
import { Footprints, Hand } from "lucide-react";
import type { EmeraldEngine } from "./engine";

interface Props {
  engineRef: MutableRefObject<EmeraldEngine | null>;
  active: boolean;
  available: boolean;
  onInteract: () => void;
}
/** Pointer-captured analog thumbstick. UI state is merely visual; velocity stays in the engine. */
export function GameControls({engineRef,active,available,onInteract}:Props) {
  const currentPointer = useRef<number | null>(null);
  const [knob,setKnob] = useState({x:0,y:0});
  useEffect(() => {
    if (!active) {
      currentPointer.current = null;
      engineRef.current?.setJoystick(0,0);
      engineRef.current?.setVirtualRun(false);
    }
    return () => {
      engineRef.current?.setJoystick(0,0);
      engineRef.current?.setVirtualRun(false);
    };
  },[active,engineRef]);
  function measure(e:PointerEvent<HTMLDivElement>) {
    const r=e.currentTarget.getBoundingClientRect();
    const dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2);
    const radius=Math.max(25,r.width*.36);
    const length=Math.max(1,Math.hypot(dx,dy));
    const clamp=Math.min(1,length/radius);
    const x=dx/length*clamp, y=dy/length*clamp;
    setKnob({x,y});
    engineRef.current?.setJoystick(x,-y);
  }
  function down(e:PointerEvent<HTMLDivElement>) {
    if (!active || currentPointer.current!==null) return;
    e.preventDefault();
    currentPointer.current=e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    measure(e);
  }
  function move(e:PointerEvent<HTMLDivElement>) {
    if(currentPointer.current!==e.pointerId)return;
    e.preventDefault(); measure(e);
  }
  function end(e:PointerEvent<HTMLDivElement>) {
    if(currentPointer.current!==e.pointerId)return;
    currentPointer.current=null;
    setKnob({x:0,y:0});
    engineRef.current?.setJoystick(0,0);
  }
  return <aside className="game-controls" aria-label="Character controls">
    <div className="analog-unit">
      <div className="analog-stick"
        role="group" aria-label="Move Emm: drag in any direction"
        onPointerDown={down} onPointerMove={move} onPointerUp={end}
        onPointerCancel={end} onLostPointerCapture={end}>
        <div className="analog-ring"/>
        <div className="analog-knob" style={{transform:"translate("+knob.x*35+"px,"+knob.y*35+"px)"}}/>
      </div>
      <span>MOVE</span>
    </div>
    <div className="action-unit">
      <button className="action-interact" disabled={!active || !available} onClick={onInteract}
        aria-label={available?"Interact with nearby exhibit":"Interact with island"}>
        <Hand size={20}/><span>INTERACT</span>
      </button>
      <button className="action-run" disabled={!active}
        onPointerDown={(e)=>{e.currentTarget.setPointerCapture(e.pointerId);engineRef.current?.setVirtualRun(true);}}
        onPointerUp={()=>engineRef.current?.setVirtualRun(false)}
        onPointerCancel={()=>engineRef.current?.setVirtualRun(false)}
        onLostPointerCapture={()=>engineRef.current?.setVirtualRun(false)}
        aria-label="Hold to run">
        <Footprints size={18}/><span>RUN</span>
      </button>
    </div>
  </aside>;
}
