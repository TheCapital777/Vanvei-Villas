import { notFound } from "next/navigation";
import { APARTMENTS } from "@/lib/constants/apartments";
import ApartmentDetail from "./ApartmentDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return APARTMENTS.map((apt) => ({
    slug: apt.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const apartment = APARTMENTS.find((a) => a.slug === slug);

  if (!apartment) return { title: "Not Found" };

  return {
    title: `${apartment.name} — Vanvei Villas`,
    description: apartment.description,
  };
}

export default async function ApartmentPage({ params }: PageProps) {
  const { slug } = await params;
  const apartment = APARTMENTS.find((a) => a.slug === slug);

  if (!apartment) notFound();

  return <ApartmentDetail apartment={apartment} />;
}
