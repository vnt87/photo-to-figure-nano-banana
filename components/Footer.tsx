/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

const GithubIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-2">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
);


const Footer = () => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm p-3 z-50 text-neutral-300 text-sm border-t border-white/10 text-center">
            <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 px-4 text-neutral-400">
                <span>Powered by Gemini Nano Banana</span>
                <span className="hidden sm:inline text-neutral-600" aria-hidden="true">|</span>
                <a
                    href="https://github.com/vnt87/photo-to-figure-nano-banana"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-neutral-400 hover:text-yellow-400 transition-colors duration-200"
                >
                    <GithubIcon />
                    View Source
                </a>
            </div>
        </footer>
    );
};

export default Footer;