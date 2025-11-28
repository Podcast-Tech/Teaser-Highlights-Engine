import React from 'react';
import { ReelClip } from '../types';
import { Video, Star, Quote, Clock, Film } from 'lucide-react';

interface Props {
  reels: ReelClip[];
  theme: 'light' | 'dark';
}

const ReelsDisplay: React.FC<Props> = ({ reels, theme }) => {
  const isDark = theme === 'dark';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <Video className="text-[#fe003e]" />
          Viral Short Clips
        </h2>
        <span className={`text-xs font-mono px-2 py-1 rounded border ${isDark ? 'text-pink-400 bg-pink-950/30 border-pink-500/20' : 'text-[#fe003e] bg-[#fe003e]/10 border-[#fe003e]/20'}`}>
          5 Clips Identified
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reels.map((reel) => (
          <div 
            key={reel.reelNumber} 
            className={`group rounded-xl border overflow-hidden transition-all duration-300 shadow-lg ${isDark ? 'bg-slate-800 border-slate-700 hover:border-[#fe003e]/50' : 'bg-white border-gray-200 hover:border-[#fe003e]/50'}`}
          >
            {/* Header */}
            <div className={`p-4 flex justify-between items-start border-b ${isDark ? 'bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700' : 'bg-gray-50 border-gray-100'}`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#fe003e] font-bold text-white shadow-lg shadow-[#fe003e]/20">
                  {reel.reelNumber}
                </div>
                <div>
                   <div className={`font-mono text-xs mb-0.5 uppercase tracking-wide opacity-80 ${isDark ? 'text-pink-300' : 'text-gray-500'}`}>Timestamp Range</div>
                   <div className={`font-mono text-sm font-bold tracking-wider flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {reel.startTime} - {reel.endTime}
                   </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded border ${isDark ? 'text-yellow-400 bg-yellow-950/30 border-yellow-500/20' : 'text-yellow-700 bg-yellow-50 border-yellow-200'}`}>
                  <Star className="w-3 h-3 fill-current" />
                  Excellent Quality
                </div>
                <div className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded ${isDark ? 'text-slate-300 bg-slate-700/50' : 'text-gray-600 bg-gray-200/50'}`}>
                  <Clock className="w-3 h-3" />
                  {reel.duration}
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Analysis Column */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Producer's Notes</h4>
                  <div className={`p-3 rounded-lg border text-sm leading-relaxed ${isDark ? 'bg-pink-950/10 border-pink-500/20 text-pink-100' : 'bg-[#fe003e]/5 border-[#fe003e]/20 text-gray-800'}`}>
                    {reel.notes}
                  </div>
                </div>
                
                {reel.bRoll && (
                  <div>
                    <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                      <Film className="w-3 h-3" /> Suggested B-Roll
                    </h4>
                    <div className={`p-2 rounded border text-xs italic ${isDark ? 'bg-amber-950/10 border-amber-500/20 text-amber-100' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                      "Artlist: {reel.bRoll}"
                    </div>
                  </div>
                )}
              </div>

              {/* Content Column */}
              <div className="lg:col-span-2 space-y-3">
                 <h4 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Clip Content</h4>
                 <div className="relative">
                    <Quote className={`absolute -top-2 -left-2 w-6 h-6 transform -scale-x-100 ${isDark ? 'text-slate-700' : 'text-gray-200'}`} />
                    <p className={`text-sm leading-relaxed p-4 rounded-lg border pl-6 ${isDark ? 'bg-slate-900/30 border-slate-700/50 text-slate-300' : 'bg-gray-50 border-gray-100 text-gray-700'}`}>
                      {reel.contentQuote}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className={`rounded p-2 border ${isDark ? 'bg-slate-900/50 border-slate-700/30' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>Start Word</span>
                      <span className={`text-xs font-mono truncate block ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>"{reel.startWord}..."</span>
                    </div>
                    <div className={`rounded p-2 border ${isDark ? 'bg-slate-900/50 border-slate-700/30' : 'bg-gray-50 border-gray-200'}`}>
                      <span className={`block text-[10px] uppercase font-bold mb-1 ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>End Word</span>
                      <span className={`text-xs font-mono truncate block ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>"...{reel.endWord}"</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReelsDisplay;