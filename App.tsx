/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, ChangeEvent, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateImage } from './services/geminiService';
import PolaroidCard from './components/PolaroidCard';
import Footer from './components/Footer';

interface GeneratedImage {
    status: 'pending' | 'done' | 'error';
    url?: string;
    error?: string;
}

const primaryButtonClasses = "font-grape-nuts text-2xl text-center text-black bg-yellow-400 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:-rotate-2 hover:bg-yellow-300 shadow-[2px_2px_0px_2px_rgba(0,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-yellow-400";
const secondaryButtonClasses = "font-grape-nuts text-2xl text-center text-white bg-white/10 backdrop-blur-sm border-2 border-white/80 py-3 px-8 rounded-sm transform transition-transform duration-200 hover:scale-105 hover:rotate-2 hover:bg-white hover:text-black";
const textInputClasses = "bg-neutral-800 border-2 border-neutral-700 text-neutral-200 text-lg rounded-sm px-4 py-3 w-full md:w-80 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent font-sans placeholder:text-neutral-500";


function App() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [name, setName] = useState<string>('');
    const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [appState, setAppState] = useState<'idle' | 'image-uploaded' | 'generating' | 'results-shown'>('idle');


    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
                setAppState('image-uploaded');
                setGeneratedImage(null); // Clear previous results
                setName('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerateClick = async () => {
        if (!uploadedImage || !name.trim()) return;

        setIsLoading(true);
        setAppState('generating');
        setGeneratedImage({ status: 'pending' });

        try {
            const prompt = `Create a 1/7 scale commercialized figure of the character in the illustration, in a realistic style and environment. Place the figure on clear acrylic stand. Next to the computer screen, display the ZBrush modeling process of the figure. Next to the computer screen, place a BANDAI-style toy packaging box with title ${name} printed with the original artwork.`;
            const resultUrl = await generateImage(uploadedImage, prompt);
            setGeneratedImage({ status: 'done', url: resultUrl });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setGeneratedImage({ status: 'error', error: errorMessage });
            console.error(`Failed to generate image:`, err);
        }

        setIsLoading(false);
        setAppState('results-shown');
    };

    const handleRegenerate = async () => {
        if (!uploadedImage || generatedImage?.status === 'pending') {
            return;
        }
        console.log(`Regenerating image...`);
        // Just re-run the generation process
        await handleGenerateClick();
    };
    
    const handleReset = () => {
        setUploadedImage(null);
        setGeneratedImage(null);
        setName('');
        setAppState('idle');
    };

    const handleDownloadImage = () => {
        if (generatedImage?.status === 'done' && generatedImage.url) {
            const link = document.createElement('a');
            link.href = generatedImage.url;
            link.download = `figure-${name.replace(/\s+/g, '-') || 'generated'}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <main className="bg-black text-neutral-200 min-h-screen w-full flex flex-col items-center justify-center p-4 pb-24 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]"></div>
            
            <div className="z-10 flex flex-col items-center justify-center w-full h-full flex-1 min-h-0">
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-6xl md:text-8xl font-grape-nuts font-bold text-neutral-100">Tạo Hình Của Bạn</h1>
                    <p className="font-grape-nuts text-neutral-400 text-2xl">bởi Nam Vu</p>
                    <p className="font-grape-nuts text-neutral-300 mt-4 text-2xl tracking-wide">Tạo một nhân vật tùy chỉnh từ ảnh của bạn.</p>
                </motion.div>

                {appState === 'idle' && (
                     <div className="relative flex flex-col items-center justify-center w-full">
                        <motion.div
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             transition={{ delay: 0.2, duration: 0.8, type: 'spring' }}
                             className="flex flex-col items-center"
                        >
                            <label htmlFor="file-upload" className="cursor-pointer group transform hover:scale-105 transition-transform duration-300">
                                 <PolaroidCard 
                                     caption="Nhấp để bắt đầu"
                                     status="done"
                                 />
                            </label>
                            <input id="file-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                            <p className="mt-8 font-grape-nuts text-neutral-500 text-center max-w-xs text-xl">
                                Nhấp vào polaroid để tải ảnh lên và tạo nhân vật tùy chỉnh của riêng bạn.
                            </p>
                        </motion.div>
                    </div>
                )}

                {appState === 'image-uploaded' && uploadedImage && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-6"
                    >
                         <PolaroidCard 
                            imageUrl={uploadedImage} 
                            caption="Ảnh Của Bạn" 
                            status="done"
                         />
                         <div className="flex flex-col items-center gap-4 mt-4 w-full md:w-auto">
                            <label htmlFor="name-input" className="sr-only">Figure Name</label>
                            <input
                                id="name-input"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Nhập tên cho nhân vật..."
                                className={textInputClasses}
                            />
                            <div className="flex items-center gap-4">
                                <button onClick={handleReset} className={secondaryButtonClasses}>
                                    Ảnh Khác
                                </button>
                                <button onClick={handleGenerateClick} disabled={!name.trim()} className={primaryButtonClasses}>
                                    Tạo Ra
                                </button>
                            </div>
                         </div>
                    </motion.div>
                )}

                {(appState === 'generating' || appState === 'results-shown') && generatedImage && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <PolaroidCard
                            caption={name || "Hình Của Bạn"}
                            status={generatedImage.status}
                            imageUrl={generatedImage.url}
                            error={generatedImage.error}
                            onShake={handleRegenerate}
                            onDownload={handleDownloadImage}
                        />
                        <div className="h-20 mt-2 flex items-center justify-center">
                            {appState === 'results-shown' && (
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <button onClick={handleReset} className={secondaryButtonClasses}>
                                        Bắt Đầu Lại
                                    </button>
                                </div>
                            )}
                             {appState === 'generating' && (
                                <p className="font-grape-nuts text-neutral-400 text-xl animate-pulse">
                                    Đang tạo hình của bạn...
                                </p>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
            <Footer />
        </main>
    );
}

export default App;