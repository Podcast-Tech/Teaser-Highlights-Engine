import React, { useState } from 'react';
import { Mic, Sparkles, AlertCircle, FileText, Upload, Trash2, Captions, Copy, Check, MessageSquarePlus, Sun, Moon } from 'lucide-react';
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
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 border-b transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img 
               src="https://dpc.org.ae/-/media/podcastssponser/podcastsponsor14/mediacast_logo_black/poddster-transparent.png?h=262&w=952&hash=624814403E551C5CBDFDFDB6B74227F7" 
               alt="Poddster" 
               className={`h-8 w-auto ${isDark ? 'brightness-0 invert' : ''}`}
             />
          </div>
          
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-all duration-300 ${isDark ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-gray-100 text-slate-700 hover:bg-gray-200'}`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Intro */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>Teaser & Highlights Engine</h2>
          <p className={`${isDark ? 'text-slate-400' : 'text-gray-600'}`}>
            Upload your podcast SRT subtitle file. Our AI producer will identify the perfect 
            "Rollercoaster Teaser" structure and 5 viral-ready clips with exact timestamps.
          </p>
        </div>

        {/* Input Section */}
        <div className={`rounded-2xl border shadow-xl overflow-hidden transition-all focus-within:ring-2 focus-within:ring-[#fe003e]/50 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
          <div className={`p-4 border-b flex justify-between items-center ${isDark ? 'border-slate-800 bg-slate-800/50' : 'border-gray-200 bg-gray-50'}`}>
            <div className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
              <Captions className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-[#fe003e]'}`} />
              <span>Transcript Input</span>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>.SRT Format Required</span>
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
                    ? 'border-[#fe003e] bg-[#fe003e]/10' 
                    : isDark 
                      ? 'border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-[#fe003e]/50'
                      : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#fe003e]/50'
                  }
                `}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className={`
                    p-4 rounded-full mb-4 transition-transform duration-300
                    ${isDragging 
                      ? 'scale-110 bg-[#fe003e]/20' 
                      : isDark ? 'bg-slate-800 group-hover:scale-110' : 'bg-white shadow-sm group-hover:scale-110'
                    }
                  `}>
                    <Upload className={`w-8 h-8 ${isDragging ? 'text-[#fe003e]' : isDark ? 'text-slate-400 group-hover:text-[#fe003e]' : 'text-gray-400 group-hover:text-[#fe003e]'}`} />
                  </div>
                  <p className={`mb-2 text-sm ${isDark ? 'text-slate-300' : 'text-gray-600'}`}>
                    <span className={`font-semibold ${isDark ? 'text-indigo-400' : 'text-[#fe003e]'}`}>Click to upload</span> or drag and drop
                  </p>
                  <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>SRT files only</p>
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
                 <div className={`flex items-center justify-between border rounded-lg p-4 ${isDark ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-[#fe003e]/5 border-[#fe003e]/20'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${isDark ? 'bg-indigo-500/20' : 'bg-[#fe003e]/10'}`}>
                        <Captions className={`w-5 h-5 ${isDark ? 'text-indigo-400' : 'text-[#fe003e]'}`} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{fileName}</h3>
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>{transcript.length.toLocaleString()} characters</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleClear}
                      className="p-2 hover:bg-red-500/10 rounded-lg group transition-colors"
                      title="Remove file"
                    >
                      <Trash2 className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
                    </button>
                 </div>
                 
                 <div className="relative">
                   <div className={`absolute top-0 left-0 right-0 h-4 bg-gradient-to-b pointer-events-none rounded-t-lg ${isDark ? 'from-slate-950/50' : 'from-gray-100/50'} to-transparent`} />
                   <textarea
                      className={`w-full h-48 p-4 rounded-lg text-xs font-mono border focus:outline-none resize-none ${isDark ? 'bg-slate-950/50 text-slate-400 border-slate-800' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                      value={transcript}
                      readOnly
                      placeholder="Transcript preview..."
                    />
                    <div className={`absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t pointer-events-none rounded-b-lg ${isDark ? 'from-slate-950/50' : 'from-gray-100/50'} to-transparent`} />
                 </div>

                 {/* Specific Instructions Input */}
                 <div className={`mt-4 pt-4 border-t ${isDark ? 'border-slate-800' : 'border-gray-200'}`}>
                    <div className={`flex items-center gap-2 mb-2 text-sm font-medium ${isDark ? 'text-slate-300' : 'text-gray-700'}`}>
                        <MessageSquarePlus className="w-4 h-4 text-emerald-500" />
                        Producer Notes / Specific Instructions <span className={`text-xs font-normal ${isDark ? 'text-slate-500' : 'text-gray-500'}`}>(Optional)</span>
                    </div>
                    <textarea
                        className={`w-full h-24 p-3 rounded-lg text-sm border focus:ring-1 focus:outline-none transition-all ${
                          isDark 
                            ? 'bg-slate-950 text-slate-200 border-slate-700 focus:border-indigo-500 focus:ring-indigo-500 placeholder:text-slate-600' 
                            : 'bg-white text-gray-800 border-gray-300 focus:border-[#fe003e] focus:ring-[#fe003e] placeholder:text-gray-400'
                        }`}
                        placeholder="e.g. Please include the story about the coffee shop incident in the teaser, or find a clip about 'productivity hacks'..."
                        value={userInstructions}
                        onChange={(e) => setUserInstructions(e.target.value)}
                    />
                 </div>
              </div>
            )}
          </div>

          <div className={`p-4 border-t flex justify-end ${isDark ? 'bg-slate-800/50 border-slate-800' : 'bg-gray-50 border-gray-200'}`}>
            <button
              onClick={handleAnalyze}
              disabled={!transcript.trim() || status === AnalysisStatus.ANALYZING}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all
                ${!transcript.trim() || status === AnalysisStatus.ANALYZING
                  ? isDark ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#fe003e] hover:bg-[#d60033] text-white shadow-lg shadow-[#fe003e]/25 hover:shadow-[#fe003e]/40 active:transform active:scale-95'}
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
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && status === AnalysisStatus.COMPLETE && (
          <div className="animate-fade-in-up">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
              <div className={`p-1 rounded-xl inline-flex border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200'}`}>
                <button
                  onClick={() => setActiveTab('teaser')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'teaser' 
                      ? 'bg-[#fe003e] text-white shadow-md' 
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Rollercoaster Teaser
                </button>
                <button
                  onClick={() => setActiveTab('reels')}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === 'reels' 
                      ? 'bg-[#fe003e] text-white shadow-md' 
                      : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
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
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' 
                    : isDark 
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied to Clipboard!' : 'Copy Producer Report'}
              </button>
            </div>

            <div className="transition-all duration-300">
              {activeTab === 'teaser' ? (
                <TeaserDisplay segments={result.teaser} theme={theme} />
              ) : (
                <ReelsDisplay reels={result.reels} theme={theme} />
              )}
            </div>
            
            <div className="mt-8 text-center">
                <p className={`text-xs ${isDark ? 'text-slate-600' : 'text-gray-400'}`}>
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