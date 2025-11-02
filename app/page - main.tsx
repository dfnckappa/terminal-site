// app/page.tsx (or pages/index.tsx for older versions)

"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Head from 'next/head';

// --- 1. DATA STRUCTURE ---
const VIDEOS_DATA = [
  {
    title: "Intro to React Hooks",
    date: "2023-10-25",
    description: "A comprehensive guide to useState and useEffect.",
    youtubeId: "dQw4w9WgXcQ", 
    image: "/placeholder-react.jpg", 
    sources: ["Official React Docs", "Stack Overflow Q&A"],
  },
  {
    title: "Tailwind CSS Essentials",
    date: "2023-10-15",
    description: "Mastering utility-first CSS for rapid development.",
    youtubeId: "WlVd1c8t-wI", 
    image: "/placeholder-tailwind.jpg", 
    sources: ["Tailwind Docs", "Caleb Porzio's Tutorial"],
  },
].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); 

// --- 2. COMMAND LOGIC AND CONFIG ---
const COMMANDS = [
  { cmd: "list", description: "Shows all available commands." },
  { cmd: "videos", description: "Displays the list of videos." },
  { cmd: "clear", description: "Clears the terminal output." },
  { cmd: "load (title)", description: "Loads a specific video. E.g. 'load intro to react hooks'." },
  { cmd: "socials", description: "Shows social media links." }, // ✨ COMMAND RENAMED TO socials
];

const TERMINAL_PROMPT = '$';

// --- LOGO AND HELP TEXT CONSTANTS ---
const LOGO_TEXT = (
  <pre className="text-green-500 font-bold mb-4">
{`
  ████████╗  TERMINAL
  ╚══██╔══╝  SITE
     ██║    V1.0
     
  ✨ @gvision.lt
`}
  </pre>
);

const HELP_TEXT = (
  <>
    <p>Welcome to the minimal terminal website!</p>
    <p>Type **list** to see all commands.</p>
  </>
);

// --- 3. COMPONENTS (VideoModal remains unchanged) ---

interface VideoModalProps {
  video: typeof VIDEOS_DATA[0];
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={onClose}>
      <div 
        className="bg-gray-900 border border-green-400 text-white p-6 max-w-4xl w-full max-h-full overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()} 
      >
        <button onClick={onClose} className="float-right text-green-400 hover:text-green-200">
          [close]
        </button>
        <h2 className="text-3xl font-bold text-green-400 mb-2">{video.title}</h2>
        <p className="text-sm text-gray-400 mb-4">Posted: {new Date(video.date).toLocaleDateString()}</p>
        
        <div className="relative pt-[56.25%] mb-4">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        
        <p className="mb-4">{video.description}</p>
        
        <button
          onClick={() => setShowSources(!showSources)}
          className="px-3 py-1 bg-green-700 text-white hover:bg-green-600 transition-colors"
        >
          {showSources ? 'Hide Sources' : 'Show Sources'}
        </button>

