"use client";

import { useState } from "react";
import Header from "@/components/landing/Header";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import TermsModal from "@/components/landing/TermsModal";
import PrivacyModal from "@/components/landing/PrivacyModal";

/**
 * The main landing page for Specora.
 */
export default function Home() {
  const [activeModal, setActiveModal] = useState(null); // 'terms' | 'privacy' | null

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white text-slate-600">
      <Header />

      <main className="flex-1">
        <Hero />
        <Stats />
        <Features />
      </main>

      <Footer setActiveModal={setActiveModal} />

      {/* Modals */}
      <TermsModal
        isOpen={activeModal === "terms"}
        onClose={() => setActiveModal(null)}
      />
      <PrivacyModal
        isOpen={activeModal === "privacy"}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
