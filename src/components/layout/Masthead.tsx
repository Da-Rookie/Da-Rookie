import { AppLink } from "@/lib/router";
export function Masthead() {
  return (
    <header className="masthead">
      <AppLink href="/" className="brand" ariaLabel="Prasetyo — Home">
        <svg viewBox="0 0 32 40" className="monogram" aria-hidden="true">
          <path
            fill="currentColor"
            d="M2 2h16c17 0 17 24 0 24h-7v12H2V2Zm9 8v8h7c6 0 6-8 0-8h-7Z"
          />
          <path fill="currentColor" opacity=".38" d="M18 30h12v8H18z" />
        </svg>
        <span>PRASETYO</span>
      </AppLink>
      <span className="masthead-location">
        JAKARTA, INDONESIA <span>BUILD · AUTOMATE · LEAD</span>
      </span>
    </header>
  );
}
