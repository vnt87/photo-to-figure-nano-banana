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

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, currentKey, onClose, onSave, onClear }) => {
    const [inputValue, setInputValue] = useState(currentKey || '');

    useEffect(() => {
        setInputValue(currentKey || '');
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
                <label htmlFor="api-key-input" className="sr-only">Enter your Gemini API Key...</label>
                <input
                    id="api-key-input"
                    type="password"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter your Gemini API Key..."
                    className="bg-neutral-800 border-2 border-neutral-700 text-neutral-200 text-base rounded-sm px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-sans placeholder:text-neutral-500"
                />
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