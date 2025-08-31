/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface ApiKeyContextType {
    apiKey: string | null;
    setApiKey: (key: string) => void;
    clearApiKey: () => void;
    isDefault: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType | undefined>(undefined);

export const ApiKeyProvider = ({ children }: { children: ReactNode }) => {
    const [apiKey, setApiKeyState] = useState<string | null>(() => {
        try {
            return window.localStorage.getItem('gemini_api_key');
        } catch (error) {
            console.error("Could not access localStorage:", error);
            return null;
        }
    });

    useEffect(() => {
        try {
            if (apiKey) {
                window.localStorage.setItem('gemini_api_key', apiKey);
            } else {
                window.localStorage.removeItem('gemini_api_key');
            }
        } catch (error) {
            console.error("Could not access localStorage:", error);
        }
    }, [apiKey]);

    const setApiKey = (key: string) => {
        setApiKeyState(key);
    };

    const clearApiKey = () => {
        setApiKeyState(null);
    };
    
    const isDefault = apiKey === null;

    return (
        <ApiKeyContext.Provider value={{ apiKey, setApiKey, clearApiKey, isDefault }}>
            {children}
        </ApiKeyContext.Provider>
    );
};

export const useApiKey = () => {
    const context = useContext(ApiKeyContext);
    if (context === undefined) {
        throw new Error('useApiKey must be used within an ApiKeyProvider');
    }
    return context;
};