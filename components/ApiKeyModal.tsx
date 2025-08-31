/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
    isOpen: boolean;
    currentKey: string | null;
    onClose: () => void;
    onSave: (key: string) => void;
    onClear: () => void;
}

const EyeIcon = ({ Slashed }: { Slashed?: boolean }) => (
    Slashed ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
            <line x1="2" x2="22" y1="2" y2="22"/>
        </svg>
    ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
            <circle cx="12" cy="12" r="3"/>
        </svg>
    )
);

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, currentKey, onClose, onSave, onClear }) => {
    const [inputValue, setInputValue] = useState(currentKey || '');
    const [isKeyVisible, setIsKeyVisible] = useState(false);

    useEffect(() => {
        setInputValue(currentKey || '');
        setIsKeyVisible(false); // Reset visibility when modal opens/key changes
    }, [currentKey, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (inputValue.trim()) {
            onSave(inputValue.trim());
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4" 
            onClick={onClose} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="apiKeyModalTitle"
        >
            <div
                className="bg-neutral-900 border border-neutral-700 rounded-lg p-6 w-full max-w-md text-neutral-200 shadow-2xl flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 id="apiKeyModalTitle" className="text-2xl font-bold font-grape-nuts text-yellow-400">Gemini API Key</h2>
                <p className="text-sm text-neutral-400">
                    Your key is stored locally in your browser and is only used to communicate with the Gemini API.
                </p>

                <div className="text-sm text-neutral-400 border-t border-b border-neutral-800 py-3">
                    <h3 className="font-bold text-neutral-300 mb-1.5">How to get an API Key</h3>
                    <p>
                        1. Go to {' '}
                        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-yellow-400 underline hover:text-yellow-300">
                            Google AI Studio
                        </a>.
                        <br />
                        2. Click <span className="font-mono bg-neutral-700/50 px-1 py-0.5 rounded-sm text-yellow-300 text-xs">Create API key</span> and copy your key.
                    </p>
                </div>
                
                <div className="relative w-full">
                    <label htmlFor="api-key-input" className="sr-only">Enter your Gemini API Key...</label>
                    <input
                        id="api-key-input"
                        type={isKeyVisible ? 'text' : 'password'}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter your Gemini API Key..."
                        className="bg-neutral-800 border-2 border-neutral-700 text-neutral-200 text-base rounded-sm px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-sans placeholder:text-neutral-500 pr-12"
                    />
                    <button
                        onClick={() => setIsKeyVisible(!isKeyVisible)}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-500 hover:text-yellow-400 transition-colors"
                        aria-label={isKeyVisible ? "Hide API Key" : "Show API Key"}
                    >
                        <EyeIcon Slashed={isKeyVisible} />
                    </button>
                </div>


                <div className="flex justify-between items-center mt-2 gap-4">
                     <button
                        onClick={onClear}
                        className="font-grape-nuts text-xl text-center text-neutral-300 hover:text-white transition-colors"
                    >
                        Use Default Key
                    </button>
                    <div className="flex gap-2">
                         <button
                            onClick={onClose}
                            className="font-grape-nuts text-2xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-2 px-6 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!inputValue.trim()}
                            className="font-grape-nuts text-2xl text-center text-black bg-yellow-400 py-2 px-6 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-yellow-400"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApiKeyModal;