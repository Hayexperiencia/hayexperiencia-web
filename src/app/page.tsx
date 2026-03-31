import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import ProjectsPreview from "@/components/home/ProjectsPreview";
import WhyUs from "@/components/home/WhyUs";
import Link from "next/link";

export const revalidate = 86400;

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedProperties />
      <ProjectsPreview />
      <WhyUs />

      {/* CTA final */}
      <section className="py-20 bg-[var(--color-primary)]">
        <div className="mx-auto max-w-3xl text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Listo para dar el paso?
          </h2>
          <p className="mt-4 text-gray-300 text-lg">Te acompanamos a encontrar tu proximo hogar o inversion.</p>
          <Link
            href="/contacto"
            className="mt-8 inline-flex items-center px-8 py-3.5 rounded-lg bg-[var(--color-accent)] text-[var(--color-primary)] font-semibold hover:bg-[var(--color-accent-light)] transition-colors duration-200"
          >
            Contactanos
          </Link>
        </div>
      </section>
    </>
  );
}
