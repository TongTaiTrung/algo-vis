"use client";

import React, { useState, useEffect } from 'react';
import { TabType, AllInputs } from '@/types/algorithm';
import { DEFAULT_INPUTS } from '@/constants/mock-inputs';
import { useAlgorithmTraces } from '@/hooks/useAlgorithmTraces';

import Header from '@/components/layout/Header';
import AlgorithmBanner from '@/components/layout/AlgorithmBanner';
import VisualizerContainer from '@/components/visualizers/VisualizerContainer';
import AlgorithmPickerModal from '@/components/modals/AlgorithmPickerModal';
import CustomInputModal from '@/components/modals/CustomInputModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('DINIC');
  const [inputs, setInputs] = useState<AllInputs>(DEFAULT_INPUTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCPModalOpen, setIsCPModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const traces = useAlgorithmTraces(inputs);

  // Handle native fullscreen changes
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    const el = document.getElementById('simulation-container');
    if (!isFullscreen) {
      if (el?.requestFullscreen) {
        el.requestFullscreen().catch(err => {
          console.error(err);
          setIsFullscreen(true); // Fallback to CSS fullscreen
        });
      } else {
        setIsFullscreen(true);
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error(err);
          setIsFullscreen(false);
        });
      } else {
        setIsFullscreen(false);
      }
    }
  };

  // Keyboard shortcut listener (Cmd+K or Ctrl+K, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsModalOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        if (isModalOpen) setIsModalOpen(false);
        if (isCPModalOpen) setIsCPModalOpen(false);
        
        // Handle CSS fullscreen escape
        if (!document.fullscreenElement) {
          setIsFullscreen(false);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, isCPModalOpen]);

  const handleCustomInputSubmit = (parsedData: any) => {
    setInputs(prev => ({
      ...prev,
      [activeTab]: parsedData
    }));
  };

  const handleUpdateInput = (tab: TabType, newData: any) => {
    setInputs(prev => ({
      ...prev,
      [tab]: newData
    }));
  };

  return (
    <div className="h-screen w-screen bg-[#09090B] text-white flex flex-col p-4 overflow-hidden font-sans select-none">
      {/* Top Header Bar */}
      <Header
        activeTab={activeTab}
        onOpenAlgoPicker={() => setIsModalOpen(true)}
        onOpenCustomInput={() => setIsCPModalOpen(true)}
      />

      {/* Algorithm Info Banner & Problem Details */}
      <AlgorithmBanner
        activeTab={activeTab}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onOpenAlgoPicker={() => setIsModalOpen(true)}
      />

      {/* Main Simulation Workspace */}
      <VisualizerContainer
        activeTab={activeTab}
        inputs={inputs}
        traces={traces}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
        onUpdateInput={handleUpdateInput}
      />

      {/* Algorithm Picker Modal (Cmd+K) */}
      <AlgorithmPickerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        activeTab={activeTab}
        onSelectAlgo={(tab) => setActiveTab(tab)}
      />

      {/* CP Custom Input Modal */}
      <CustomInputModal
        isOpen={isCPModalOpen}
        onClose={() => setIsCPModalOpen(false)}
        activeTab={activeTab}
        onSubmitInput={handleCustomInputSubmit}
      />
    </div>
  );
}
