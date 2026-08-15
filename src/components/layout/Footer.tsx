import { profile } from "@/data/profile";

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer
      role="contentinfo"
      className="border-t border-[#152A38]/10 mt-0 py-12 bg-[#D6CFB9]/20"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-display font-bold text-lg text-[#152A38] tracking-tight mb-2">
              {profile.name.toUpperCase()}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {profile.titles.map((t) => (
                <span key={t} className="text-sm text-[#4A5B52]">
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-[#4A5B52]">{profile.location}</p>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <button
              onClick={scrollTop}
              className="font-mono text-xs tracking-widest uppercase text-[#4A5B52] hover:text-[#2F5241] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F5241] rounded"
              aria-label="Back to top"
            >
              Back to top ↑
            </button>
            <p className="text-sm text-[#4A5B52]">
              © 2026 Eko Prasetyo Pratomo
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
