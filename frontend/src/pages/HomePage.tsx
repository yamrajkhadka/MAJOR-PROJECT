import { useState } from "react";

import FeatureCard from "../components/ui/Card";
import { ToggleCard } from "../components/ui/Card";

import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/layout/HeroSection";

//icons
import { PiLightningBold } from "react-icons/pi";
import { MdMobileFriendly } from "react-icons/md";
import { HiFlag } from "react-icons/hi";


export default function LegalGPTHome() {
  const [showLimitations, setShowLimitations] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);

  return (<>
      <Navbar />
    <HeroSection />
    <div className="w-full bg-primary-dark">
      {/* OBJECTIVES / INTRODUCTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-white mb-6">
          Introduction LegalGPT
        </h1>

        <p className="text-text leading-relaxed text-lg">
          LegalGPT aims to make Nepal’s legal system easier to understand for everyone. 
          Many citizens struggle with complex legal language, outdated documents, or 
          a lack of accessible explanations. LegalGPT bridges this gap by offering 
          simplified AI-generated summaries and explanations based on public legal 
          information.  
        </p>

        <p className="text-text leading-relaxed text-lg mt-4">
          It is built to assist students, researchers, individuals, and professionals 
          by turning legal jargon into everyday language while promoting legal literacy 
          across Nepal.
        </p>
      </section>

           {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            title="Instant Legal Answers"
            icon={PiLightningBold}
            text="Ask anything about Nepali laws and get clear explanations within seconds."
          />
          <FeatureCard 
            title="Nepal-Focused"
            icon={HiFlag}
            text="Trained on public legal documents including the Muluki Ain and related legal codes."
          />
          <FeatureCard 
            title="Beginner-Friendly"
            icon={MdMobileFriendly}
            text="Designed for citizens, students, and professionals with simplified clarity."
          />
        </div>
      </section>

      {/* LIMITATIONS (TOGGLE) */}
      <section className="max-w-6xl mx-auto px-6 py-16">
         <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
      <div className=" mx-auto px-6 py-6">
        <ToggleCard
          title="What are the Limitations of LegalGPT?"
          isOpen={showLimitations}
          onToggle={() => setShowLimitations(!showLimitations)}
        >
          <ul className="list-disc ml-6 space-y-2 text-text">
            <li>Not a substitute for consultation with a licensed lawyer.</li>
            <li>Responses may not always be 100% accurate or up-to-date.</li>
            <li>Does not draft legal documents or provide legal representation.</li>
            <li>Responses are derived from available public legal sources only.</li>
          </ul>
        </ToggleCard>
      </div>

      {/* HOW TO USE (TOGGLE) */}
      <div className=" mx-auto px-6 pb-20">
        <ToggleCard
          title="How to Use LegalGPT?"
          isOpen={showHowToUse}
          onToggle={() => setShowHowToUse(!showHowToUse)}
        >
          <ol className="list-decimal ml-6 space-y-2 text-text">
            <li>Go to the LegalGPT chat interface.</li>
            <li>Ask your legal question clearly and include context if needed.</li>
            <li>Read the explanation provided by the AI.</li>
            <li>Ask follow-up questions to clarify details.</li>
          </ol>
        </ToggleCard>
      </div>
      </section>

    </div>
    </>
  );
}
