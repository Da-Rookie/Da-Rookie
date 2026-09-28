import { useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { profile } from '@/data/profile';

export default function HeroV2() {
  const ref = useRef<HTMLElement | null>(null);
  const [point, setPoint] = useState({ x: 62, y: 46 });
  const [dragging, setDragging] = useState(false);

  const updatePoint = (clientX: number, clientY: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPoint({
      x: Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)),
    });
  };

  return (
    <section
      id="home"
      ref={ref}
      className={`hero-v2 ${dragging ? 'is-dragging' : ''}`}
      onPointerMove={(event: ReactPointerEvent<HTMLElement>) => updatePoint(event.clientX, event.clientY)}
      onPointerDown={(event: ReactPointerEvent<HTMLElement>) => {
        setDragging(true);
        event.currentTarget.setPointerCapture?.(event.pointerId);
        updatePoint(event.clientX, event.clientY);
      }}
      onPointerUp={(event: ReactPointerEvent<HTMLElement>) => {
        setDragging(false);
        event.currentTarget.releasePointerCapture?.(event.pointerId);
      }}
      onPointerCancel={() => setDragging(false)}
      style={{ '--mx': `${point.x}%`, '--my': `${point.y}%` } as CSSProperties}
      aria-label="Portfolio introduction"
    >
      <div className="hero-topline">
        <a href="#home" className="brand-lockup" aria-label="Eko Prasetyo Pratomo home">
          <span className="brand-monogram">P</span>
          <span className="brand-word">PRASETYO</span>
        </a>
        <div className="hero-status"><span /> Jakarta · Indonesia</div>
      </div>

      <div className="hero-copy-layer hero-copy-base" aria-hidden="true"><HeroWords /></div>

      <div className="hero-reveal" aria-hidden="true">
        <img className="hero-asset hero-orb" src="/hero/metal-orb.svg" alt="" draggable={false} />
        <img className="hero-asset hero-ribbon" src="/hero/metal-ribbon.svg" alt="" draggable={false} />
        <img className="hero-asset hero-forest" src="/hero/forest-orb.svg" alt="" draggable={false} />
        <div className="hero-copy-layer hero-copy-invert"><HeroWords /></div>
      </div>

      <div className="hero-content">
        <div className="hero-kicker">Full-Stack Developer · AI Engineer · Product & Technology</div>
        <h1 className="sr-only">{profile.tagline}</h1>
        <p>{profile.description}</p>
        <div className="hero-actions">
          <a href="#projects" className="hero-link primary">Explore selected work <ArrowDownRight size={16} /></a>
          <a href="#contact" className="hero-link">Start a conversation <ArrowUpRight size={16} /></a>
        </div>
      </div>

      <div className="hero-hint"><span className="hero-hint-dot" /><span>Hover / drag to reveal</span></div>
    </section>
  );
}

function HeroWords() {
  return <div className="hero-words"><div>BUILD</div><div>AUTOMATE</div><div>LEAD</div></div>;
}
