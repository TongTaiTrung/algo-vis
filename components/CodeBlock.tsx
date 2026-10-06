"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export type Language = 'cpp' | 'python' | 'javascript';

export interface CodeSnippets {
  cpp: string;
  python: string;
  javascript: string;
}

export type LineMapping = Record<number, number | number[]>;

export interface LanguageMappings {
  cpp: LineMapping;
  python: LineMapping;
  javascript: LineMapping;
}

interface CodeBlockProps {
  snippets: CodeSnippets;
  mappings: LanguageMappings;
  activeLine: number;
  callingLine?: number | number[];
}

export default function CodeBlock({ snippets, mappings, activeLine, callingLine }: CodeBlockProps) {
  const [lang, setLang] = useState<Language>('cpp');
  const containerRef = useRef<HTMLDivElement>(null);

  const codeString = snippets[lang];
  const langMap = mappings[lang] || {};
  
  // Calculate which physical lines should be highlighted based on `activeLine` from the tracer.
  let highlightedLines: number[] = [];
  if (langMap[activeLine] !== undefined) {
    const val = langMap[activeLine];
    highlightedLines = Array.isArray(val) ? val : [val];
  } else if (typeof activeLine === 'number') {
    // Fallback if direct physical line passed
    highlightedLines = [activeLine];
  }

  // Calculate calling lines (highlighted in sparkling yellow)
  let callingLines: number[] = [];
  if (callingLine !== undefined) {
    const rawCalling = Array.isArray(callingLine) ? callingLine : [callingLine];
    for (const cl of rawCalling) {
      if (langMap[cl] !== undefined) {
        const val = langMap[cl];
        if (Array.isArray(val)) {
          callingLines.push(...val);
        } else {
          callingLines.push(val);
        }
      } else if (typeof cl === 'number') {
        callingLines.push(cl);
      }
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      const activeEl = containerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const callingEl = containerRef.current.querySelector('[data-calling="true"]');
        if (callingEl) {
          callingEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    }
  }, [highlightedLines, callingLines, lang]);

  return (
    <div className="flex flex-col h-full w-full bg-[#18181b] overflow-hidden border border-white/10 relative shadow-2xl">
      <style>{`
        @keyframes sparkleShimmer {
          0% {
            background-position: -200% 0;
            border-left-color: #eab308;
            box-shadow: 0 0 6px rgba(234, 179, 8, 0.25);
          }
          50% {
            border-left-color: #fef08a;
            box-shadow: 0 0 12px rgba(250, 204, 21, 0.45);
          }
          100% {
            background-position: 200% 0;
            border-left-color: #eab308;
            box-shadow: 0 0 6px rgba(234, 179, 8, 0.25);
          }
        }
        .sparkle-calling-line {
          background: linear-gradient(90deg, rgba(234, 179, 8, 0.16) 0%, rgba(253, 224, 71, 0.28) 50%, rgba(234, 179, 8, 0.16) 100%) !important;
          background-size: 200% 100% !important;
          animation: sparkleShimmer 2s ease-in-out infinite !important;
          border-left: 1px solid #facc15 !important;
          color: #fef08a !important;
        }
      `}</style>
      <div className="flex bg-[#121214] border-b border-white/10 shrink-0 items-center justify-between pr-3">
        <div className="flex">
          {(['cpp', 'python', 'javascript'] as Language[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-4 py-2.5 font-mono text-xs font-medium capitalize transition-colors duration-200 ${
                lang === l 
                  ? 'bg-[#18181b] text-blue-400 border-b-2 border-b-blue-400 font-semibold' 
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03] border-b-2 border-b-transparent'
              }`}
            >
              {l === 'cpp' ? 'C++' : l === 'python' ? 'Python' : 'JavaScript'}
            </button>
          ))}
        </div>
        {callingLines.length > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/15 border border-amber-500/30 text-[11px] font-mono font-medium text-amber-300 animate-pulse" title="Dòng lệnh đang được gọi thực thi">
            <span>✨</span>
            <span>Đang gọi đệ quy...</span>
          </div>
        )}
      </div>
      <div ref={containerRef} className="flex-1 overflow-auto relative custom-scrollbar">
        <SyntaxHighlighter
          language={lang === 'cpp' ? 'cpp' : lang === 'javascript' ? 'javascript' : 'python'}
          style={vscDarkPlus}
          customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '12px', lineHeight: '1.6' }}
          showLineNumbers={true}
          wrapLines={true}
          lineNumberStyle={{ minWidth: '35px', paddingRight: '12px', color: '#94a3b8', textAlign: 'right', userSelect: 'none' }}
          lineProps={(lineNumber) => {
            const isActive = highlightedLines.includes(lineNumber);
            const isCalling = callingLines.includes(lineNumber) && !isActive;

            if (isCalling) {
              return {
                'data-calling': 'true',
                className: 'sparkle-calling-line',
                style: {
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingLeft: '6px',
                  paddingRight: '8px',
                  position: 'relative',
                },
              } as any;
            }

            return {
              'data-active': isActive ? 'true' : 'false',
              style: {
                display: 'block',
                backgroundColor: isActive ? 'rgba(59, 130, 246, 0.22)' : 'transparent',
                borderLeft: isActive ? '1px solid #3b82f6' : '1px solid transparent',
                paddingLeft: '6px',
                transition: 'background-color 0.15s ease',
              },
            } as any;
          }}
        >
          {codeString.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
