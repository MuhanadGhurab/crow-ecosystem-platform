interface PlatformCardProps {
  name: string;
  fullName: string;
  tagline: string;
  description: string;
}

export function PlatformCard({ name, fullName, tagline, description }: PlatformCardProps) {
  return (
    <article className="cc-bento-card group relative overflow-hidden lg:p-8">
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-violet-600/20 to-cyan-500/10 blur-2xl"
        aria-hidden
      />
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">{name}</p>
      <h3 className="mt-3 font-display text-xl font-bold text-white sm:text-2xl">{fullName}</h3>
      <p className="mt-3 text-sm font-medium italic text-teal-300/90">{tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-slate-400">{description}</p>
      <div className="mt-6 h-px w-12 bg-gradient-to-r from-cyan-400/60 to-transparent" />
    </article>
  );
}
