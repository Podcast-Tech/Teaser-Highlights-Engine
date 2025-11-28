import React from 'react';
import { TeaserSegment } from '../types';
import { Clock, Quote, MoveRight, ArrowDownRight, ArrowUpRight, Minus, AlertCircle, Film } from 'lucide-react';

interface Props {
  segments: TeaserSegment[];
  theme: 'light' | 'dark';
}

const PhaseIcon = ({ phase }: { phase: string }) => {
  if (phase.includes('Incline')) return <ArrowUpRight className="text-yellow-400 w-5 h-5" />;
  if (phase.includes('Drop')) return <ArrowDownRight className="text-red-400 w-5 h-5" />;
  if (phase.includes('Ride')) return <Minus className="text-blue-400 w-5 h-5" />;
  if (phase.includes('End')) return <AlertCircle className="text-purple-400 w-5 h-5" />;
  return <Clock className="w-5 h-5" />;
};

const TeaserDisplay: React.FC<Props> = ({ segments, theme }) => {
  // Calculate total duration roughly
  const totalDuration = segments.reduce((acc, curr) => {
    const dur = parseInt(curr.duration) || 0;
    return acc + dur;
  }, 0);

  const isDark = theme === 'dark';

  return (
    <div className={`rounded-xl border overflow-hidden shadow-xl transition-colors ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
      <div className={`p-6 border-b flex justify-between items-center backdrop-blur-sm ${isDark ? 'border-slate-700 bg-slate-800/50' : 'border-gray-100 bg-white/50'}`}>
        <div>
           <h2 className={`text-xl font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            🎢 The Rollercoaster Teaser
          </h2>
          <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Structured 4-part narrative arc</p>
        </div>
       
        <div className={`px-3 py-1 rounded-full text-xs font-mono ${isDark ? 'bg-slate-700 text-slate-300' : 'bg-gray-100 text-gray-600'}`}>
          Est. Duration: ~{totalDuration > 0 ? totalDuration : '30-45'}s
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full text-left text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
          <thead className={`uppercase font-semibold text-xs ${isDark ? 'bg-slate-900/50 text-slate-400' : 'bg-gray-50 text-gray-500'}`}>
            <tr>
              <th className="px-6 py-4">Phase</th>
              <th className="px-6 py-4">Timing & Duration</th>
              <th className="px-6 py-4">Content & Visuals</th>
            </tr>
          </thead>
          <tbody className={`divide-y ${isDark ? 'divide-slate-700/50' : 'divide-gray-100'}`}>
            {segments.map((segment, idx) => (
              <tr key={idx} className={`transition-colors ${isDark ? 'hover:bg-slate-700/20' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4 align-top w-48">
                  <div className={`flex items-center gap-2 font-medium mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <PhaseIcon phase={segment.phase} />
                    {segment.phase}
                  </div>
                </td>
                <td className={`px-6 py-4 align-top font-mono text-xs w-40 ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70">START</span>
                    <span className="font-bold">{segment.startTime}</span>
                    <span className="opacity-70 mt-2">END</span>
                    <span className="font-bold">{segment.endTime}</span>
                    <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded w-fit ${isDark ? 'bg-indigo-950/50 text-indigo-200' : 'bg-indigo-50 text-indigo-700'}`}>
                      <Clock className="w-3 h-3" />
                      {segment.duration}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className={`p-3 rounded-lg border mb-2 ${isDark ? 'bg-slate-900/50 border-slate-700/50' : 'bg-gray-50 border-gray-200'}`}>
                    <Quote className={`w-3 h-3 mb-1 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
                    <p className={`italic leading-relaxed ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>"{segment.contentQuote}"</p>
                  </div>
                  
                  {segment.bRoll && (
                    <div className={`mt-2 flex items-start gap-2 text-xs p-2 rounded border ${isDark ? 'text-amber-200 bg-amber-950/20 border-amber-900/30' : 'text-amber-800 bg-amber-50 border-amber-200'}`}>
                      <Film className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold uppercase opacity-70 block text-[10px] mb-0.5">Artlist B-Roll Suggestion</span>
                        "{segment.bRoll}"
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs mt-3">
                    <div className={`flex items-center gap-2 px-2 py-1 rounded ${isDark ? 'bg-emerald-950/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                      <span className="font-semibold text-emerald-500">IN:</span> "{segment.startWord}..."
                    </div>
                    <MoveRight className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-gray-400'}`} />
                    <div className={`flex items-center gap-2 px-2 py-1 rounded ${isDark ? 'bg-rose-950/30 text-rose-400' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                      <span className="font-semibold text-rose-500">OUT:</span> "...{segment.endWord}"
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TeaserDisplay;