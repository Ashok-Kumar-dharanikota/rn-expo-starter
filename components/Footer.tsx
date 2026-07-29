import { Logo } from "./ui/Logo";

export function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl border-t border-line px-5 py-8 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-[13px] text-content-subtle">
          <Logo size={18} />
          Expo Init AI
        </div>
        <p className="text-center text-[12.5px] text-content-faint">
          Client-side prototype · Recommendations generated locally · Not
          affiliated with Expo
        </p>
      </div>
    </footer>
  );
}
