interface SectionHeaderProps {
  label: string;
  title?: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  className = "",
  align = "left",
}: SectionHeaderProps) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <p className="section-label mb-4">{label}</p>
      {title && (
        <h2
          className="font-display text-3xl font-bold leading-tight tracking-tight text-[#152A38] sm:text-4xl"
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 text-[#4A5B52] leading-relaxed max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