        {showSources && (
          <div className="mt-4 p-3 border border-green-400 bg-gray-800">
            <h3 className="font-bold text-green-400 mb-2">Sources:</h3>
            <ul className="list-disc list-inside">
              {video.sources.map((source, index) => (
                <li key={index}>{source}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};


// --- 4. Main Terminal Component ---
export default function TerminalPage() {
  // Initialize history with LOGO_TEXT and HELP_TEXT
  const [history, setHistory] = useState<(string | React.ReactNode)[]>([
      LOGO_TEXT, 
      HELP_TEXT
  ]);
  const [command, setCommand] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [currentModalVideo, setCurrentModalVideo] = useState<typeof VIDEOS_DATA[0] | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Memoized function to calculate the auto-completion suggestion
  const tabSuggestion = useMemo(() => {
    const trimmedCmd = command.trim().toLowerCase();
    if (!trimmedCmd) return '';

    const parts = trimmedCmd.split(/\s+/);
    const baseCommand = parts[0];
    
    // 1. Command Auto-completion (for base commands)
    if (parts.length === 1) {
        // Find match in COMMANDS (must also check 'socials')
        const match = COMMANDS.find(c => c.cmd.startsWith(baseCommand));
        if (match) {
            return match.cmd.substring(baseCommand.length) + ' ';
        }
    }
    
    // 2. 'load' title auto-completion
    if (baseCommand === 'load' && parts.length > 1) {
        const titlePart = parts.slice(1).join(' ').trim();
        if (titlePart.length > 0) {
            const fullTitleMatch = VIDEOS_DATA.find(v => v.title.toLowerCase().startsWith(titlePart));
            if (fullTitleMatch) {
                const fullTitle = fullTitleMatch.title.toLowerCase();
                return fullTitle.substring(titlePart.length);
            }
        }
    }
    return '';
  }, [command]);


  useEffect(() => {
    if (!currentModalVideo && inputRef.current) {
      inputRef.current.focus();
    }
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history, currentModalVideo]);


  const formatVideoLine = (video: typeof VIDEOS_DATA[0]) => (
    <div key={video.title} className="flex flex-col md:flex-row md:space-x-4">
        <span className="text-green-400 font-bold">{video.title}</span> 
        <span className="text-gray-400">({new Date(video.date).toLocaleDateString()})</span>
    </div>
  );

  const executeCommand = useCallback((cmd: string) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return; 

    setCommandHistory(prev => [...prev, trimmedCmd]);
    
    setHistory(prev => [
        ...prev, 
        <span key={prev.length} className="text-green-400">
            {TERMINAL_PROMPT} {trimmedCmd}
        </span>
    ]);

    const parts = trimmedCmd.toLowerCase().split(/\s+/);
    const baseCommand = parts[0];
    const args = parts.slice(1).join(' '); 

    let output: string | React.ReactNode;

    switch (baseCommand) {
      case 'list':
        output = (
          <div className="my-2">
            <p className="font-bold text-green-400">Available Commands:</p>
            {COMMANDS.map(c => (
              <p key={c.cmd} className="ml-4">
                <span className="text-yellow-400 font-mono">{c.cmd}</span>: {c.description}
              </p>
            ))}
          </div>
        );
        break;

      case 'videos':
        output = (
            <div className="my-2">
                <p className="font-bold text-green-400">Video List (Newest First):</p>
                {VIDEOS_DATA.map(formatVideoLine)}
            </div>
        );
        break;
        
      // ✨ UPDATED COMMAND CASE: 'socials'
      case 'socials':
        output = (
            <div className="my-2">
                <p className="font-bold text-green-400">Find us online:</p>
                <p className="ml-4">
                    <span className="text-yellow-400">Instagram:</span> 
                    <a 
                      href="https://www.instagram.com/gvision.lt" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-200 underline ml-2"
                    >
                        @gvision.lt
                    </a>
                </p>
                <p className="ml-4">
                    <span className="text-yellow-400">LinkedIn:</span> 
                    <a 
                      href="https://www.linkedin.com/company/gvision-lt" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-blue-400 hover:text-blue-200 underline ml-2"
                    >
                        gvision.lt
                    </a>
                </p>
                {/* Removed: "Type **list** for more commands." */}
            </div>
        );
        break;

      case 'load':
        const videoTitle = args.trim();
        const videoToLoad = VIDEOS_DATA.find(v => v.title.toLowerCase() === videoTitle);
        
        if (videoToLoad) {
          setCurrentModalVideo(videoToLoad);
          output = `Loading video: ${videoToLoad.title}... (Check popup)`;
        } else {
          output = `Error: Video with title "${videoTitle}" not found. Try 'videos' command.`;
        }
        break;
        
      case 'clear':
        // Re-include the logo and help text after clearing
        setHistory([LOGO_TEXT, HELP_TEXT]); 
        setCommand('');
        return; 
        
      default:
        output = `Error: Command not recognized: ${baseCommand}. Type 'list' for help.`;
    }

    setHistory(prev => [...prev, output]);
    setCommand('');
    setHistoryIndex(-1); 
  }, [setHistory, setCommandHistory, setCurrentModalVideo]);


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key === 'Enter') {
      e.preventDefault();
      executeCommand(command);
    } 
    else if (key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } 
    else if (key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
    else if (key === 'Tab') {
        e.preventDefault();
        
        if (tabSuggestion) {
            setCommand(command + tabSuggestion);
        }
    }
  };

  return (
    <>
      <Head>
        <title>Terminal Site</title>
      </Head>
      <div 
        className="flex flex-col h-screen bg-black text-green-400 font-mono p-4 overflow-hidden" 
        onClick={() => inputRef.current?.focus()}
      >
        <div ref={terminalRef} className="flex-grow overflow-y-auto whitespace-pre-wrap leading-relaxed pb-4">
          {history.map((line, index) => (
            <div key={index}>{line}</div>
          ))}

          {/* Input Block with Auto-complete Preview and Cursor Fix */}
          <div className="flex items-center">
            <span className="text-green-400 font-bold mr-2">{TERMINAL_PROMPT}</span>
            
            <div className="relative flex-grow">
                {/* 1. Visible Text Layer (Shows typed command + gray suggestion) */}
                <span 
                    className="absolute inset-0 text-white pointer-events-none z-10"
                    style={{ lineHeight: '1.5rem' }} 
                >
                    {/* Command text (white) */}
                    {command}
                    
                    {/* Suggestion text (faded gray) */}
                    {tabSuggestion && (
                        <span className="text-gray-600">{tabSuggestion}</span>
                    )}
                </span>
                
                {/* 2. Actual Input Field (Handles cursor and keypresses) */}
                <input
                    ref={inputRef}
                    type="text"
                    value={command}
                    onChange={(e) => setCommand(e.target.value)}
                    onKeyDown={handleKeyDown}
                    
                    className="bg-transparent border-none outline-none flex-grow w-full text-transparent relative z-20 caret-green-400"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                />
            </div>
          </div>
        </div>
      </div>
      
      {/* Video Modal Display */}
      {currentModalVideo && (
        <VideoModal video={currentModalVideo} onClose={() => setCurrentModalVideo(null)} />
      )}
    </>
  );
}