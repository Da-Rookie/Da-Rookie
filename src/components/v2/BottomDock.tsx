import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Home, Mail, Route, UserRound } from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'projects', label: 'Projects', icon: BriefcaseBusiness },
  { id: 'about', label: 'About', icon: UserRound },
  { id: 'journey', label: 'Journey', icon: Route },
  { id: 'contact', label: 'Contact', icon: Mail },
] as const;

type NavId = (typeof items)[number]['id'];

export default function BottomDock() {
  const [active, setActive] = useState<NavId>('home');

  useEffect(() => {
    const nodes = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id as NavId);
      },
      { rootMargin: '-38% 0px -42% 0px', threshold: [0, 0.2, 0.5, 0.8] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const jump = (id: NavId) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <nav className="bottom-dock" aria-label="Primary navigation">
      {items.map(({ id, label, icon: Icon }) => {
        const selected = active === id;
        return (
          <button
            key={id}
            className={`dock-item ${selected ? 'is-active' : ''}`}
            onClick={() => jump(id)}
            aria-label={`Go to ${label}`}
            aria-current={selected ? 'page' : undefined}
          >
            <span className="dock-icon-wrap"><Icon size={17} strokeWidth={1.8} /></span>
            <span className="dock-label">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
