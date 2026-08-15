interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "mono";
}

export default function Badge({ children, variant = "default" }: BadgeProps) {
  const base = "inline-flex items-center px-2 py-0.5 text-xs rounded-sm border transition-colors";
  const variants = {
    default: "border-[#152A38]/15 bg-[#D6CFB9]/40 text-[#152A38]",
    accent: "border-[#2F5241] bg-[#2F5241]/10 text-[#2F5241] font-medium",
    mono: "font-mono border-[#152A38]/15 bg-[#D6CFB9]/30 text-[#4A5B52]",
  };
  return <span className={`${base} ${variants[variant]}`}>{children}</span>;
}
