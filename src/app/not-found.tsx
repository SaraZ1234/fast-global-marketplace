import Link from "next/link";
import { PrimaryButton } from "@/components/UI";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x bg-paper py-16 sm:py-24 md:py-32 text-center">
      <span className="font-mono text-[11px] sm:text-xs tracking-widest2 text-smoke uppercase">
        Error 404
      </span>
      <h1 className="mt-4 sm:mt-5 font-display font-bold text-[clamp(2.25rem,10vw,4.5rem)] leading-[0.95] tracking-tightest break-words">
        Page not found.
      </h1>
      <p className="mt-5 sm:mt-6 text-ash text-sm sm:text-base max-w-xs sm:max-w-md mx-auto leading-relaxed">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-7 sm:mt-9 flex justify-center">
        <PrimaryButton href="/" icon={ArrowRight}>
          Back to Home
        </PrimaryButton>
      </div>
    </section>
  );
}