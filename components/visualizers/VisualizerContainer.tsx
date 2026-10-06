"use client";

import React from 'react';
import { Minimize } from 'lucide-react';
import { TabType, AllInputs, AllTraces } from '@/types/algorithm';

import DijkstraVisualizer from '@/components/visualizers/Dijkstra';
import DPKnapsackVisualizer from '@/components/visualizers/DPKnapsack';
import MoAlgorithmVisualizer from '@/components/visualizers/MoAlgorithm';
import CentroidVisualizer from '@/components/visualizers/Centroid';
import DpBsVisualizer from '@/components/visualizers/DpBs';
import ParallelBsVisualizer from '@/components/visualizers/ParallelBs';
import DigitDpVisualizer from '@/components/visualizers/DigitDp';
import BracketDpVisualizer from '@/components/visualizers/BracketDp';
import SudokuVisualizer from '@/components/visualizers/Sudoku';
import NQueensVisualizer from '@/components/visualizers/NQueens';
import DinicVisualizer from '@/components/visualizers/Dinic';
import HldVisualizer from '@/components/visualizers/Hld';
import AhoCorasickVisualizer from '@/components/visualizers/AhoCorasick';
import ChtVisualizer from '@/components/visualizers/Cht';
import RerootingVisualizer from '@/components/visualizers/Rerooting';
import DiceCombinationsVisualizer from '@/components/visualizers/DiceCombinations';
import MinimizingCoinsVisualizer from '@/components/visualizers/MinimizingCoins';
import CoinCombinations1Visualizer from '@/components/visualizers/CoinCombinations1';
import CoinCombinations2Visualizer from '@/components/visualizers/CoinCombinations2';
import RemovingDigitsVisualizer from '@/components/visualizers/RemovingDigits';
import GridPathsVisualizer from '@/components/visualizers/GridPaths';
import BookShopVisualizer from '@/components/visualizers/BookShop';
import SparseTableVisualizer from '@/components/visualizers/SparseTable';
import TrieVisualizer from '@/components/visualizers/Trie';

import BinarySequenceVisualizer from '@/components/visualizers/BinarySequence';
import PermutationVisualizer from '@/components/visualizers/Permutation';
import CombinationVisualizer from '@/components/visualizers/Combination';
import SubsetVisualizer from '@/components/visualizers/Subset';


interface VisualizerContainerProps {
  activeTab: TabType;
  inputs: AllInputs;
  traces: AllTraces;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onUpdateInput?: (tab: TabType, newData: any) => void;
}

