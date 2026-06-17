import React, { useState } from "react";
import { 
  Check, 
  Trash2, 
  Plus, 
  HelpCircle, 
  X, 
  Star, 
  Settings as SettingsIcon, 
  FileText, 
  Palette, 
  Layers, 
  Sparkles, 
  UserPlus
} from "lucide-react";
import { Campaign, Question, CampaignStatus } from "../types";

interface CampaignsViewProps {
  camp: Campaign;
  onSaveCampaign: (updatedCamp: Campaign) => void;
  onCancel: () => void;
}

export default function CampaignsView({ camp, onSaveCampaign, onCancel }: CampaignsViewProps) {
  // Campaign state initialized from prop
  const [name, setName] = useState(camp.name);
  const [title, setTitle] = useState(camp.title);
  const [subtitle, setSubtitle] = useState(camp.subtitle || "");
  const [ratingType, setRatingType] = useState<"stars" | "numbers">(camp.ratingType || "stars");
  const [targetAudience, setTargetAudience] = useState(camp.targetAudience || "Premium Subscribers");
  const [submitButtonText, setSubmitButtonText] = useState(camp.submitButtonText || "Submit Feedback");
  const [allowComments, setAllowComments] = useState(camp.allowComments !== false);
  const [tags, setTags] = useState<string[]>(camp.tags || ["Fast Delivery", "Easy Setup", "Great Quality"]);
  const [newTag, setNewTag] = useState("");
  const [questions, setQuestions] = useState<Question[]>(camp.questions || []);

  // Builder tabs: "logic" (the step process settings) vs "content" (Survey presentation settings)
  const [activeTab, setActiveTab] = useState<"logic" | "content" | "styling">("logic");
  
  // Logical designer step progress
  const [stepFilter, setStepFilter] = useState<1 | 2 | 3>(1);

  // New question option builders
  const [newQuestionType, setNewQuestionType] = useState<"CSAT" | "NPS" | "MultipleChoice">("CSAT");
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(["Excellent", "Average", "Needs Improvement"]);
  const [editingOptionText, setEditingOptionText] = useState("");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    if (!tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
    }
    setNewTag("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // Add question block based on type selected
  const handleAddQuestionType = (type: "NPS" | "CSAT" | "MultipleChoice") => {
    let text = "";
    let options: string[] = [];

    if (type === "CSAT") {
      text = "Overall, how would you rate your satisfaction with our product?";
    } else if (type === "NPS") {
      text = "How likely are you to recommend our brand to colleagues or partners?";
    } else if (type === "MultipleChoice") {
      text = "What was the most delightful aspect of your experience?";
      options = ["Speed of delivery", "Quality of customer care", "Easy to use setup UI"];
    }

    const newQ: Question = {
      id: `q_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type,
      text,
      options
    };

    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleQuestionTextChange = (id: string, text: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, text } : q));
  };

  const handleQuestionOptionsChange = (id: string, optionIndex: number, newValue: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        const updated=[...q.options];
        updated[optionIndex] = newValue;
        return { ...q, options: updated };
      }
      return q;
    }));
  };

  const handleAddQuestionOption = (id: string) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, options: [...q.options, "New option selection"] };
      }
      return q;
    }));
  };

  const handleRemoveQuestionOption = (id: string, optionIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === id) {
        return { ...q, options: q.options.filter((_, idx) => idx !== optionIndex) };
      }
      return q;
    }));
  };

  const handleSaveAndExit = (status: CampaignStatus) => {
    const updated: Campaign = {
      ...camp,
      name: name || "Custom Active Campaign",
      title: title || "Feedback Assessment",
      subtitle,
      status,
      ratingType,
      targetAudience,
      tags,
      questions,
      allowComments,
      submitButtonText,
      modifiedAt: status === "ACTIVE" ? "Active • Started just now" : "Modified just now"
    };
    onSaveCampaign(updated);
  };

  return (
    <div className="space-y-6 text-white">
      
      {/* Campaign Builder Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-none tracking-wider">
              SURVEYCORE SUITE
            </span>
            <span className="text-white/20">•</span>
            <span className="text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Campaign Designer</span>
          </div>
          <h2 className="text-2xl font-display-lg font-black uppercase tracking-tight text-white mt-2 flex items-center gap-2">
            {name || "Unnamed Campaign"}
            <span className="text-[10px] font-mono bg-white/5 text-white/60 px-2 py-0.5 rounded-none font-bold uppercase border border-white/10">
              {camp.status}
            </span>
          </h2>
        </div>
        
        {/* Actions bar at header */}
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={onCancel}
            className="px-5 py-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition rounded-none text-xs font-mono font-bold uppercase tracking-wider active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => handleSaveAndExit("DRAFT")}
            className="px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white transition rounded-none text-xs font-mono font-bold uppercase tracking-wider active:scale-95 cursor-pointer"
          >
            Save Draft
          </button>
          <button 
            type="button" 
            onClick={() => handleSaveAndExit("ACTIVE")}
            className="bg-primary hover:bg-[#b91c1c] text-white transition px-5 py-2 border border-primary rounded-none text-xs font-mono font-bold uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] active:scale-95 duration-100 cursor-pointer"
          >
            Publish Live
          </button>
        </div>
      </div>

      {/* Editor Submenu Tab Navigation */}
      <div className="flex gap-1 bg-[#121212] p-1 rounded-none w-full max-w-lg border border-white/10">
        <button 
          onClick={() => setActiveTab("logic")}
          className={`flex-grow flex items-center justify-center gap-1.5 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === "logic" 
              ? "bg-[#D92525] text-white border-b-2 border-white/30" 
              : "text-white/55 hover:text-white hover:bg-white/5"
          }`}
        >
          <Layers size={12} />
          Step Settings & Questions
        </button>
        
        <button 
          onClick={() => setActiveTab("content")}
          className={`flex-grow flex items-center justify-center gap-1.5 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === "content" 
              ? "bg-[#D92525] text-white border-b-2 border-white/30" 
              : "text-white/55 hover:text-white hover:bg-white/5"
          }`}
        >
          <FileText size={12} />
          Content Setup
        </button>

        <button 
          onClick={() => setActiveTab("styling")}
          className={`flex-grow flex items-center justify-center gap-1.5 py-2 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
            activeTab === "styling" 
              ? "bg-[#D92525] text-white border-b-2 border-white/30" 
              : "text-white/55 hover:text-white hover:bg-white/5"
          }`}
        >
          <Palette size={12} />
          Styling Design
        </button>
      </div>

      {/* DESIGN COMPONENT CHANNELS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        
        {/* Core Settings Form (2 columns) */}
        <div className="lg:col-span-2 space-y-lg">
          
          {/* TAB 1: LOGIC / QUESTIONS SETUP */}
          {activeTab === "logic" && (
            <div className="space-y-lg">
              
              {/* Step Sequence Bar in Logic */}
              <div className="bg-[#121212] border border-white/10 p-4 rounded-none flex items-center justify-between">
                <div className="flex items-center gap-4 w-full justify-between">
                  
                  {/* Step 1 Settings */}
                  <div 
                    onClick={() => setStepFilter(1)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-mono font-bold border ${
                      stepFilter === 1 ? "bg-primary border-primary text-white" : "bg-black/30 border-white/10 text-white/40 group-hover:border-white/30"
                    } transition-all duration-150`}>
                      1
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${stepFilter === 1 ? "text-primary" : "text-white/40 group-hover:text-white/70"}`}>Campaign Metadata</span>
                  </div>

                  {/* Divider line */}
                  <div className="flex-grow h-[1px] bg-white/5 mx-4 hidden md:block"></div>

                  {/* Step 2 Questions */}
                  <div 
                    onClick={() => setStepFilter(2)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-mono font-bold border ${
                      stepFilter === 2 ? "bg-primary border-primary text-white" : "bg-black/30 border-white/10 text-white/40 group-hover:border-white/30"
                    } transition-all duration-150`}>
                      2
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${stepFilter === 2 ? "text-primary" : "text-white/40 group-hover:text-white/70"}`}>Logic Structure</span>
                  </div>

                  {/* Divider line */}
                  <div className="flex-grow h-[1px] bg-white/5 mx-4 hidden md:block"></div>

                  {/* Step 3 Preview */}
                  <div 
                    onClick={() => setStepFilter(3)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <span className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-mono font-bold border ${
                      stepFilter === 3 ? "bg-primary border-primary text-white" : "bg-black/30 border-white/10 text-white/40 group-hover:border-white/30"
                    } transition-all duration-150`}>
                      3
                    </span>
                    <span className={`text-[10px] font-mono uppercase tracking-widest font-bold ${stepFilter === 3 ? "text-primary" : "text-white/40 group-hover:text-white/70"}`}>Launch Logic</span>
                  </div>

                </div>
              </div>

              {/* STEP 1 SETUP PANELS */}
              {stepFilter === 1 && (
                <div className="bg-[#1a1a1a]/60 border border-white/10 p-6 rounded-none space-y-5">
                  <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2.5">Campaign Parameters</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Campaign Name</label>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Q3 Feedback Wave"
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white font-mono placeholder:text-white/20 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none transition rounded-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Target Audience Segment</label>
                      <select 
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full px-4 py-2.5 bg-black/40 border border-white/10 text-white/80 font-mono text-xs focus:border-primary outline-none transition rounded-none"
                      >
                        <option className="bg-[#0e0e0e]" value="Premium Subscribers">Premium Subscribers</option>
                        <option className="bg-[#0e0e0e]" value="Recent Purchasers">Recent Purchasers</option>
                        <option className="bg-[#0e0e0e]" value="All New Accounts">All New Accounts</option>
                        <option className="bg-[#0e0e0e]" value="Enterprise Clients">Enterprise Clients</option>
                        <option className="bg-[#0e0e0e]" value="Custom API Filter">Custom API Filter</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button 
                      onClick={() => setStepFilter(2)}
                      className="bg-primary hover:bg-[#b91c1c] text-white transition px-5 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] active:scale-95 cursor-pointer"
                    >
                      Next: Structure Questions
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2 AND 3 STRUCTURAL BUILDER */}
              {(stepFilter === 2 || stepFilter === 3) && (
                <div className="space-y-6">
                  
                  {/* SURVEY STRUCTURE INGREDIENTS BAR */}
                  <div className="bg-[#121212] border border-white/10 p-6 rounded-none space-y-5">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 font-bold">Survey Structure Blocks</h4>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-white/40">Click to inject block into logic flow</span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      
                      {/* NPS BLOCK */}
                      <button 
                        type="button"
                        onClick={() => handleAddQuestionType("NPS")}
                        className="p-4 bg-black/20 border border-white/10 hover:border-primary hover:bg-primary/5 active:scale-95 duration-100 rounded-none text-center cursor-pointer transition flex flex-col items-center gap-2"
                      >
                        <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono font-bold text-xs">
                          NPS
                        </div>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">NPS Block</span>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wide">Net Promoter Score</span>
                      </button>

                      {/* CSAT BLOCK */}
                      <button 
                        type="button"
                        onClick={() => handleAddQuestionType("CSAT")}
                        className="p-4 bg-black/20 border border-white/10 hover:border-primary hover:bg-primary/5 active:scale-95 duration-100 rounded-none text-center cursor-pointer transition flex flex-col items-center gap-2"
                      >
                        <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono font-bold text-xs">
                          😊
                        </div>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">CSAT Block</span>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wide">Customer Satisfaction</span>
                      </button>

                      {/* MULTIPLE CHOICE */}
                      <button 
                        type="button"
                        onClick={() => handleAddQuestionType("MultipleChoice")}
                        className="p-4 bg-black/20 border border-white/10 hover:border-primary hover:bg-primary/5 active:scale-95 duration-100 rounded-none text-center cursor-pointer transition flex flex-col items-center gap-2"
                      >
                        <div className="w-9 h-9 rounded-none bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-mono font-bold text-xs">
                          ✓⚏
                        </div>
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">Multichoice</span>
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-wide">Fixed Option Select</span>
                      </button>

                      {/* CUSTOM BLANK BLOCK */}
                      <button 
                        type="button"
                        onClick={() => handleAddQuestionType("CSAT")}
                        className="p-4 bg-black/10 border border-white/10 hover:border-primary hover:bg-primary/5 active:scale-95 duration-100 rounded-none text-center cursor-pointer transition flex flex-col items-center justify-center border-dashed border-2 text-white/30"
                      >
                        <Plus size={16} className="text-primary animate-pulse" />
                        <span className="text-xs font-mono font-bold mt-1 text-white/60">Add Block</span>
                        <span className="text-[9px] font-mono text-white/30 uppercase tracking-wide">Add Blank Card</span>
                      </button>

                    </div>
                  </div>

                  {/* ACTIVE SURVEY BLOCKS */}
                  <div className="space-y-4">
                    {questions.length === 0 ? (
                      /* NO QUESTIONS PLACEHOLDER */
                      <div className="border border-dashed border-white/10 rounded-none p-8 text-center bg-[#121212]/30 flex flex-col items-center justify-center min-h-[220px]">
                        <div className="p-3.5 bg-white/5 text-primary border border-white/10 rounded-none mb-3">
                          <Layers size={32} />
                        </div>
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">No questions added yet</h4>
                        <p className="text-[10px] font-mono text-white/40 max-w-xs mt-2 uppercase tracking-wider leading-relaxed">
                          Select a survey structure type above to logically inject blocks or questions into your feedback flow.
                        </p>
                      </div>
                    ) : (
                      /* RENDER QUESTIONS LIST */
                      questions.map((q, idx) => (
                        <div 
                          key={q.id}
                          className="bg-[#121212] border border-white/10 rounded-none p-5 flex flex-col md:flex-row gap-6"
                        >
                          {/* Indicator layout */}
                          <div className="flex md:flex-col items-center md:items-start gap-1 justify-between shrink-0 mb-2 md:mb-0">
                            <div>
                              <span className="inline-block bg-primary text-white font-mono font-bold text-[9px] px-2.5 py-0.5 rounded-none tracking-wider uppercase">
                                Block {idx + 1}
                              </span>
                              <span className="block text-xs font-mono font-extrabold text-white/50 uppercase tracking-widest mt-1.5">
                                {q.type === "MultipleChoice" ? "Multiple Choice" : q.type}
                              </span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => handleRemoveQuestion(q.id)}
                              className="p-1 text-white/30 hover:text-primary transition rounded-none cursor-pointer"
                              title="Delete logic block"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          {/* Editable Question Details */}
                          <div className="flex-grow space-y-4">
                            <div className="space-y-1.5">
                              <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">Question Text</label>
                              <input 
                                type="text"
                                value={q.text}
                                onChange={(e) => handleQuestionTextChange(q.id, e.target.value)}
                                className="w-full text-xs font-mono font-bold text-white border border-white/10 focus:border-primary focus:outline-none bg-black/30 p-2 rounded-none transition-all"
                              />
                            </div>

                            {/* Additional controls based on logical type */}
                            {q.type === "MultipleChoice" && (
                              <div className="space-y-3 pt-3 bg-black/40 p-4 rounded-none border border-white/10">
                                <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest block mb-1">
                                  Choice Selection List
                                </label>
                                <div className="space-y-2">
                                  {q.options.map((option, optIdx) => (
                                    <div key={optIdx} className="flex items-center gap-2">
                                      <span className="text-[10px] font-mono text-white/30 font-bold w-5">{optIdx+1}.</span>
                                      <input 
                                        type="text"
                                        value={option}
                                        onChange={(e) => handleQuestionOptionsChange(q.id, optIdx, e.target.value)}
                                        className="flex-grow text-xs font-mono bg-black/20 text-white border border-white/10 rounded-none px-3 py-1.5 focus:border-[#D92525] outline-none"
                                      />
                                      <button 
                                        type="button"
                                        onClick={() => handleRemoveQuestionOption(q.id, optIdx)}
                                        className="text-white/40 hover:text-primary p-1 text-xs font-mono font-bold cursor-pointer"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleAddQuestionOption(q.id)}
                                  className="text-primary text-[10px] font-mono uppercase tracking-widest font-bold mt-2 flex items-center gap-1 hover:underline cursor-pointer"
                                >
                                  <Plus size={11} />
                                  Add Target Choices
                                </button>
                              </div>
                            )}

                            {q.type === "CSAT" && (
                              <div className="text-[10px] font-mono text-white/40 bg-[#0d0d0d] p-3 rounded-none border border-white/10 leading-relaxed uppercase tracking-wider">
                                👉 This block triggers a rating scoring index. Ratings are computed globally into overall CSAT.
                              </div>
                            )}

                            {q.type === "NPS" && (
                              <div className="text-[10px] font-mono text-white/40 bg-[#0d0d0d] p-3 rounded-none border border-white/10 leading-relaxed uppercase tracking-wider">
                                👉 Triggers a 1-10 slider standard NPS survey card which grades clients as Detractors, Passives, or Promoters.
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {stepFilter === 2 && (
                    <div className="pt-2 flex justify-between">
                      <button 
                        onClick={() => setStepFilter(1)}
                        className="px-5 py-2 border border-white/10 text-white/60 hover:text-white hover:bg-white/5 rounded-none text-xs font-mono font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        onClick={() => setStepFilter(3)}
                        className="bg-primary hover:bg-[#b91c1c] text-white transition px-5 py-2 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] cursor-pointer"
                      >
                        Proceed to Logic Verification
                      </button>
                    </div>
                  )}

                  {stepFilter === 3 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-none text-emerald-400 space-y-3 font-mono">
                      <h4 className="text-xs font-mono font-bold flex items-center gap-1.5 uppercase tracking-wider">
                        <Check size={16} />
                        Campaign Logical Verification Complete!
                      </h4>
                      <p className="text-[10px] uppercase tracking-wide text-white/60 leading-relaxed">
                        No looping rules detected. Your branching and questions compile to a flawless experience. Go ahead and launch this live, or customize styling!
                      </p>
                      <div className="pt-2 flex justify-between">
                        <button 
                          onClick={() => setStepFilter(2)}
                          className="px-4 py-1.5 border border-emerald-500/20 hover:bg-emerald-500/10 text-emerald-400 transition rounded-none text-[10px] font-mono font-bold uppercase tracking-wider cursor-pointer"
                        >
                          Back to Structure
                        </button>
                        <button 
                          onClick={() => setActiveTab("content")}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest cursor-pointer"
                        >
                          Enter Content Setup Tab
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* TAB 2: CONTENT PARAMS SETUP */}
          {activeTab === "content" && (
            <div className="bg-[#1a1a1a]/60 border border-white/10 p-6 rounded-none space-y-5">
              <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/50 border-b border-white/5 pb-2.5">Survey Display Content</h3>
              
              <div className="space-y-4">
                
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Survey Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. How are we doing?"
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition rounded-none text-xs font-mono text-white placeholder:text-white/20"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Subtitle</label>
                  <textarea 
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. We value your feedback. Let us know..."
                    rows={2}
                    className="w-full px-4 py-2.5 bg-black/40 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition rounded-none text-xs font-mono text-white placeholder:text-white/20"
                  />
                </div>

                {/* Rating Type Selection */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Rating Metric Scale</label>
                  <div className="grid grid-cols-2 gap-4">
                    
                    {/* Stars Select option */}
                    <button 
                      type="button"
                      onClick={() => setRatingType("stars")}
                      className={`flex items-center justify-center gap-2 p-4 border rounded-none font-mono text-xs uppercase tracking-wider transition duration-150 cursor-pointer ${
                        ratingType === "stars" 
                          ? "bg-[#dc2626]/10 border-[#dc2626] text-primary" 
                          : "border-white/10 hover:bg-white/5 text-white/60"
                      }`}
                    >
                      <Star size={14} fill={ratingType === "stars" ? "currentColor" : "none"} />
                      Star Scaling (1-5 Stars)
                    </button>

                    {/* Numeric select option */}
                    <button 
                      type="button"
                      onClick={() => setRatingType("numbers")}
                      className={`flex items-center justify-center gap-2 p-4 border rounded-none font-mono text-xs uppercase tracking-wider transition duration-150 cursor-pointer ${
                        ratingType === "numbers" 
                          ? "bg-[#dc2626]/10 border-[#dc2626] text-primary" 
                          : "border-white/10 hover:bg-white/5 text-white/60"
                      }`}
                    >
                      <span className="text-[14px]">⑤</span>
                      Numeric Matrix (1-10 Scale)
                    </button>

                  </div>
                </div>

                {/* Feedback Tags */}
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Dismissable Feedback Tags</label>
                  
                  {/* Current tags display */}
                  <div className="flex flex-wrap gap-2 mb-3 p-4 bg-black/40 rounded-none border border-white/10">
                    {tags.length === 0 ? (
                      <span className="text-xs font-mono text-white/30 uppercase tracking-wide">No tags. Enter tags below.</span>
                    ) : (
                      tags.map(t => (
                        <span 
                          key={t}
                          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold bg-[#dc2626]/10 border border-primary/20 text-primary px-3 py-1 rounded-none shrink-0 animate-fade-in"
                        >
                          {t}
                          <button 
                            type="button" 
                            onClick={() => handleRemoveTag(t)}
                            className="text-primary hover:text-white font-bold select-none p-0.5 rounded cursor-pointer"
                          >
                            ✕
                          </button>
                        </span>
                      ))
                    )}
                  </div>

                  {/* Add tag panel */}
                  <form onSubmit={handleAddTag} className="flex gap-2 max-w-sm">
                    <input 
                      type="text" 
                      placeholder="Enter new attribute tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      className="flex-grow px-3 py-2 bg-black/40 border border-white/10 rounded-none text-xs text-white font-mono outline-none focus:border-primary"
                    />
                    <button 
                      type="submit"
                      className="bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold px-4 py-2 rounded-none shrink-0 transition cursor-pointer"
                    >
                      + Add Tag
                    </button>
                  </form>
                </div>

                {/* Comments box toggler */}
                <div className="flex items-center justify-between p-4 bg-black/40 rounded-none border border-white/10 max-w-md">
                  <div>
                    <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Allow Written Comments</h5>
                    <p className="text-[10px] font-mono text-white/40 mt-1 uppercase tracking-wide">Gives users box to send written explanatory logs.</p>
                  </div>
                  
                  <input 
                    type="checkbox" 
                    checked={allowComments} 
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="w-4 h-4 rounded-none text-primary focus:ring-primary border-white/10 bg-black/50 cursor-pointer accent-[#D92525]"
                  />
                </div>

                {/* Submit button text customization */}
                <div className="space-y-1.5 max-w-sm">
                  <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Button Affirmation Text</label>
                  <input 
                    type="text" 
                    value={submitButtonText}
                    onChange={(e) => setSubmitButtonText(e.target.value)}
                    placeholder="Submit Feedback"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition rounded-none text-xs font-mono text-white placeholder:text-white/20"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button 
                  type="button"
                  onClick={() => setActiveTab("styling")}
                  className="bg-primary hover:bg-[#b91c1c] text-white transition px-5 py-2 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                  Configure Custom Styling
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: STYLING PANEL */}
          {activeTab === "styling" && (
            <div className="bg-[#1a1a1a]/60 border border-white/10 p-6 rounded-none space-y-5">
              <h3 className="text-md font-bold text-white border-b border-white/5 pb-2">Styling Customization</h3>
              
              <div className="space-y-md">
                
                <div className="p-4 bg-black/40 border border-white/10 text-white/70 rounded-none text-[11px] font-mono space-y-2 uppercase tracking-wide">
                  <p className="font-bold text-white flex items-center gap-1.5 tracking-widest">
                    <Palette size={13} className="text-primary" />
                    Brand Asset Integration
                  </p>
                  <p className="text-white/40 leading-relaxed">
                    By default, the survey inherits our Swiss Crimson template preset to maintain trust index metrics. You can select custom secondary values.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Primary Color Accent</label>
                    <div className="flex gap-2.5 items-center">
                      <span className="block w-6 h-6 bg-primary rounded-none hover:scale-110 cursor-pointer transform duration-100 inline-block border border-white/20" title="Crimson Red"></span>
                      <span className="block w-6 h-6 bg-white rounded-none hover:scale-110 cursor-pointer transform duration-100 inline-block border border-white/20" title="Swiss White"></span>
                      <span className="block w-6 h-6 bg-[#030303] rounded-none hover:scale-110 cursor-pointer transform duration-100 inline-block border border-white/40" title="Asphalt Black"></span>
                      <span className="text-[10px] text-white/30 font-mono uppercase">Preset Accent</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono font-bold text-white/50 uppercase tracking-widest">Layout Elevation Profile</label>
                    <div className="flex gap-2">
                      <button type="button" className="p-2 border border-primary text-primary text-[9px] font-mono font-bold rounded-none bg-primary/10 uppercase tracking-widest cursor-pointer">Flat Minimal</button>
                      <button type="button" className="p-2 border border-white/10 text-white/40 text-[9px] font-mono font-bold rounded-none hover:bg-white/5 uppercase tracking-widest cursor-pointer">SaaS Soft Shadow</button>
                    </div>
                  </div>
                </div>

              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setActiveTab("logic")}
                  className="px-5 py-2.5 border border-white/10 rounded-none text-xs font-mono font-bold text-white/60 hover:text-white hover:bg-white/5 uppercase tracking-wider cursor-pointer"
                >
                  Review Logic Step
                </button>
                <button 
                  type="button"
                  onClick={() => handleSaveAndExit("ACTIVE")}
                  className="bg-primary hover:bg-[#b91c1c] text-white transition px-6 py-2.5 rounded-none font-mono text-xs uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                  Complete & Launch Live
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Survey Live Mockup Preview Sandbox (1 column) */}
        <div className="space-y-4">
          <div className="text-white/40 text-[10px] font-mono font-extrabold uppercase tracking-[0.2em] px-1">
            🖥️ Live Sandbox Preview
          </div>

          <div className="bg-black/90 border border-white/10 shadow-[8px_8px_0px_rgba(217,37,37,0.1)] rounded-none overflow-hidden max-w-sm mx-auto h-[480px] flex flex-col justify-between relative">
            
            {/* Embedded Header mockup */}
            <div className="bg-[#121212] border-b border-white/10 p-4 flex justify-between items-center z-10 shrink-0">
              <span className="font-mono font-extrabold text-[10px] text-primary uppercase tracking-[0.2em]">SurveyCore Client</span>
              <span className="inline-block w-1.5 h-1.5 rounded-none bg-primary animate-pulse"></span>
            </div>

            {/* Embedded Content mockup */}
            <div className="p-6 space-y-5 overflow-y-auto flex-grow text-center flex flex-col justify-center min-h-0 custom-scrollbar">
              
              <div className="space-y-2">
                <h4 className="text-xs font-mono font-bold text-white tracking-widest uppercase leading-snug">{title || "How are we doing?"}</h4>
                {subtitle && (
                  <p className="text-[10px] font-mono text-white/50 leading-relaxed max-w-xs mx-auto antialiased uppercase tracking-wide">
                    {subtitle}
                  </p>
                )}
              </div>

              {/* Metric rate visual block */}
              <div className="py-2">
                {ratingType === "stars" ? (
                  <div className="flex justify-center gap-2 text-primary">
                    {[1,2,3,4,5].map(idx => (
                      <Star key={idx} size={22} className="text-primary hover:scale-110 transition duration-100" fill="currentColor" />
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center gap-1 flex-wrap">
                    {[1,2,3,4,5,6,7,8,9,10].map(val => (
                      <span 
                        key={val} 
                        className={`w-7 h-7 flex items-center justify-center rounded-none text-[9px] font-mono font-bold cursor-pointer border ${
                          val >= 9 ? "bg-[#D92525] border-primary text-white" :
                          val >= 7 ? "bg-black border-white/20 text-white/80" :
                          "bg-black border-white/10 text-white/40"
                        }`}
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex justify-between max-w-[240px] mx-auto mt-2 text-[8px] font-mono font-bold text-white/30 uppercase tracking-widest">
                  <span>unlikely</span>
                  <span>neutral</span>
                  <span>extremely likely</span>
                </div>
              </div>

              {/* Dynamic tag selection render */}
              {tags.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[8px] font-mono text-white/30 font-bold block uppercase tracking-widest">Optional Categorical Tags</span>
                  <div className="flex flex-wrap gap-1.5 justify-center max-w-[280px] mx-auto">
                    {tags.map(t => (
                      <span key={t} className="text-[8px] font-mono font-bold bg-[#dc2626]/10 border border-[#dc2626]/25 text-primary px-2.5 py-0.5 rounded-none select-none cursor-pointer uppercase tracking-wider">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comment text area preview */}
              {allowComments && (
                <textarea 
                  rows={2} 
                  disabled
                  placeholder="Tell us what we can improve (optional)..."
                  className="w-full text-[9px] font-mono border border-white/10 rounded-none p-2.5 bg-black/40 text-white placeholder:text-white/20 focus:outline-none resize-none cursor-not-allowed select-none"
                />
              )}

            </div>

            {/* Embedded Footer action preview */}
            <div className="p-4 bg-[#121212] border-t border-white/10 flex justify-center shrink-0 z-10">
              <button 
                type="button"
                disabled
                className="w-full bg-primary py-3 rounded-none text-[10px] font-mono font-bold text-white uppercase tracking-widest shadow-[2px_2px_0px_rgba(255,255,255,0.1)] cursor-not-allowed"
              >
                {submitButtonText || "Submit Feedback"}
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
