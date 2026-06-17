import React, { useState } from "react";
import { Search, Star, Clock, Plus, LayoutGrid } from "lucide-react";
import { Template, Campaign } from "../types";
import { INITIAL_TEMPLATES } from "../data";

interface TemplatesViewProps {
  onUseTemplate: (campaign: Campaign) => void;
  onStartCreateCustom: () => void;
}

export default function TemplatesView({ onUseTemplate, onStartCreateCustom }: TemplatesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Templates");

  const categories = [
    "All Templates", 
    "Customer Support", 
    "Post-Purchase", 
    "Product Feedback"
  ];

  // Map category filter to match data structure
  const filterTemplates = () => {
    return INITIAL_TEMPLATES.filter(tmpl => {
      // 1. Filter by Search Query
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        tmpl.title.toLowerCase().includes(query) || 
        tmpl.description.toLowerCase().includes(query);

      // 2. Filter by Category
      const matchesCategory = selectedCategory === "All Templates" || tmpl.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const handleSelectTemplate = (tmpl: Template) => {
    // Generate active Campaign format from Template
    const campaignFromTemplate: Campaign = {
      id: `camp_tmpl_${Date.now()}`,
      name: `${tmpl.title} copy`,
      title: tmpl.title,
      subtitle: tmpl.description,
      status: "DRAFT",
      ratingType: tmpl.questions[0]?.type === "NPS" ? "numbers" : "stars",
      targetAudience: "All users",
      tags: tmpl.tags,
      questions: tmpl.questions,
      allowComments: true,
      submitButtonText: tmpl.submitButtonText || "Submit Feedback",
      responsesCount: 0,
      csatScore: null,
      modifiedAt: "Imported from template just now"
    };

    onUseTemplate(campaignFromTemplate);
  };

  const visibleTemplates = filterTemplates();

  // Group templates by categories to reflect beautiful screenshots
  const csatTemplates = visibleTemplates.filter(t => t.category === "CSAT" || t.id.includes("star") || t.id.includes("detailed") || t.id.includes("ticket"));
  const postPurchaseTemplates = visibleTemplates.filter(t => t.category === "Post-Purchase" || t.id.includes("checkout") || t.id.includes("unbox"));

  return (
    <div className="space-y-lg animate-fade-in">
      
      {/* Search & Filter Top Bar Section */}
      <div className="flex flex-col md:flex-row gap-4 items-end md:items-center justify-between border-b border-slate-100 pb-md">
        
        {/* Search */}
        <div className="w-full md:max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-slate-800"
          />
        </div>

        {/* Categories select options list */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto shrink-0">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition duration-200 ${
                selectedCategory === cat 
                  ? "bg-primary text-white shadow-sm" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* RECOMMENDED FOR CSAT GRID */}
      {selectedCategory === "All Templates" && csatTemplates.length > 0 && (
        <section className="space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recommended for CSAT</h3>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Metrics scale: 1-5 scale</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {csatTemplates.map(tmpl => (
              <div 
                key={tmpl.id}
                className="group bg-white border border-slate-200 hover:border-primary rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                
                {/* Thumbnail image header */}
                <div className="h-44 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100 p-0">
                  <img 
                    src={tmpl.imageUrl} 
                    alt={tmpl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Status Badge overlays */}
                  {tmpl.isPopular && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-green-500 text-white rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow">
                      Popular
                    </div>
                  )}
                  {tmpl.isDetailed && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-primary text-white rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow">
                      Detailed
                    </div>
                  )}
                  {tmpl.isNew && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-amber-500 text-white rounded-full text-[10px] uppercase tracking-wider font-extrabold shadow">
                      New
                    </div>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-md flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="text-md font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      {tmpl.title}
                    </h4>
                    <div className="flex items-center text-amber-500 shrink-0 font-bold text-xs gap-0.5">
                      <Star size={14} fill="currentColor" />
                      <span>{tmpl.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-grow">
                    {tmpl.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-md border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[11px] font-bold">{tmpl.timeToComplete} min</span>
                    </div>

                    <button 
                      onClick={() => handleSelectTemplate(tmpl)}
                      className="bg-primary hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm active:scale-95"
                    >
                      Use Template
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>
      )}

      {/* POST-PURCHASE JOURNEY GRID */}
      {selectedCategory === "All Templates" && postPurchaseTemplates.length > 0 && (
        <section className="space-y-md pt-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Post-Purchase Journey</h3>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Metrics scale: 1-10 slide</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postPurchaseTemplates.map(tmpl => (
              <div 
                key={tmpl.id}
                className="group bg-white border border-slate-200 hover:border-primary rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full"
              >
                
                {/* Thumbnail image header */}
                <div className="h-44 bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100 p-0">
                  <img 
                    src={tmpl.imageUrl} 
                    alt={tmpl.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Body Content */}
                <div className="p-md flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1 gap-2">
                    <h4 className="text-md font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">
                      {tmpl.title}
                    </h4>
                    <div className="flex items-center text-amber-500 shrink-0 font-bold text-xs gap-0.5">
                      <Star size={14} fill="currentColor" />
                      <span>{tmpl.rating}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-grow">
                    {tmpl.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-md border-t border-slate-100">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[11px] font-bold">{tmpl.timeToComplete} min</span>
                    </div>

                    <button 
                      onClick={() => handleSelectTemplate(tmpl)}
                      className="bg-primary hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm active:scale-95"
                    >
                      Use Template
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {/* CREATE CUSTOM BLANK CARD */}
            <div 
              onClick={onStartCreateCustom}
              className="group border-2 border-dashed border-slate-300 rounded-xl hover:border-primary hover:bg-blue-50/20 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center p-lg min-h-[310px] text-center"
            >
              <div className="w-14 h-14 rounded-full bg-slate-100 text-primary flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 duration-200">
                <Plus size={28} />
              </div>
              <h4 className="text-md font-bold text-slate-800 mt-md">Create Custom</h4>
              <p className="text-xs text-slate-400 max-w-xs mt-1 leading-relaxed">
                Start with a blank workspace canvas to build your own custom logical survey parameters from scratch.
              </p>
            </div>

          </div>
        </section>
      )}

      {/* FILTERED CATEGORIES INDIVIDUAL VIEW */}
      {selectedCategory !== "All Templates" && (
        <section className="space-y-md">
          <h3 className="text-lg font-bold text-slate-900 tracking-tight">{selectedCategory} Catalog</h3>
          {visibleTemplates.length === 0 ? (
            <div className="text-center p-xl border border-slate-100 bg-slate-50 rounded-xl text-slate-400 text-xs font-medium">
              No matching templates found for this search. Clear filter to look again.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTemplates.map(tmpl => (
                <div 
                  key={tmpl.id}
                  className="group bg-white border border-slate-200 hover:border-primary rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col h-full"
                >
                  <div className="h-44 bg-slate-50 relative overflow-hidden border-b border-slate-100">
                    <img 
                      src={tmpl.imageUrl} 
                      alt={tmpl.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-md flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1 gap-2">
                      <h4 className="text-md font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors">{tmpl.title}</h4>
                      <div className="flex items-center text-amber-500 shrink-0 font-bold text-xs gap-0.5">
                        <Star size={14} fill="currentColor" />
                        <span>{tmpl.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6 flex-grow">{tmpl.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-md border-t border-slate-100">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Clock size={14} />
                        <span className="text-[11px] font-bold">{tmpl.timeToComplete} min</span>
                      </div>
                      <button 
                        onClick={() => handleSelectTemplate(tmpl)}
                        className="bg-primary hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm active:scale-95"
                      >
                        Use Template
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  );
}
