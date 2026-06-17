import React, { useState, useEffect } from "react";
import { 
  LayoutGrid, 
  Layers, 
  FileSpreadsheet, 
  BarChart3, 
  Bell, 
  Plus, 
  Sparkles,
  User,
  LogOut,
  ChevronDown
} from "lucide-react";
import { Campaign, CampaignStatus } from "./types";
import { 
  INITIAL_CAMPAIGNS, 
  ALEX_PROFILE_PHOTO, 
  ANMOL_PROFILE_PHOTO 
} from "./data";
import DashboardView from "./components/DashboardView";
import CampaignsView from "./components/CampaignsView";
import TemplatesView from "./components/TemplatesView";
import AnalyticsView from "./components/AnalyticsView";

export default function App() {
  // Campaign state with localstorage persistent fallback
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem("surveycore_campaigns");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved campaigns:", e);
      }
    }
    return INITIAL_CAMPAIGNS;
  });

  // Track active navigation tab: "Dashboard" | "Builder" | "Templates" | "Analytics"
  const [activeTab, setActiveTab] = useState<string>("Dashboard");
  
  // Track currently active Campaign model inside the Builder
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign>(() => {
    return campaigns.find(c => c.status === "DRAFT") || campaigns[0];
  });

  // Persist campaigns to localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem("surveycore_campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  // Handle building from template
  const handleUseTemplate = (newCampaign: Campaign) => {
    setCampaigns([newCampaign, ...campaigns]);
    setSelectedCampaign(newCampaign);
    setActiveTab("Builder");
  };

  // Handle saving campaign in builder
  const handleSaveCampaign = (updatedCampaign: Campaign) => {
    const exists = campaigns.some(c => c.id === updatedCampaign.id);
    let revisedList: Campaign[];
    
    if (exists) {
      revisedList = campaigns.map(c => c.id === updatedCampaign.id ? updatedCampaign : c);
    } else {
      revisedList = [updatedCampaign, ...campaigns];
    }

    setCampaigns(revisedList);
    setSelectedCampaign(updatedCampaign);
    // Automatically bring them back to dashboard to view the impact instantly!
    setActiveTab("Dashboard");
  };

  // Start creating a custom blank campaign
  const handleStartCreateCustom = () => {
    const blankCamp: Campaign = {
      id: `camp_custom_${Date.now()}`,
      name: "Our Custom feedback Campaign",
      title: "How did we perform today?",
      subtitle: "Let us know details so our client success team can accelerate your growth.",
      status: "DRAFT",
      ratingType: "stars",
      targetAudience: "Premium Subscribers",
      tags: ["Fast Support", "High Quality", "Expert Team"],
      allowComments: true,
      submitButtonText: "Submit Feedback",
      responsesCount: 0,
      csatScore: null,
      modifiedAt: "Created just now",
      questions: [
        {
          id: "q_csat_blank",
          type: "CSAT",
          text: "How satisfied are you with our solution today?",
          options: []
        }
      ]
    };

    setSelectedCampaign(blankCamp);
    setActiveTab("Builder");
  };

  const handleSelectCampaign = (camp: Campaign) => {
    setSelectedCampaign(camp);
    setActiveTab("Builder");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col art-grid relative overflow-x-hidden">
      
      {/* BACKGROUND GRAPHIC LINES & NOISE FOR ARTISTIC FLAIR */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[1px] h-full bg-white/5 pointer-events-none"></div>
      
      {/* GLOBAL TOP APP BAR MODULE */}
      <header className="w-full bg-[#0E0E0E]/95 border-b border-white/10 py-4 px-6 sticky top-0 z-50 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          
          {/* Logo Brand segment - Swiss Editorial Styling */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none border border-white/20 shrink-0 flex items-center justify-center bg-white/5 group hover:border-primary transition-all duration-300">
              <span className="text-xs font-mono font-bold text-primary group-hover:scale-110 duration-200">SC</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] tracking-[0.4em] uppercase font-bold text-primary mb-0.5">THE SURVEY ARCHIVE</span>
              <span className="text-xl font-serif italic text-white tracking-tight flex items-baseline gap-2">
                SurveyCore 
                <span className="text-[9px] tracking-[0.2em] font-mono not-italic uppercase font-semibold text-white/40 bg-white/5 border border-white/10 px-1.5 py-0.5">V.02 / 2026</span>
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            
            {/* Notifications with counter bubble */}
            <button className="w-9 h-9 flex items-center justify-center rounded-none border border-white/10 hover:border-primary hover:bg-white/5 text-white/80 transition relative">
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full"></span>
            </button>

            {/* Profile badge details */}
            <div className="flex items-center gap-3 border-l border-white/10 pl-4">
              <div className="w-8 h-8 rounded-none overflow-hidden bg-white/5 border border-white/10">
                <img 
                  src={ANMOL_PROFILE_PHOTO} 
                  alt="Anmol profile" 
                  className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-mono font-bold text-white tracking-wider uppercase leading-none">Anmol Goel</p>
                <p className="text-[9px] text-white/40 tracking-widest mt-1 uppercase font-semibold">Lead Architect // CH-02</p>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* DETAILED DOUBLE-SIDED LAYOUT CORE */}
      <div className="flex-grow flex max-w-7xl mx-auto w-full relative min-h-0 z-10 px-4 md:px-6">
        
        {/* DESKTOP SIDEBAR NAVIGATION BOARD */}
        <aside className="hidden md:flex flex-col gap-6 w-56 border-r border-white/5 p-4 shrink-0 sticky top-18 h-[calc(100vh-73px)] overflow-y-auto">
          
          <div className="space-y-2 pt-2">
            <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.3em] px-3 mb-3">Workspace</p>
            
            {/* Dashboard Navigation button */}
            <button 
              onClick={() => setActiveTab("Dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-mono tracking-wider font-semibold uppercase transition-all duration-300 border ${
                activeTab === "Dashboard" 
                  ? "bg-primary text-white border-primary shadow-[2px_2px_0px_rgba(255,255,255,0.1)] font-bold" 
                  : "text-white/60 border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutGrid size={15} />
              Dashboard
            </button>

            {/* Builder button */}
            <button 
              onClick={() => setActiveTab("Builder")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-mono tracking-wider font-semibold uppercase transition-all duration-300 border ${
                activeTab === "Builder" 
                  ? "bg-primary text-white border-primary shadow-[2px_2px_0px_rgba(255,255,255,0.1)] font-bold" 
                  : "text-white/60 border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Layers size={15} />
              Campaign Builder
            </button>

            {/* Templates catalog button */}
            <button 
              onClick={() => setActiveTab("Templates")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-mono tracking-wider font-semibold uppercase transition-all duration-300 border ${
                activeTab === "Templates" 
                  ? "bg-primary text-white border-primary shadow-[2px_2px_0px_rgba(255,255,255,0.1)] font-bold" 
                  : "text-white/60 border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`}
            >
              <FileSpreadsheet size={15} />
              Templates Catalog
            </button>

            {/* Analytics button */}
            <button 
              onClick={() => setActiveTab("Analytics")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-mono tracking-wider font-semibold uppercase transition-all duration-300 border ${
                activeTab === "Analytics" 
                  ? "bg-primary text-white border-primary shadow-[2px_2px_0px_rgba(255,255,255,0.1)] font-bold" 
                  : "text-white/60 border-transparent hover:border-white/10 hover:bg-white/5 hover:text-white"
              }`}
            >
              <BarChart3 size={15} />
              Analytics
            </button>
          </div>

          <div className="mt-auto border-t border-white/5 pt-4 space-y-2">
            <div className="p-3 bg-white/2 border border-white/10 rounded-none space-y-1">
              <p className="text-[9px] font-mono uppercase tracking-[0.2em] font-semibold text-white/50">Enterprise Tenant</p>
              <p className="text-[9px] font-mono text-primary/80">ID: f0a7d969-86a4</p>
            </div>
          </div>

        </aside>

        {/* FLUID INTERMEDIATE CANVAS VIEW ROUTER */}
        <main className="flex-grow px-2 md:px-6 py-6 mb-24 md:mb-12 overflow-y-auto w-full min-w-0 z-10">
          
          {activeTab === "Dashboard" && (
            <DashboardView 
              campaigns={campaigns}
              onSelectCampaign={handleSelectCampaign}
              onNavigateToTab={setActiveTab}
              onStartCreateCustom={handleStartCreateCustom}
            />
          )}

          {activeTab === "Builder" && (
            <CampaignsView 
              camp={selectedCampaign}
              onSaveCampaign={handleSaveCampaign}
              onCancel={() => setActiveTab("Dashboard")}
            />
          )}

          {activeTab === "Templates" && (
            <TemplatesView 
              onUseTemplate={handleUseTemplate}
              onStartCreateCustom={handleStartCreateCustom}
            />
          )}

          {activeTab === "Analytics" && (
            <AnalyticsView 
              campaigns={campaigns}
            />
          )}

        </main>

      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-2 left-2 right-2 z-50 bg-[#0E0E0E]/95 border border-white/15 backdrop-blur-md shadow-2xl px-2 py-1.5 h-16 flex items-center justify-around rounded-none">
        
        {/* Dashboard Mobile tab */}
        <button 
          onClick={() => setActiveTab("Dashboard")}
          className={`flex flex-col items-center justify-center p-1.5 text-[9px] font-mono uppercase tracking-wider ${
            activeTab === "Dashboard" ? "text-primary font-bold" : "text-white/50"
          }`}
        >
          <LayoutGrid size={16} />
          <span className="mt-1">Dashboard</span>
        </button>

        {/* Builder Mobile tab */}
        <button 
          onClick={() => setActiveTab("Builder")}
          className={`flex flex-col items-center justify-center p-1.5 text-[9px] font-mono uppercase tracking-wider ${
            activeTab === "Builder" ? "text-primary font-bold" : "text-white/50"
          }`}
        >
          <Layers size={16} />
          <span className="mt-1">Builder</span>
        </button>

        {/* Templates mobile tab */}
        <button 
          onClick={() => setActiveTab("Templates")}
          className={`flex flex-col items-center justify-center p-1.5 text-[9px] font-mono uppercase tracking-wider ${
            activeTab === "Templates" ? "text-primary font-bold" : "text-white/50"
          }`}
        >
          <FileSpreadsheet size={16} />
          <span className="mt-1">Templates</span>
        </button>

        {/* Analytics mobile tab */}
        <button 
          onClick={() => setActiveTab("Analytics")}
          className={`flex flex-col items-center justify-center p-1.5 text-[9px] font-mono uppercase tracking-wider ${
            activeTab === "Analytics" ? "text-primary font-bold" : "text-white/50"
          }`}
        >
          <BarChart3 size={16} />
          <span className="mt-1">Analytics</span>
        </button>

      </nav>

    </div>
  );
}
