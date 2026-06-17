import React, { useState } from "react";
import { 
  BarChart, 
  TrendingUp, 
  Clock, 
  Users, 
  Star, 
  MessageSquare, 
  ChevronRight, 
  Download, 
  Calendar,
  Sparkles,
  ArrowDownToLine,
  Filter
} from "lucide-react";
import { Campaign, FeedbackComment } from "../types";
import { INITIAL_FEEDBACK_COMMENTS } from "../data";

interface AnalyticsViewProps {
  campaigns: Campaign[];
}

export default function AnalyticsView({ campaigns }: AnalyticsViewProps) {
  // Allow picking which campaign to inspect in Analytics
  const eligibleCampaigns = campaigns.filter(c => c.responsesCount > 0);
  const [selectedCampaignId, setSelectedCampaignId] = useState(
    eligibleCampaigns[1]?.id || eligibleCampaigns[0]?.id || campaigns[0]?.id
  );

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  // Mock score trend data for the chart (Mon - Sun)
  const scoreTrends = [
    { day: "Mon", score: 4.6 },
    { day: "Tue", score: 4.5 },
    { day: "Wed", score: 4.8 },
    { day: "Thu", score: 4.72 },
    { day: "Fri", score: 4.9 },
    { day: "Sat", score: 4.85 },
    { day: "Sun", score: 4.82 }
  ];

  // Helper to convert rating score to starry visuals
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-amber-500">
        {[1, 2, 3, 4, 5].map(val => (
          <Star 
            key={val} 
            size={14} 
            fill={val <= rating ? "currentColor" : "none"} 
            className={val <= rating ? "text-amber-500" : "text-slate-200"}
          />
        ))}
      </div>
    );
  };

  // Convert SVG coordinate based on rating value
  // min rating is 4.4, max is 5.0
  const getSvgCoordinates = (index: number, score: number) => {
    const xStep = 320 / 6;
    const x = index * xStep + 30;
    
    // Normalize y coordinate: 4.4 score is bottom (100px), 5.0 is top (15px)
    const yRange = 85; 
    const norm = (score - 4.4) / (5.0 - 4.4);
    const y = 100 - (norm * yRange);
    return { x, y };
  };

  // Generate path coordinates for the trend line
  const trendPoints = scoreTrends.map((t, idx) => getSvgCoordinates(idx, t.score));
  const linePath = trendPoints.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  // Generate grid coordinates
  const yGrids = [4.4, 4.6, 4.8, 5.0];

  return (
    <div className="space-y-lg animate-fade-in">
      
      {/* Target selector and Export actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-md">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            <span>Campaign Analytics</span>
            <span>•</span>
            <span className="text-[#0053db]">Live Feedback insights</span>
          </div>
          
          <div className="flex items-center gap-2 mt-1.5">
            <Filter size={16} className="text-slate-400" />
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="px-2 py-1 border border-slate-200 focus:border-primary outline-none text-md font-bold text-slate-900 bg-transparent rounded-lg"
            >
              {campaigns.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button 
          type="button" 
          onClick={() => alert("Simulated CSV metrics download start...")}
          className="flex items-center gap-2 bg-[#2563eb] text-white hover:bg-blue-700 transition px-lg py-2.5 rounded-lg text-xs font-bold shadow-sm active:scale-95 duration-100 self-start"
        >
          <ArrowDownToLine size={14} />
          Export Insights CSV
        </button>
      </div>

      {/* Main Grid: Statistics + Score trends */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        
        {/* Metric 1: CSAT rating Display */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-lg shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">CSAT Rating</p>
          <div className="flex items-end gap-1.5 mt-2">
            <h4 className="text-4xl font-display-lg font-bold text-slate-900 leading-none">
              {selectedCampaign.csatScore || "4.8"}
            </h4>
            <span className="text-sm text-slate-400 font-medium mb-1 font-sans">/ 5.0</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-green-600 font-bold mt-3">
            <span className="inline-block w-2-h-2 bg-green-500 rounded-full animate-pulse shrink-0"></span>
            <span>92% positive satisfaction threshold</span>
          </div>
        </div>

        {/* Metric 2: Responses Count Display */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-lg shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Responses</p>
          <div className="flex items-end gap-1.5 mt-2">
            <h4 className="text-4xl font-display-lg font-bold text-slate-900 leading-none">
              {selectedCampaign.responsesCount > 0 ? selectedCampaign.responsesCount.toLocaleString() : "1,240"}
            </h4>
            <span className="text-xs text-slate-400 font-medium mb-1 shrink-0">completed entries</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#0053db] font-semibold mt-3">
            <Users size={14} />
            <span>Target audience: {selectedCampaign.targetAudience}</span>
          </div>
        </div>

        {/* Metric 3: Timing complete */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-lg shadow-sm">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion rate</p>
          <div className="flex items-end gap-1.5 mt-2">
            <h4 className="text-4xl font-display-lg font-bold text-slate-900 leading-none">84.2%</h4>
            <span className="text-xs text-slate-400 font-medium mb-1 shrink-0">standard avg</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold mt-3">
            <Clock size={14} />
            <span>Avg session response time: ~1.5 min</span>
          </div>
        </div>

      </div>

      {/* Row 2: Score Trend Chart & Sentiment Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        
        {/* Score Trend SVG Drawing (2 columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 p-lg rounded-xl shadow-sm space-y-md">
          <div className="flex justify-between items-center border-b border-slate-55 pb-2">
            <h4 className="text-sm font-bold text-slate-800">Score Trend</h4>
            <span className="text-[11px] font-bold text-[#003ea8] bg-blue-50 px-2 py-0.5 rounded-full">Last 30 Days</span>
          </div>

          {/* SVG line graph */}
          <div className="relative w-full overflow-x-auto py-sm">
            <svg viewBox="0 0 380 140" className="w-full min-w-[320px] select-none h-[180px]">
              
              {/* Grid Y Horizontal lines */}
              {yGrids.map(grid => {
                const coord = getSvgCoordinates(0, grid);
                return (
                  <g key={grid}>
                    <line x1="30" y1={coord.y} x2="350" y2={coord.y} stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3" />
                    <text x="10" y={coord.y + 3} className="text-[8px] fill-slate-400 font-extrabold">{grid}</text>
                  </g>
                );
              })}

              {/* Grid X Vertical lines & Labels */}
              {scoreTrends.map((t, idx) => {
                const coord = getSvgCoordinates(idx, t.score);
                return (
                  <g key={idx}>
                    <line x1={coord.x} y1="110" x2={coord.x} y2="15" stroke="#f8fafc" strokeWidth="1" />
                    <text x={coord.x - 7} y="130" className="text-[9px] fill-slate-400 font-bold">{t.day}</text>
                  </g>
                );
              })}

              {/* Glow Area Under Path */}
              <path 
                d={`${linePath} L 350 110 L 30 110 Z`} 
                fill="url(#trend-gradient)" 
                opacity="0.1" 
              />

              {/* The Trend Line */}
              <path 
                d={linePath} 
                className="stroke-primary" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                fill="none" 
              />

              {/* Nodes dots plot */}
              {trendPoints.map((p, idx) => (
                <g key={idx}>
                  <circle cx={p.x} cy={p.y} r="5" stroke="white" strokeWidth="1.5" className="fill-primary" />
                </g>
              ))}

              {/* Color Gradient definitions */}
              <defs>
                <linearGradient id="trend-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Sentiment Analysis (1 column) */}
        <div className="bg-white border border-slate-200/80 p-lg rounded-xl shadow-sm space-y-md">
          <div className="border-b border-slate-50 pb-2">
            <h4 className="text-sm font-bold text-slate-800">Sentiment index Analysis</h4>
          </div>

          <div className="space-y-md">
            
            {/* Positive */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-emerald-700">Positive sentiments</span>
                <span>68%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-emerald-500 w-[68%] h-full rounded-full"></div>
              </div>
            </div>

            {/* Neutral */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-600">Neutral sentiments</span>
                <span>22%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-slate-400 w-[22%] h-full rounded-full"></div>
              </div>
            </div>

            {/* Negative */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-red-700">Negative friction reports</span>
                <span>10%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="bg-red-500 w-[10%] h-full rounded-full"></div>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-100/50 text-[10.5px] leading-relaxed text-slate-600 font-medium">
              💡 <strong>Contextual Insight:</strong> Feedback suggests "UI speed" and "Direct Zendesk Syncs" are most celebrated (generating rating averages over 4.8).
            </div>

          </div>
        </div>

      </div>

      {/* Recent Feedback items cards list */}
      <div className="space-y-md">
        <div className="flex justify-between items-center">
          <h4 className="text-sm font-bold text-slate-800">Recent Customer Feedback Remarks</h4>
          <span className="text-xs text-[#0053db] font-bold">Showing latest entries</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          {INITIAL_FEEDBACK_COMMENTS.map(item => (
            <div 
              key={item.id}
              className="bg-white border border-slate-200/80 rounded-xl p-lg shadow-xs space-y-md flex flex-col justify-between"
            >
              <div className="space-y-sm">
                <div className="flex items-center justify-between">
                  {/* User description */}
                  <div className="flex items-center gap-2">
                    {item.avatarUrl ? (
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                        <img 
                          src={item.avatarUrl} 
                          alt={item.userName} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs border border-slate-200 uppercase">
                        {item.userName.substr(0, 2)}
                      </div>
                    )}
                    <div>
                      <h5 className="text-xs font-bold text-slate-800 leading-none">{item.userName}</h5>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">{item.date}</span>
                    </div>
                  </div>

                  {/* Stars list */}
                  {renderStars(item.rating)}
                </div>

                <p className="text-xs font-medium text-slate-600 leading-relaxed italic antialiased">
                  "{item.comment}"
                </p>
              </div>

              {/* Tag links */}
              <div className="flex gap-1.5 flex-wrap pt-md border-t border-slate-100">
                {item.tags.map(t => (
                  <span 
                    key={t}
                    className="text-[9px] font-bold bg-[#6cf8bb]/15 border border-[#6cf8bb]/40 text-[#00714d] px-2 py-0.5 rounded-full shrink-0 uppercase tracking-wide"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
