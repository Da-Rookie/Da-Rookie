import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle } from "lucide-react";
import type { EmeraldEngine, Phase, WorldSnapshot, RenderTelemetry } from "./engine";
import { places, type Quality, type PlaceId } from "./topology";
interface Props {
  quality: Quality;
  reduced: boolean;
  paused: boolean;
  onPhase: (p: Phase) => void;
  onNear: (id: PlaceId | null) => void;
  onVisit: (id: PlaceId) => void;
  onPlace: (id: PlaceId) => void;
  onMap: () => void;
  onError: () => void;
  onReady: (ready: boolean) => void;
  engineRef: React.MutableRefObject<EmeraldEngine | null>;
}
export function World({
  quality,
  reduced,
  paused,
  onPhase,
  onNear,
  onVisit,
  onPlace,
  onMap,
  onError,
  onReady,
  engineRef,
}: Props) {
  const snapshot = useRef<WorldSnapshot | null>(null);
  const host = useRef<HTMLDivElement>(null),
    [loading, setLoading] = useState(true),
    [telemetry, setTelemetry] = useState<RenderTelemetry | null>(null);
  const showTelemetry = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("perf");
  const callbacks = useRef({ onPhase, onNear, onVisit, onPlace, onMap, onError, onReady });
  callbacks.current = { onPhase, onNear, onVisit, onPlace, onMap, onError, onReady };
  const pauseRef = useRef(paused);
  pauseRef.current = paused;
  useEffect(() => {
    let cancelled = false;
    let instance: EmeraldEngine | undefined;
    setLoading(true);
    callbacks.current.onReady(false);
    import("./engine")
      .then(({ EmeraldEngine }) => {
        if (cancelled || !host.current) return;
        try {
          instance = new EmeraldEngine(host.current, {
            quality,
            reducedMotion: reduced,
            onPhase: (p) => {
              if (host.current) host.current.dataset.phase = p;
              callbacks.current.onPhase(p);
            },
            onNear: (id) => callbacks.current.onNear(id),
            onVisit: (id) => callbacks.current.onVisit(id),
            onError: () => callbacks.current.onError(),
            onInteract: (id) => callbacks.current.onPlace(id),
            onMap: () => callbacks.current.onMap(),
            onMetrics: showTelemetry ? sample => setTelemetry(sample) : undefined,
            onReady: () => {
              setLoading(false);
              callbacks.current.onReady(true);
            },
          });
          engineRef.current = instance;
          if (snapshot.current) instance.restore(snapshot.current);
          instance.setPaused(pauseRef.current);
        } catch (e) {
          console.error("3D initialization failed", e);
          setLoading(false);
          callbacks.current.onError();
        }
      })
      .catch(() => {
        if (!cancelled) callbacks.current.onError();
      });
    return () => {
      cancelled = true;
      if (instance) snapshot.current = instance.snapshot();
      instance?.dispose();
      if (engineRef.current === instance) engineRef.current = null;
    };
  }, [quality, reduced, engineRef]);
  useEffect(() => {
    engineRef.current?.setPaused(paused);
  }, [paused, engineRef]);
  return (
    <div className="world" ref={host}>
      <div className="world-vignette" />
      {places.map((p, i) => (
        <button
          key={p.id}
          data-place={p.id}
          className="world-marker"
          style={{ display: "none" }}
          onClick={() => onPlace(p.id)}
          aria-label={`Explore ${p.title}`}
        >
          <span className="marker-number">0{i + 1}</span>
          <span className="marker-title">
            {p.label}
            <ArrowUpRight size={12} />
          </span>
          <i />
        </button>
      ))}
      {showTelemetry && telemetry && (
        <output className="perf-telemetry" aria-label="Live 3D performance counters">
          <strong>{telemetry.fps} FPS</strong>
          <span>{telemetry.drawCalls} draws · {Math.round(telemetry.triangles / 1000)}k triangles</span>
          <small>{telemetry.quality.toUpperCase()} quality · live browser reading</small>
        </output>
      )}
      {loading && (
        <div className="world-loading" role="status">
          <LoaderCircle className="spin" size={22} />
          <span>Preparing the bay…</span>
        </div>
      )}
    </div>
  );
}
