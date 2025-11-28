import React from 'react';
import { TeaserSegment } from '../types';
import { Clock, Quote, MoveRight, ArrowDownRight, ArrowUpRight, Minus, AlertCircle, Film } from 'lucide-react';

interface Props {
  segments: TeaserSegment[];
}

const PhaseIcon = ({ phase }: { phase: string }) => {
  if (phase.includes('Incline')) return <ArrowUpRight className="text-yellow-400 w-5 h-5" />;
  if (phase.includes('Drop')) return <ArrowDownRight className="text-red-400 w-5 h-5" />;
  if (phase.includes('Ride')) return <Minus className="text-blue-400 w-5 h-5" />;
  if (phase.includes('End')) return <AlertCircle className="text-purple-400 w-5 h-5" />;
  return <Clock className="w-5 h-5" />;
};

const TeaserDisplay: React.FC<Props> = ({ segments }) => {
  // Calculate total duration roughly
  const totalDuration = segments.reduce((acc, curr) => {
    const dur = parseInt(curr.duration) || 0;
    return acc + dur;
  }, 0);

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
      <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 backdrop-blur-sm">
        <div>
           <h2 className="text-xl font-bold text-white flex items-center gap-2">
            🎢 The Rollercoaster Teaser
          </h2>
          <p className="text-slate-400 text-sm mt-1">Structured 4-part narrative arc</p>
        </div>
       
        <div className="px-3 py-1 bg-slate-700 rounded-full text-xs font-mono text-slate-300">
          Est. Duration: ~{totalDuration > 0 ? totalDuration : '30-45'}s
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 uppercase font-semibold text-xs">
            <tr>
              <th className="px-6 py-4">Phase</th>
              <th className="px-6 py-4">Timing & Duration</th>
              <th className="px-6 py-4">Content & Visuals</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {segments.map((segment, idx) => (
              <tr key={idx} className="hover:bg-slate-700/20 transition-colors">
                <td className="px-6 py-4 align-top w-48">
                  <div className="flex items-center gap-2 font-medium text-white mb-1">
                    <PhaseIcon phase={segment.phase} />
                    {segment.phase}
                  </div>
                </td>
                <td className="px-6 py-4 align-top font-mono text-xs w-40 text-indigo-300">
                  <div className="flex flex-col gap-1">
                    <span className="opacity-70">START</span>
                    <span className="font-bold">{segment.startTime}</span>
                    <span className="opacity-70 mt-2">END</span>
                    <span className="font-bold">{segment.endTime}</span>
                    <div className="mt-2 inline-flex items-center gap-1 bg-indigo-950/50 text-indigo-200 px-2 py-1 rounded w-fit">
                      <Clock className="w-3 h-3" />
                      {segment.duration}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 align-top">
                  <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 mb-2">
                    <Quote className="w-3 h-3 text-slate-600 mb-1" />
                    <p className="text-slate-200 italic leading-relaxed">"{segment.contentQuote}"</p>
                  </div>
                  
                  {segment.bRoll && (
                    <div className="mt-2 flex items-start gap-2 text-xs text-amber-200 bg-amber-950/20 p-2 rounded border border-amber-900/30">
                      <Film className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-bold uppercase opacity-70 block text-[10px] mb-0.5">Artlist B-Roll Suggestion</span>
                        "{segment.bRoll}"
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-4 text-xs mt-3">
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-950/30 px-2 py-1 rounded">
                      <span className="font-semibold text-emerald-500">IN:</span> "{segment.startWord}..."
                    </div>
                    <MoveRight className="w-3 h-3 text-slate-600" />
                    <div className="flex items-center gap-2 text-rose-400 bg-rose-950/30 px-2 py-1 rounded">
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