import React, { useState } from "react";
import { 
  TrendingUp, 
  Users, 
  Star, 
  Rocket, 
  Sparkles, 
  Activity, 
  HardDrive, 
  ChevronRight, 
  Plus, 
  ArrowRight,
  FileSpreadsheet
} from "lucide-react";
import { Campaign, DashboardMetrics } from "../types";
import { ALEX_PROFILE_PHOTO } from "../data";

interface DashboardViewProps {
  campaigns: Campaign[];
  onSelectCampaign: (campaign: Campaign) => void;
  onNavigateToTab: (tab: string) => void;
  onStartCreateCustom: () => void;
}

export default function DashboardView({ 
  campaigns, 
  onSelectCampaign, 
  onNavigateToTab,
  onStartCreateCustom
}: DashboardViewProps) {
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiChannel, setAiChannel] = useState("Email");
  const [aiLoading, setAiLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [aiError, setAiError] = useState("");

  // Filter campaigns by state
  const activeCampaigns = campaigns.filter(c => c.status === "ACTIVE" || c.status === "LIVE");
  const draftCampaigns = campaigns.filter(c => c.status === "DRAFT");
  
  // Calculate total metrics dynamically
  const totalResponses = campaigns.reduce((acc, c) => acc + c.responsesCount, 0);
  
  const handleGenerateSurvey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;

    setAiLoading(true);
    setAiError("");
    setGeneratedResult(null);

    try {
      const res = await fetch("/api/generate-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: aiTopic,
          channel: aiChannel,
          surveyType: "CSAT"
        })
      });

      if (!res.ok) {
        throw new Error("Could not connect to survey generator.");
      }

      const data = await res.json();
      setGeneratedResult(data);
    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred during generation.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplyAiSurvey = () => {
    if (!generatedResult) return;
    
    // Create new campaign state
    const newCamp: Campaign = {
      id: `camp_ai_${Date.now()}`,
      name: `${aiTopic} AI Survey`,
      title: generatedResult.title || "How did we do?",
      subtitle: generatedResult.subtitle || "",
      status: "DRAFT",
      ratingType: generatedResult.ratingType === "numbers" ? "numbers" : "stars",
      targetAudience: "All Customers",
      tags: generatedResult.tags || ["AI Generated"],
      allowComments: generatedResult.allowComments !== false,
      submitButtonText: generatedResult.submitButtonText || "Submit Feedback",
      responsesCount: 0,
      csatScore: null,
      modifiedAt: "Created just now with AI",
      questions: (generatedResult.questions || []).map((q: any, idx: number) => ({
        id: q.id || `q_${idx}`,
        type: q.type || "CSAT",
        text: q.text || "",
        options: q.options || []
      }))
    };

    onSelectCampaign(newCamp);
    setShowAiModal(false);
    onNavigateToTab("Builder");
  };

  return (
    <div className="space-y-8">
      
      {/* Welcome Message Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] tracking-[0.4em] uppercase font-bold text-primary block mb-1.5">Overview // V.02</span>
          <h2 className="text-3xl font-display-lg text-white font-black tracking-tight uppercase">Dashboard Overview</h2>
          <p className="text-xs font-mono text-white/50 tracking-wider mt-1.5 uppercase">
            Welcome back, <span className="font-bold text-primary">Alex</span>. Here's how your survey campaigns are performing today.
          </p>
        </div>
        <button 
          onClick={onStartCreateCustom}
          className="flex items-center gap-2 bg-primary text-white hover:bg-[#b91c1c] transition px-5 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] active:scale-95 duration-100 self-start cursor-pointer"
        >
          <Plus id="plus-icon-dashboard" size={15} />
          Create Campaign
        </button>
      </div>

      {/* Main Metrics (Bento Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1: Overall CSAT Score */}
        <div className="md:col-span-2 bg-gradient-to-br from-[#1c0808] to-[#0A0A0A] border border-primary/20 rounded-none p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-[180px]">
          <div className="relative z-10">
            <p className="text-[9px] text-primary uppercase tracking-[0.3em] font-mono font-bold">Overall CSAT Score</p>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-5xl font-display-lg font-black tracking-tight text-white">4.82</span>
              <span className="text-lg font-mono text-white/40">/ 5.0</span>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1 rounded-none text-[10px] font-mono tracking-wider uppercase">
              <TrendingUp size={14} className="text-primary" />
              <span>+2.4% from last month</span>
            </div>
            <p className="text-[10px] font-mono text-white/40 tracking-wider hidden sm:block uppercase">// SYSTEM VERIFY PRO</p>
          </div>

          {/* Glowing Graphic Line representation inside card background */}
          <div className="absolute right-[-10px] bottom-[-20px] opacity-10 select-none pointer-events-none">
            <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 130 C 50 120, 80 50, 120 70 C 160 90, 180 20, 210 10" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
              <path d="M10 130 C 50 120, 80 50, 120 70 C 160 90, 180 20, 210 10 L 210 150 L 10 150 Z" fill="#dc2626" opacity="0.1" />
            </svg>
          </div>
        </div>

        {/* Total Responses Metric */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-none p-6 shadow-xl flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em]">Total Responses</p>
              <h4 className="text-4xl font-display-lg font-black text-white tracking-tight mt-2">12,842</h4>
            </div>
            <div className="p-2.5 rounded-none bg-white/5 text-primary border border-white/10">
              <Users size={18} />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-[10px] font-mono text-white/50 mb-1.5 uppercase tracking-wider">
              <span>Goal Progress</span>
              <span className="text-primary font-bold">+12.5% vs last month</span>
            </div>
            <div className="w-full h-1.5 bg-white/5 border border-white/5 rounded-none overflow-hidden">
              <div className="bg-primary w-[78%] h-full rounded-none"></div>
            </div>
          </div>
        </div>

      </div>

      {/* Grid Row 2: Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Metric 3: Active Campaigns Count */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-none p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 text-primary border border-white/10 rounded-none">
              <Rocket size={20} />
            </div>
            <div>
              <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em]">Active Campaigns</p>
              <h4 className="text-3xl font-black text-white font-display-lg mt-1">{activeCampaigns.length}</h4>
              <p className="text-[10px] font-mono text-white/45 mt-0.5 uppercase tracking-wider">{draftCampaigns.length} drafts pending launch</p>
            </div>
          </div>
          
          {/* Circular overlap avatar stack with indices */}
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-none border border-[#0e0e0e] bg-primary flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-mono font-bold">C1</span>
            </div>
            <div className="w-8 h-8 rounded-none border border-[#0e0e0e] bg-white/10 flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-mono font-bold">C2</span>
            </div>
            <div className="w-8 h-8 rounded-none border border-[#0e0e0e] bg-white/5 flex items-center justify-center shadow-sm">
              <span className="text-[9px] text-white font-mono font-bold">C3</span>
            </div>
            <div className="w-8 h-8 rounded-none border border-[#0e0e0e] bg-[#0E0E0E] flex items-center justify-center shadow-sm text-white/40 font-mono text-[9px]">
              +{activeCampaigns.length}
            </div>
          </div>
        </div>

        {/* Avg rating score card */}
        <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-none p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-white/5 text-yellow-500 border border-white/10 rounded-none">
            <Star size={20} fill="currentColor" />
          </div>
          <div>
            <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-[0.2em]">Average CSAT Rating</p>
            <h4 className="text-3xl font-black text-white font-display-lg mt-1">4.8 / 5.0</h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="inline-block w-2.5 h-2.5 rounded-none bg-green-500"></span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Excellent satisfaction rating</span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Bottom Section: Recent Campaigns + Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Campaigns Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 font-bold">Recent Campaigns</h3>
            <button 
              onClick={() => onNavigateToTab("Templates")} 
              className="text-primary text-[10px] uppercase font-bold tracking-widest font-mono hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All Templates
              <ChevronRight size={12} />
            </button>
          </div>

          <div className="space-y-3">
            {campaigns.map((camp) => (
              <div 
                key={camp.id} 
                onClick={() => onSelectCampaign(camp)}
                className="group bg-[#0E0E0E]/60 border border-white/5 hover:border-primary/50 rounded-none p-4 transition-all duration-300 hover:shadow-[3px_3px_0px_rgba(220,38,38,0.15)] cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-none ${
                    camp.status === "ACTIVE" || camp.status === "LIVE" ? "bg-primary/10 text-primary border border-primary/20" :
                    camp.status === "DRAFT" ? "bg-white/5 text-white/40 border border-white/10" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  } flex items-center justify-center group-hover:scale-105 duration-200 shrink-0`}>
                    <FileSpreadsheet size={20} className="shrink-0" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm group-hover:text-primary transition-colors">{camp.name}</h4>
                    <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-wide">{camp.modifiedAt}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className={`text-[9px] uppercase tracking-wider font-mono font-bold px-2.5 py-0.5 border ${
                    camp.status === "ACTIVE" || camp.status === "LIVE" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" :
                    camp.status === "DRAFT" ? "bg-white/5 text-white/60 border-white/10" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                  }`}>
                    {camp.status}
                  </span>
                  <span className="text-[11px] font-mono text-white/50">
                    {camp.responsesCount > 0 ? (
                      <span className="font-semibold text-white/80">{camp.responsesCount.toLocaleString()} responses</span>
                    ) : camp.status === "DRAFT" ? (
                      <span className="text-white/30">Not started</span>
                    ) : (
                      <span className="text-white/30">No responses</span>
                    )}
                    {camp.csatScore && ` • ${camp.csatScore} CSAT`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side Accessories: AI Builder + System Health */}
        <div className="space-y-6">
          
          {/* TRY AI BUILDER PREMIUM CTA BANNER */}
          <div className="rounded-none p-6 bg-gradient-to-br from-[#1c0808] to-[#0A0A0A] border border-primary/30 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-[190px]">
            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-1 bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 rounded-none text-[9px] font-bold font-mono tracking-[0.2em] uppercase">
                <Sparkles size={10} className="text-primary" fill="currentColor" />
                Gemini AI Engine
              </div>
              <h4 className="text-xl font-display-lg font-black uppercase tracking-tight">Build Smarter</h4>
              <p className="text-xs text-white/70 leading-relaxed">
                Our new AI Survey Assistant can help you generate custom contextual questions and branching design logic in seconds.
              </p>
            </div>

            <button 
              onClick={() => setShowAiModal(true)}
              className="mt-4 w-full flex items-center justify-center gap-1.5 bg-primary hover:bg-[#b91c1c] text-white border border-primary transition py-2 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] active:scale-95 duration-100 cursor-pointer"
            >
              <Sparkles size={13} className="text-white animate-pulse" />
              Try AI Builder
            </button>
            
            {/* Ambient visual orb */}
            <div className="absolute right-[-40px] top-[-30px] w-32 h-32 bg-primary/10 rounded-full blur-2xl select-none pointer-events-none"></div>
          </div>

          {/* SYSTEM HEALTH TELEMETRY */}
          <div className="bg-gradient-to-br from-[#121212] to-[#0A0A0A] border border-white/10 rounded-none p-6 shadow-sm space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 border-b border-white/5 pb-2.5">
              <Activity size={14} className="text-primary animate-pulse" />
              System Metrics
            </h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-white/45 uppercase tracking-wider">API Performance</span>
                  <span className="text-emerald-400 font-bold">99.9%</span>
                </div>
                <div className="w-full h-1 bg-white/5 border border-white/5 rounded-none overflow-hidden">
                  <div className="bg-emerald-500 w-[99.9%] h-full rounded-none"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-mono mb-1">
                  <span className="text-white/45 uppercase tracking-wider">Data Storage</span>
                  <span className="text-white/80 font-semibold">42% Used</span>
                </div>
                <div className="w-full h-1 bg-white/5 border border-white/5 rounded-none overflow-hidden">
                  <div className="bg-primary w-[42%] h-full rounded-none"></div>
                </div>
              </div>

              <div className="pt-2 text-[9px] font-mono text-white/30 flex items-center justify-between uppercase tracking-wider">
                <span>Infra: GCP Cloud Run</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-none bg-emerald-400 animate-ping"></span>
                  Online
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* AI SURVEY BUILDER POPUP MODAL */}
      {showAiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-none shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 bg-[#121212] flex justify-between items-center">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles size={18} className="text-primary animate-pulse" />
                <h3 className="text-sm text-white font-mono font-bold tracking-widest uppercase">AI Survey Generator</h3>
              </div>
              <button 
                onClick={() => setShowAiModal(false)}
                className="text-white/40 hover:text-white transition text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-grow bg-[#0D0D0D]">
              {!generatedResult ? (
                <form onSubmit={handleGenerateSurvey} className="space-y-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                      What is the core topic of your survey?
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. food delivery app satisfaction, website premium checkout experience"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-none focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm text-white font-mono placeholder:text-white/20"
                    />
                    <p className="text-[10px] font-mono text-white/40 uppercase tracking-wider leading-relaxed">
                      Be descriptive for better results. Gemini will auto-generate Title, Subtitle, Tags, and logical questions!
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                        Target Channel
                      </label>
                      <select 
                        value={aiChannel}
                        onChange={(e) => setAiChannel(e.target.value)}
                        className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-none text-xs font-mono font-bold text-white/80 focus:border-primary outline-none"
                      >
                        <option className="bg-[#0d0d0d]" value="Email">Email Post-Interaction</option>
                        <option className="bg-[#0d0d0d]" value="In-App">In-App Live Modal</option>
                        <option className="bg-[#0d0d0d]" value="SMS">SMS Link</option>
                        <option className="bg-[#0d0d0d]" value="QR Code">In-Person QR Code</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">
                        Metric standard
                      </label>
                      <div className="w-full px-3 py-2 border border-white/10 bg-white/2 rounded-none text-xs font-mono font-bold text-white/40 select-none uppercase tracking-wide">
                        CSAT & NPS Hybrid
                      </div>
                    </div>
                  </div>

                  {aiError && (
                    <div className="p-3 bg-red-900/10 text-red-400 text-xs rounded-none border border-red-500/20 font-mono">
                      <strong>Generation Error:</strong> {aiError}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                    <button 
                      type="button" 
                      onClick={() => setShowAiModal(false)}
                      className="px-5 py-2 border border-white/10 rounded-none text-xs font-mono font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={aiLoading}
                      className="flex items-center gap-2 bg-primary hover:bg-[#b91c1c] text-white px-5 py-2 rounded-none font-mono text-xs uppercase tracking-widest transition shadow-[2px_2px_0px_rgba(255,255,255,0.15)] active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      {aiLoading ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          Generate Design
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div className="p-3.5 bg-emerald-500/10 rounded-none border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider flex items-center justify-between">
                    <span>✨ drafted campaign design draft!</span>
                    <button 
                      onClick={() => setGeneratedResult(null)}
                      className="text-primary hover:underline font-bold"
                    >
                      Regenerate
                    </button>
                  </div>

                  <div className="space-y-4 border border-white/10 p-5 rounded-none bg-white/2">
                    <div>
                      <span className="text-[9px] font-mono font-bold tracking-widest text-[#dc2626] uppercase bg-[#dc2626]/10 border border-[#dc2626]/20 px-2 py-0.5 rounded-none">Draft Preview</span>
                      <h4 className="text-md font-bold text-white mt-2 font-display-lg uppercase tracking-tight">{generatedResult.title}</h4>
                      <p className="text-xs text-white/70 mt-1 italic">"{generatedResult.subtitle}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-xs font-mono">
                      <div>
                        <span className="text-white/40 block">Rating Type:</span>
                        <span className="font-bold text-white uppercase tracking-wide">{generatedResult.ratingType}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Button text:</span>
                        <span className="font-bold text-white uppercase tracking-wide">{generatedResult.submitButtonText}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <span className="text-xs font-mono text-white/40 block mb-1.5 uppercase tracking-wider">Tags recommendation:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(generatedResult.tags || []).map((t: string) => (
                          <span key={t} className="text-[10px] font-mono font-bold bg-[#dc2626]/10 text-primary border border-primary/20 px-2 py-0.5 rounded-none">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 space-y-4">
                      <span className="text-xs font-mono text-white/40 block uppercase tracking-wider">Generated Flow Steps:</span>
                      {(generatedResult.questions || []).map((q: any) => (
                        <div key={q.id} className="p-4 bg-black/30 rounded-none border border-white/10 flex items-start gap-3">
                          <span className="text-[9px] font-mono font-bold bg-primary/20 text-primary border border-primary/20 px-2.5 py-0.5 rounded-none mt-0.5 shrink-0">
                            {q.type}
                          </span>
                          <div className="space-y-2">
                            <p className="text-xs font-semibold text-white tracking-wide">{q.text}</p>
                            {q.options && q.options.length > 0 && (
                              <div className="flex flex-wrap gap-1 pt-1">
                                {q.options.map((opt: string) => (
                                  <span key={opt} className="text-[9px] font-mono bg-white/2 text-white/60 border border-white/5 rounded-none px-2 py-0.5">
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
                    <button 
                      onClick={() => setShowAiModal(false)}
                      className="px-5 py-2 border border-white/10 rounded-none text-xs font-mono font-bold uppercase tracking-wider text-white/60 hover:text-white hover:bg-white/5 transition cursor-pointer"
                    >
                      Close
                    </button>
                    <button 
                      onClick={handleApplyAiSurvey}
                      className="flex items-center gap-1.5 bg-primary hover:bg-[#b91c1c] text-white px-5 py-2 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] transition active:scale-95 cursor-pointer"
                    >
                      <Sparkles size={12} className="text-white fill-current" />
                      Apply into Builder
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
