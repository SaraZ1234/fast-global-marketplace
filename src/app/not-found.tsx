import Link from "next/link";
import { PrimaryButton } from "@/components/UI";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <span className="font-mono text-xs tracking-widest2 text-smoke uppercase">Error 404</span>
      <h1 className="mt-5 font-display font-bold text-5xl md:text-7xl tracking-tightest">
        Page not found.
      </h1>
      <p className="mt-6 text-ash max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="mt-9 flex justify-center">
        <PrimaryButton href="/" icon={ArrowRight}>
          Back to Home
        </PrimaryButton>
      </div>
    </section>
  );
}
