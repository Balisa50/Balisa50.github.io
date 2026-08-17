import { PROFILE } from "@/lib/projects";

export function Footer() {
  return (
    <footer className="border-t border-rule bg-background/80 py-10">
      <div className="mx-auto flex w-full max-w-shell flex-col items-center justify-between px-6 sm:px-10 gap-3 text-center text-xs text-text-secondary md:flex-row md:text-left">
        <p className="font-mono">
          © {new Date().getFullYear()} {PROFILE.fullName}
        </p>
        <p className="font-mono">{PROFILE.location}</p>
      </div>
    </footer>
  );
}
