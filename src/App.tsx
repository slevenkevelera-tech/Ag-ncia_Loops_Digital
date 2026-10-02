/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TechShowcase } from './components/TechShowcase';
import { SearchAndMapsGroundingSection } from './components/SearchAndMapsGroundingSection';
import { TechNewsTerminal } from './components/TechNewsTerminal';
import { BiographyCop30 } from './components/BiographyCop30';
import { ClientResults } from './components/ClientResults';
import { AIAgentSimulator } from './components/AIAgentSimulator';
import { Footer } from './components/Footer';
import { CrmDashboardModal } from './components/CrmDashboardModal';
import { ProjectCalculatorModal } from './components/ProjectCalculatorModal';
import { VoiceLiveModal } from './components/VoiceLiveModal';
import { GeminiChatbotModal } from './components/GeminiChatbotModal';
import { CodexModal } from './components/CodexModal';
import { testFirestoreConnection, auth } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [isCrmOpen, setIsCrmOpen] = useState<boolean>(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isCodexOpen, setIsCodexOpen] = useState<boolean>(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    // Validate Firestore connection on boot per Firebase skill guidelines
    testFirestoreConnection();

    // Listen to Firebase Google Auth state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#060709] text-[#f1f3f7] flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
      {/* Navigation adhering to Top Bar Contract */}
      <Navbar
        onOpenCrm={() => setIsCrmOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
        isGoogleAuthenticated={!!firebaseUser}
      />

      {/* Main Content Flow */}
      <main className="flex-1">
        {/* Apple Keynote-inspired Hero Section */}
        <Hero
          onOpenCrm={() => setIsCrmOpen(true)}
          onOpenQuote={() => setIsQuoteOpen(true)}
        />

        {/* 5 Core Technical Capabilities Showcase */}
        <TechShowcase
          onOpenCrm={() => setIsCrmOpen(true)}
          onOpenQuote={() => setIsQuoteOpen(true)}
        />

        {/* Real-time Google Search & Google Maps Grounding Section */}
        <SearchAndMapsGroundingSection />

        {/* Live Tech News API Feed & Intelligence */}
        <TechNewsTerminal />

        {/* Founder Biography & COP 30 Engineering Showcase */}
        <BiographyCop30 />

        {/* Client Results & Quantified Testimonials (Revenue & Leads) */}
        <ClientResults />

        {/* Interactive Omnichannel AI Agent Simulator */}
        <AIAgentSimulator
          onOpenCrm={() => setIsCrmOpen(true)}
        />
      </main>

      {/* Quiet Minimal Footer */}
      <Footer
        onOpenCrm={() => setIsCrmOpen(true)}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onOpenCodex={() => setIsCodexOpen(true)}
      />

      {/* Administrative CRM Dashboard with Google OAuth & Social Connections */}
      <CrmDashboardModal
        isOpen={isCrmOpen}
        onClose={() => setIsCrmOpen(false)}
        isGoogleAuthenticated={!!firebaseUser}
        onToggleGoogleAuth={() => setIsCrmOpen(true)}
      />

      {/* Interactive Project Scope & Quote Calculator */}
      <ProjectCalculatorModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        onOpenCrm={() => setIsCrmOpen(true)}
      />

      {/* Real-Time Voice Conversations Modal (gemini-3.8-live) */}
      <VoiceLiveModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
      />

      {/* Multi-Turn Gemini Chatbot Modal with Search & Maps Grounding */}
      <GeminiChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpenVoice={() => {
          setIsChatOpen(false);
          setIsVoiceOpen(true);
        }}
      />

      {/* OpenAI Codex Assistant Modal - Real-time Streaming */}
      <CodexModal
        isOpen={isCodexOpen}
        onClose={() => setIsCodexOpen(false)}
      />
    </div>
  );
}
