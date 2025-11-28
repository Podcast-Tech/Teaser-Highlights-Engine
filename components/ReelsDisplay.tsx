import React from 'react';
import { ReelClip } from '../types';
import { Video, Star, Quote, Clock, Film } from 'lucide-react';

interface Props {
  reels: ReelClip[];
}

const ReelsDisplay: React.FC<Props> = ({ reels }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Video className="text-pink-500" />
          Viral Short Clips
        </h2>
        <span className="text-xs font-mono text-pink-400 bg-pink-950/30 px-2 py-1 rounded border border-pink-500/20">
          5 Clips Identified
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {reels.map((reel) => (
          <div 
            key={reel.reelNumber} 
            className="group bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-pink-500/50 transition-all duration-300 shadow-lg"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 flex justify-between items-start border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-pink-600 font-bold text-white shadow-lg shadow-pink-900/20">
                  {reel.reelNumber}
                </div>
                <div>
                   <div className="font-mono text-xs text-pink-300 mb-0.5 uppercase tracking-wide opacity-80">Timestamp Range</div>
                   <div className="font-mono text-sm font-bold text-white tracking-wider flex items-center gap-2">
                    {reel.startTime} - {reel.endTime}
                   </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-yellow-400 text-xs font-semibold bg-yellow-950/30 px-2 py-1 rounded border border-yellow-500/20">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  Excellent Quality
                </div>
                <div className="flex items-center gap-1 text-slate-300 text-xs font-mono bg-slate-700/50 px-2 py-1 rounded">
                  <Clock className="w-3 h-3" />
                  {reel.duration}
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Analysis Column */}
              <div className="lg:col-span-1 space-y-4">
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Producer's Notes</h4>
                  <div className="p-3 bg-pink-950/10 rounded-lg border border-pink-500/20 text-sm text-pink-100 leading-relaxed">
                    {reel.notes}
                  </div>
                </div>
                
                {reel.bRoll && (
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Film className="w-3 h-3" /> Suggested B-Roll
                    </h4>
                    <div className="p-2 bg-amber-950/10 rounded border border-amber-500/20 text-xs text-amber-100 italic">
                      "Artlist: {reel.bRoll}"
                    </div>
                  </div>
                )}
              </div>

              {/* Content Column */}
              <div className="lg:col-span-2 space-y-3">
                 <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clip Content</h4>
                 <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-slate-700 transform -scale-x-100" />
                    <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/30 p-4 rounded-lg border border-slate-700/50 pl-6">
                      {reel.contentQuote}
                    </p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 mt-2">
                    <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Start Word</span>
                      <span className="text-xs text-slate-200 font-mono truncate block">"{reel.startWord}..."</span>
                    </div>
                    <div className="bg-slate-900/50 rounded p-2 border border-slate-700/30">
                      <span className="block text-[10px] text-slate-500 uppercase font-bold mb-1">End Word</span>
                      <span className="text-xs text-slate-200 font-mono truncate block">"...{reel.endWord}"</span>
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