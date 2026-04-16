import { PROFILE } from "@/lib/projects";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-3 px-6 text-center text-xs text-text-secondary md:flex-row md:text-left">
        <p className="font-mono">
          © {new Date().getFullYear()} {PROFILE.fullName}
        </p>
        <p className="font-mono">{PROFILE.location}</p>
      </div>
    </footer>
  );
}
