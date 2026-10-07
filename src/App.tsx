import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Compass,
  Map,
  Settings2,
  HelpCircle,
  X,
  Layers,
  UserRound,
  BriefcaseBusiness,
  Award,
  Mail,
  Volume2,
  VolumeX,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { World } from "./emerald/World";
import { Content, panelTitles } from "./emerald/Content";
import {
  places,
  type PanelId,
  type PlaceId,
  type Quality,
} from "./emerald/topology";
import type { EmeraldEngine, Phase } from "./emerald/engine";
import { profile } from "./data/profile";
import "./emerald/emerald.css";
function readPreference(key: string, fallback: string) {
  try {
    return localStorage.getItem(key) || fallback;
  } catch {
    return fallback;
  }
}
function savePreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* Preferences are optional. */
  }
}
const navItems = [
  { id: "works", name: "Work", icon: Layers },
  { id: "about", name: "About", icon: UserRound },
  { id: "experience", name: "Experience", icon: BriefcaseBusiness },
  { id: "recognition", name: "Recognition", icon: Award },
  { id: "contact", name: "Contact", icon: Mail },
] as const;
function routePanel(): PanelId | null {
  const path = location.pathname.split("/")[1];
  return (
    (
      {
        about: "about",
        experience: "experience",
        recognition: "recognition",
        contact: "contact",
        projects: "works",
        work: "works",
      } as Record<string, PanelId>
    )[path] ?? null
  );
}
export default function App() {
  const [phase, setPhase] = useState<Phase>("welcome"),
    [panel, setPanel] = useState<PanelId | null>(routePanel),
    [near, setNear] = useState<PlaceId | null>(null),
    [visited, setVisited] = useState<PlaceId[]>([]);
  const [quality, setQuality] = useState<Quality>(() => {
    const q = readPreference("emerald-quality", "medium");
    return ["low", "medium", "high"].includes(q) ? (q as Quality) : "medium";
  });
  const [reduced, setReduced] = useState(
    () =>
      readPreference(
        "emerald-motion",
        matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "reduced"
          : "full",
      ) === "reduced",
  );
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false),
    [sound, setSound] = useState(false),
    [returning] = useState(
      () => readPreference("emerald-visited", "") === "yes",
    );
  const engine = useRef<EmeraldEngine | null>(null),
    dialog = useRef<HTMLDialogElement>(null),
    focusReturn = useRef<HTMLElement | null>(null),
    audio = useRef<AudioContext | null>(null),
    oscillators = useRef<OscillatorNode[]>([]);
  const visit = useCallback(
    (id: PlaceId) => setVisited((v) => (v.includes(id) ? v : [...v, id])),
    [],
  );
  const open = useCallback((id: PanelId) => {
    if (!dialog.current?.open)
      focusReturn.current = document.activeElement as HTMLElement;
    setPanel(id);
    const path = ["map", "settings", "help"].includes(id)
      ? location.pathname
      : id === "works"
        ? "/projects"
        : `/${id}`;
    if (location.pathname !== path) history.pushState({}, "", path);
  }, []);
  const close = useCallback(() => {
    setPanel(null);
    if (location.pathname !== "/") history.pushState({}, "", "/");
    requestAnimationFrame(() => focusReturn.current?.focus());
  }, []);
  useEffect(() => {
    if (panel) {
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [panel]);
  useEffect(() => {
    const fn = () => setPanel(routePanel());
    window.addEventListener("popstate", fn);
    return () => window.removeEventListener("popstate", fn);
  }, []);
  useEffect(() => {
    document.title = "Emerald Bay Lab — Eko Prasetyo Pratomo";
    return () => {
      audio.current?.close();
    };
  }, []);
  useEffect(() => {
    if (!audio.current) return;
    if (panel || document.hidden) void audio.current.suspend();
    else if (sound) void audio.current.resume();
  }, [panel, sound]);
  useEffect(() => {
    const fn = () => {
      if (document.hidden) void audio.current?.suspend();
      else if (sound && !panel) void audio.current?.resume();
    };
    document.addEventListener("visibilitychange", fn);
    return () => document.removeEventListener("visibilitychange", fn);
  }, [sound, panel]);
  function start(skip = false) {
    engine.current?.start(skip);
    savePreference("emerald-visited", "yes");
  }
  function onPlace(id: PlaceId) {
    if (id === "arrival" && phase === "terminal") {
      engine.current?.activate();
      return;
    }
    const p = places.find((p) => p.id === id)!;
    visit(id);
    open(p.panel);
  }
  function travel(id: PlaceId) {
    close();
    engine.current?.travel(id);
  }
  function chooseQuality(q: Quality) {
    setQuality(q);
    savePreference("emerald-quality", q);
  }
  function chooseMotion(v: boolean) {
    setReduced(v);
    savePreference("emerald-motion", v ? "reduced" : "full");
  }
  async function toggleSound() {
    if (sound) {
      await audio.current?.suspend();
      setSound(false);
      return;
    }
    try {
      if (!audio.current) {
        const ctx = new AudioContext();
        audio.current = ctx;
        const master = ctx.createGain();
        master.gain.value = 0.025;
        master.connect(ctx.destination);
        [130.81, 196, 261.63].forEach((freq, i) => {
          const o = ctx.createOscillator(),
            g = ctx.createGain();
          o.type = "sine";
          o.frequency.value = freq;
          o.detune.value = i * 3;
          g.gain.value = 0.35;
          o.connect(g);
          g.connect(master);
          o.start();
          oscillators.current.push(o);
        });
      }
      await audio.current.resume();
      setSound(true);
    } catch {
      setSound(false);
    }
  }
  const current = places.find((p) => p.id === near);
  return (
    <div
      className={`app phase-${phase} ${failed ? "render-failed" : ""} ${reduced ? "reduced-motion" : ""}`}
    >
      <a
        className="skip-link"
        href="#portfolio-navigation"
        onClick={() => open("about")}
      >
        Skip to portfolio content
      </a>
      {!failed && (
        <World
          quality={quality}
          reduced={reduced}
          paused={!!panel}
          onPhase={setPhase}
          onNear={setNear}
          onVisit={visit}
          onPlace={onPlace}
          onError={() => setFailed(true)}
          onReady={setReady}
          engineRef={engine}
        />
      )}
      <header className="masthead">
        <button
          className="brand"
          aria-label="Emerald Bay Lab home"
          onClick={() => {
            close();
            engine.current?.resetCamera();
          }}
        >
          <span className="brand-symbol">
            e<span>↗</span>
          </span>
          <span>
            EMERALD
            <br />
            <b>BAY LAB</b>
          </span>
        </button>
        <div className="header-center">
          <span className="live-dot" /> PERSONAL WORLD · PORTFOLIO V3
        </div>
        <button className="header-contact" onClick={() => open("contact")}>
          Let’s talk <ArrowUpRight size={15} />
        </button>
      </header>
      {!failed && phase === "welcome" && (
        <main className="welcome">
          <div className="welcome-copy">
            <p className="eyebrow">
              <span className="short-line" /> WELCOME TO EMERALD BAY LAB
            </p>
            <h1>
              BUILD.
              <br />
              AUTOMATE.
              <br />
              <em>LEAD.</em>
            </h1>
            <p className="built-by">
              Built by <strong>Eko Prasetyo Pratomo.</strong>
            </p>
            <p className="welcome-identity">
              Full-Stack Developer · AI Engineer · Project Manager
            </p>
            <div className="welcome-actions">
              <button
                className="primary"
                disabled={!ready}
                onClick={() => start(returning)}
              >
                {" "}
                {returning ? "Return to the island" : "Enter the island"}{" "}
                <ArrowUpRight size={18} />
              </button>
              <button className="welcome-direct" onClick={() => open("works")}>
                Explore the work <ArrowRight size={16} />
              </button>
            </div>
          </div>
          <div className="welcome-caption">
            <span>01 — A WORLD OF POSSIBILITIES</span>
            <p>
              Technology, nature,
              <br />
              and a little curiosity.
            </p>
            <small>Arrive. Activate. Explore.</small>
          </div>
        </main>
      )}
      {phase === "arriving" && !failed && (
        <div className="cinematic" role="status">
          <div className="cinema-bar top" />
          <div className="cinema-title">
            <p className="eyebrow">WELCOME TO EMERALD BAY LAB</p>
            <h2>BUILD. AUTOMATE. LEAD.</h2>
            <p>Built by Eko Prasetyo Pratomo</p>
            <small>Full-Stack Developer · AI Engineer · Project Manager</small>
          </div>
          <button className="skip-intro" onClick={() => engine.current?.skip()}>
            Skip arrival <ArrowRight size={16} />
          </button>
          <div className="cinema-bar bottom" />
        </div>
      )}
      {(phase === "terminal" || phase === "exploring") && !failed && (
        <>
          <div className="explore-heading">
            <p className="eyebrow">
              {phase === "terminal"
                ? "ARRIVE. ACTIVATE. EXPLORE."
                : "YOUR OWN PATH THROUGH THE PRACTICE"}
            </p>
            <h2>
              {phase === "terminal"
                ? "Welcome ashore."
                : (current?.title ?? "Between places.")}
            </h2>
            <p>
              {phase === "terminal"
                ? "One touch. Bring the island to life."
                : (current?.description ??
                  "Follow the waterfront. See what catches your eye.")}
            </p>
            {phase === "terminal" && (
              <button
                className="primary"
                onClick={() => engine.current?.activate()}
              >
                Activate the island <ArrowUpRight size={17} />
              </button>
            )}
          </div>
          {phase === "exploring" && current && (
            <button className="near-action" onClick={() => onPlace(current.id)}>
              <span className="live-dot" />
              {current.id === "arrival" ? "How to explore" : current.label}
              <ChevronRight size={17} />
            </button>
          )}
          <div className="explore-hint">
            Tap a path to walk <span>·</span> Drag to look around
          </div>
        </>
      )}
      {failed && (
        <main className="fallback">
          <p className="eyebrow">EMERALD BAY LAB / READING MODE</p>
          <h1>
            BUILD.
            <br />
            AUTOMATE.
            <br />
            <em>LEAD.</em>
          </h1>
          <p>Built by {profile.name}</p>
          <p>{profile.titles.join(" · ")}</p>
          <p className="note">
            The 3D view is unavailable on this browser right now. The complete
            portfolio is ready to explore below.
          </p>
          <button className="primary" onClick={() => open("works")}>
            Explore the portfolio <ArrowUpRight size={17} />
          </button>
          <button
            className="back-link"
            onClick={() => {
              setFailed(false);
              setPhase("welcome");
            }}
          >
            Try the 3D view again
          </button>
        </main>
      )}
      <aside className="world-tools" aria-label="World controls">
        <button
          aria-label="Island map"
          title="Island map"
          onClick={() => open("map")}
        >
          <Map size={19} />
        </button>
        <button
          aria-label="Reset camera"
          title="Reset camera"
          onClick={() => engine.current?.resetCamera()}
        >
          <Compass size={19} />
        </button>
        <button
          aria-label="Graphics settings"
          title="Graphics settings"
          onClick={() => open("settings")}
        >
          <Settings2 size={19} />
          <span className="quality-indicator">{quality[0].toUpperCase()}</span>
        </button>
        <button
          aria-label={sound ? "Mute ambient sound" : "Enable ambient sound"}
          title={sound ? "Mute sound" : "Ambient sound"}
          onClick={toggleSound}
        >
          {sound ? <Volume2 size={19} /> : <VolumeX size={19} />}
        </button>
        <button
          aria-label="Controls and help"
          title="Controls and help"
          onClick={() => open("help")}
        >
          <HelpCircle size={19} />
        </button>
      </aside>
      <footer className="world-footer">
        <div className="footer-location">
          <span className="live-dot" /> JAKARTA, INDONESIA{" "}
          <span className="footer-coordinate">6.2° S / 106.8° E</span>
        </div>
        <nav
          className="portfolio-nav"
          id="portfolio-navigation"
          aria-label="Portfolio quick access"
        >
          {navItems.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => open(id)}
              aria-current={panel === id ? "page" : undefined}
            >
              <Icon size={17} />
              <span>{name}</span>
            </button>
          ))}
        </nav>
        <div className="footer-note">
          {phase === "welcome"
            ? "DESIGNED TO BE DISCOVERED"
            : `${visited.length} / 5 PLACES DISCOVERED`}
          <span>EST. IN CURIOSITY</span>
        </div>
      </footer>
      <dialog
        ref={dialog}
        className={`content-dialog ${panel === "map" ? "map-dialog" : ""}`}
        aria-labelledby="panel-title"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        {panel && (
          <div className="dialog-sheet">
            <header className="panel-header">
              <div>
                <p className="eyebrow">
                  EMERALD BAY LAB / {panel.toUpperCase()}
                </p>
                <h2 id="panel-title">{panelTitles[panel]}</h2>
              </div>
              <button
                className="close-panel"
                autoFocus
                aria-label="Close panel"
                onClick={close}
              >
                <X size={23} />
              </button>
            </header>
            <div className="panel-content">
              <Content
                key={panel}
                panel={panel}
                onPanel={open}
                onTravel={travel}
                quality={quality}
                onQuality={chooseQuality}
                visited={visited}
                reduced={reduced}
                onReduced={chooseMotion}
                initialProject={
                  location.pathname.startsWith("/projects/")
                    ? location.pathname.split("/")[2]
                    : undefined
                }
                onReplay={() => {
                  close();
                  engine.current?.start();
                }}
              />
            </div>
            <footer className="panel-footer">
              <span>BUILD · AUTOMATE · LEAD</span>
              <button onClick={close}>
                Back to the island <RotateCcw size={13} />
              </button>
            </footer>
          </div>
        )}
      </dialog>
    </div>
  );
}