export default function VisualizerContainer({
  activeTab,
  inputs,
  traces,
  isFullscreen,
  onToggleFullscreen,
  onUpdateInput
}: VisualizerContainerProps) {
  return (
    <div 
      id="simulation-container" 
      className={
        isFullscreen 
          ? "fixed inset-0 z-[100] bg-[#09090B] flex flex-col p-2 sm:p-4 w-screen h-screen overflow-hidden fullscreen-mode" 
          : "flex-1 min-h-0 relative flex flex-col"
      }
    >
      {/* Floating Escape Button (Visible only in Fullscreen) */}
      {isFullscreen && (
        <button
          onClick={onToggleFullscreen}
          className="absolute top-6 left-1/2 -translate-x-1/2 z-[150] px-4 py-2 bg-black/60 hover:bg-black/90 backdrop-blur-md ring-1 ring-white/10 hover:ring-white/30 text-xs font-mono text-zinc-400 hover:text-white flex items-center gap-2 shadow-2xl transition-all duration-300 opacity-20 hover:opacity-100"
          title="Thoát toàn màn hình"
        >
          <Minimize size={14} /> Thoát (ESC)
        </button>
      )}

      {activeTab === 'DIJKSTRA' && (
        <DijkstraVisualizer 
          key={JSON.stringify(inputs.DIJKSTRA)} 
          input={inputs.DIJKSTRA} 
          steps={traces.DIJKSTRA} 
        />
      )}
      {activeTab === 'DP' && (
        <DPKnapsackVisualizer 
          key={JSON.stringify(inputs.DP)} 
          input={inputs.DP} 
          steps={traces.DP} 
        />
      )}
      {activeTab === 'MO' && (
        <MoAlgorithmVisualizer 
          key={JSON.stringify(inputs.MO)} 
          input={inputs.MO} 
          steps={traces.MO} 
          onUpdateInput={onUpdateInput ? (newData) => onUpdateInput('MO', newData) : undefined}
        />
      )}
      {activeTab === 'CENTROID' && (
        <CentroidVisualizer 
          key={JSON.stringify(inputs.CENTROID)} 
          input={inputs.CENTROID} 
          steps={traces.CENTROID} 
        />
      )}
      {activeTab === 'DP_BS' && (
        <DpBsVisualizer 
          key={JSON.stringify(inputs.DP_BS)} 
          input={inputs.DP_BS} 
          steps={traces.DP_BS} 
        />
      )}
      {activeTab === 'PBS' && (
        <ParallelBsVisualizer 
          key={JSON.stringify(inputs.PBS)} 
          input={inputs.PBS} 
          steps={traces.PBS} 
          onUpdateInput={onUpdateInput ? (newData) => onUpdateInput('PBS', newData) : undefined}
        />
      )}
      {activeTab === 'DIGIT_DP' && (
        <DigitDpVisualizer 
          key={JSON.stringify(inputs.DIGIT_DP)} 
          input={inputs.DIGIT_DP} 
          steps={traces.DIGIT_DP} 
        />
      )}
      {activeTab === 'BRACKET_DP' && (
        <BracketDpVisualizer 
          key={JSON.stringify(inputs.BRACKET_DP)} 
          input={inputs.BRACKET_DP} 
          steps={traces.BRACKET_DP} 
        />
      )}
      {activeTab === 'SUDOKU' && (
        <SudokuVisualizer 
          key={JSON.stringify(inputs.SUDOKU)} 
          input={inputs.SUDOKU} 
          steps={traces.SUDOKU} 
        />
      )}
      {activeTab === 'NQUEENS' && (
        <NQueensVisualizer 
          key={JSON.stringify(inputs.NQUEENS)} 
          input={inputs.NQUEENS} 
          steps={traces.NQUEENS} 
        />
      )}
      {activeTab === 'DINIC' && (
        <DinicVisualizer 
          key={JSON.stringify(inputs.DINIC)} 
          input={inputs.DINIC} 
          steps={traces.DINIC} 
        />
      )}
      {activeTab === 'HLD' && (
        <HldVisualizer 
          key={JSON.stringify(inputs.HLD)} 
          input={inputs.HLD} 
          steps={traces.HLD} 
        />
      )}
      {activeTab === 'AHO_CORASICK' && (
        <AhoCorasickVisualizer 
          key={JSON.stringify(inputs.AHO_CORASICK)} 
          input={inputs.AHO_CORASICK} 
          steps={traces.AHO_CORASICK} 
        />
      )}
      {activeTab === 'CHT' && (
        <ChtVisualizer 
          key={JSON.stringify(inputs.CHT)} 
          input={inputs.CHT} 
          steps={traces.CHT} 
        />
      )}
      {activeTab === 'REROOTING' && (
        <RerootingVisualizer 
          key={JSON.stringify(inputs.REROOTING)} 
          input={inputs.REROOTING} 
          steps={traces.REROOTING} 
        />
      )}
      {activeTab === 'DICE' && (
        <DiceCombinationsVisualizer 
          key={JSON.stringify(inputs.DICE)} 
          input={inputs.DICE} 
          steps={traces.DICE} 
        />
      )}
      {activeTab === 'MINIMIZING_COINS' && (
        <MinimizingCoinsVisualizer 
          key={JSON.stringify(inputs.MINIMIZING_COINS)} 
          input={inputs.MINIMIZING_COINS} 
          steps={traces.MINIMIZING_COINS} 
        />
      )}
      {activeTab === 'COIN_COMBINATIONS_1' && (
        <CoinCombinations1Visualizer 
          key={JSON.stringify(inputs.COIN_COMBINATIONS_1)} 
          input={inputs.COIN_COMBINATIONS_1} 
          steps={traces.COIN_COMBINATIONS_1} 
        />
      )}
      {activeTab === 'COIN_COMBINATIONS_2' && (
        <CoinCombinations2Visualizer 
          key={JSON.stringify(inputs.COIN_COMBINATIONS_2)} 
          input={inputs.COIN_COMBINATIONS_2} 
          steps={traces.COIN_COMBINATIONS_2} 
        />
      )}
      {activeTab === 'REMOVING_DIGITS' && (
        <RemovingDigitsVisualizer 
          key={JSON.stringify(inputs.REMOVING_DIGITS)} 
          input={inputs.REMOVING_DIGITS} 
          steps={traces.REMOVING_DIGITS} 
        />
      )}
      {activeTab === 'GRID_PATHS' && (
        <GridPathsVisualizer 
          key={JSON.stringify(inputs.GRID_PATHS)} 
          input={inputs.GRID_PATHS} 
          steps={traces.GRID_PATHS} 
        />
      )}
      {activeTab === 'BOOK_SHOP' && (
        <BookShopVisualizer 
          key={JSON.stringify(inputs.BOOK_SHOP)} 
          input={inputs.BOOK_SHOP} 
          steps={traces.BOOK_SHOP} 
        />
      )}
      {activeTab === 'SPARSE_TABLE' && (
        <SparseTableVisualizer 
          key={JSON.stringify(inputs.SPARSE_TABLE)} 
          input={inputs.SPARSE_TABLE} 
          steps={traces.SPARSE_TABLE} 
          onUpdateInput={onUpdateInput ? (newData) => onUpdateInput('SPARSE_TABLE', newData) : undefined}
        />
      )}
      {activeTab === 'TRIE' && (
        <TrieVisualizer 
          key={JSON.stringify(inputs.TRIE)} 
          input={inputs.TRIE} 
          steps={traces.TRIE} 
          onUpdateInput={onUpdateInput ? (newData) => onUpdateInput('TRIE', newData) : undefined}
        />
      )}

      {activeTab === 'BINARY_SEQUENCE' && (
        <BinarySequenceVisualizer key={JSON.stringify(inputs.BINARY_SEQUENCE)} input={inputs.BINARY_SEQUENCE} steps={traces.BINARY_SEQUENCE} />
      )}
      {activeTab === 'PERMUTATION' && (
        <PermutationVisualizer key={JSON.stringify(inputs.PERMUTATION)} input={inputs.PERMUTATION} steps={traces.PERMUTATION} />
      )}
      {activeTab === 'COMBINATION' && (
        <CombinationVisualizer key={JSON.stringify(inputs.COMBINATION)} input={inputs.COMBINATION} steps={traces.COMBINATION} />
      )}
      {activeTab === 'SUBSET' && (
        <SubsetVisualizer key={JSON.stringify(inputs.SUBSET)} input={inputs.SUBSET} steps={traces.SUBSET} />
      )}
    </div>
  );
}
