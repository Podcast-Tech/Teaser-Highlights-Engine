import React, { useState } from 'react';
import { Mic, Sparkles, AlertCircle, FileText, Upload, Trash2, Captions, Copy, Check, MessageSquarePlus } from 'lucide-react';
import { analyzeTranscript } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import TeaserDisplay from './components/TeaserDisplay';
import ReelsDisplay from './components/ReelsDisplay';

function App() {
  const [transcript, setTranscript] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [userInstructions, setUserInstructions] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'teaser' | 'reels'>('teaser');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);

  const processFile = (file: File) => {
    if (!file.name.toLowerCase().endsWith('.srt')) {
      setError("Please upload a valid .srt file");
      return;
    }
    
    setError(null);
    setFileName(file.name);
    setResult(null);
    setStatus(AnalysisStatus.IDLE);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setTranscript(text);
      }
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = () => {
    setTranscript('');
    setFileName(null);
    setResult(null);
    setError(null);
    setUserInstructions('');
    setStatus(AnalysisStatus.IDLE);
  };

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeTranscript(transcript, userInstructions);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETE);
    } catch (err: any) {
      setError(err.message || "Failed to analyze transcript");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const handleCopyReport = () => {
    if (!result) return;
    
    let report = `🎙️ PODCUT PRO AI REPORT\nFile: ${fileName || 'Transcript'}\n\n`;
    
    report += "🎢 ROLLERCOASTER TEASER STRUCTURE\n";
    report += "=================================\n";
    result.teaser.forEach(t => {
      report += `[${t.phase}] ${t.startTime} - ${t.endTime} (${t.duration})\n`;
      if (t.bRoll) report += `🎥 B-ROLL: ${t.bRoll}\n`;
      report += `QUOTE: "${t.contentQuote}"\n\n`;
    });
    
    report += "\n🎬 VIRAL REELS SELECTION (TOP 5)\n";
    report += "================================\n";
    result.reels.forEach(r => {
      report += `REEL #${r.reelNumber} | ${r.startTime} - ${r.endTime} (${r.duration})\n`;
      report += `WHY: ${r.notes}\n`;
      if (r.bRoll) report += `🎥 B-ROLL: ${r.bRoll}\n`;
      report += `QUOTE: "${r.contentQuote}"\n\n`;
    });
  
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img 
               src="https://cdn.prod.website-files.com/67cae3a2f510ecb679236028/67cae3a2f510ecb679236301_poddster-logo.svg" 
               alt="Poddster" 
               className="h-8 w-auto" 
             />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Teaser & Highlights Engine</h2>
          <p className="text-slate-400">
            Upload your podcast SRT subtitle file. Our AI producer will identify the perfect 
            "Rollercoaster Teaser" structure and 5 viral-ready clips with exact timestamps.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
          <div className="p-4 border-b border-slate-800 bg-slate-800/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Captions className="w-4 h-4 text-indigo-400" />
              <span>Transcript Input</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">.SRT Format Required</span>
          </div>
          
          <div className="p-6">
            {!transcript ? (
              <label 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                  flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all group
                  ${isDragging 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-indigo-500/50'
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className={`
                    p-4 rounded-full mb-4 transition-transform duration-300
                    ${isDragging ? 'scale-110 bg-indigo-500/20' : 'bg-slate-800 group-hover:scale-110'}
                  `}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                  </div>
                  <p className="mb-2 text-sm text-slate-300">
                    <span className="font-semibold text-indigo-400">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-slate-500">SRT files only</p>
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".srt" 
                  onChange={handleFileUpload} 
                />
              </label>
            ) : (
              <div className="space-y-4">
                 <div className="flex items-center justify-between bg-indigo-950/30 border border-indigo-500/20 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-500/20 p-2 rounded-lg">
                        <Captions className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{fileName}</h3>
                        <p className="text-xs text-slate-400">{transcript.length.toLocaleString()} characters</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleClear}
                      className="p-2 hover:bg-red-500/10 rounded-lg group transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-400" />
                    </button>
                 </div>
                 
                 <div className="relative">
                   <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-slate-950/50 to-transparent pointer-events-none rounded-t-lg" />
                   <textarea
                      className="w-full h-48 bg-slate-950/50 p-4 rounded-lg text-xs font-mono text-slate-400 border border-slate-800 focus:outline-none resize-none"
                      value={transcript}
                      readOnly
                      placeholder="Transcript preview..."
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-slate-950/50 to-transparent pointer-events-none rounded-b-lg" />
                 </div>

                 {/* Specific Instructions Input */}
                 <div className="mt-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 mb-2 text-sm font-medium text-slate-300">
                        <MessageSquarePlus className="w-4 h-4 text-emerald-400" />
                        Producer Notes / Specific Instructions <span className="text-slate-500 text-xs font-normal">(Optional)</span>
                    </div>
                    <textarea
                        className="w-full h-24 bg-slate-950 p-3 rounded-lg text-sm text-slate-200 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-slate-600"
                        placeholder="e.g. Please include the story about the coffee shop incident in the teaser, or find a clip about 'productivity hacks'..."
                        value={userInstructions}
                        onChange={(e) => setUserInstructions(e.target.value)}
                    />
                 </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-800/50 border-t border-slate-800 flex justify-end">
            <button
              onClick={handleAnalyze}
              disabled={!transcript.trim() || status === AnalysisStatus.ANALYZING}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all
                ${!transcript.trim() || status === AnalysisStatus.ANALYZING
                  ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 active:transform active:scale-95'}
              `}
            >
              {status === AnalysisStatus.ANALYZING ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Analyzing Narrative Arc...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Producer Cut
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error State */}
        {status === AnalysisStatus.ERROR && (
          <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && status === AnalysisStatus.COMPLETE && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className="bg-slate-900 p-1 rounded-xl inline-flex border border-slate-800">
                <button
                  onClick={() => setActiveTab('teaser')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'teaser' 
                      ? 'bg-indigo-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Rollercoaster Teaser
                </button>
                <button
                  onClick={() => setActiveTab('reels')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'reels' 
                      ? 'bg-pink-600 text-white shadow-md' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Viral Reels (5)
                </button>
              </div>

              <button
                onClick={handleCopyReport}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all
                  ${copied 
                    ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Producer Report'}
              </button>
            </div>

            <div className="transition-all duration-300">
              {activeTab === 'teaser' ? (
                <TeaserDisplay segments={result.teaser} />
              ) : (
                <ReelsDisplay reels={result.reels} />
              )}
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-slate-600 text-xs">
                    *Timestamps are extracted directly from your SRT file.
                </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;