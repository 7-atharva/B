import React, { useContext, useRef, useState } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Main = () => {
    const {
        onSent,
        recentPrompt,
        showResult,
        loading,
        resultData,
        setInput,
        input
    } = useContext(Context);

    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const [uploadedImage, setUploadedImage] = useState(null);

    // Initialize the speech recognition
    const initializeRecognition = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                setInput(speechResult);
                setIsListening(false);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error', event);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        } else {
            console.error('Speech recognition not supported in this browser');
        }
    };

    // Handle the mic button click
    const handleMicClick = () => {
        if (!recognitionRef.current) {
            initializeRecognition();
        }
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        } else if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const handleCardClick = (text) => {
        setInput(text);
        onSent(text);
    };

    // Handle the gallery button click
    const handleGalleryClick = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setUploadedImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle sending the query
    const handleSend = () => {
        onSent();
        setUploadedImage(null);
        setInput('');
    };

    return (
        <div className='main'>
            <div className="nav">
                <p>Chat Bot :)</p>
                <img src={assets.user_icon} alt="" />
            </div>
            <div className="main-container">
                {showResult ? (
                    <div className="result">
                        <div className='result-title'>
                            <img src={assets.user_icon} alt="" />
                            <p>{recentPrompt}</p>
                        </div>
                        <div className="result-data">
                            {loading ? (
                                <div className="loader">
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                    <hr className="animated-bg" />
                                </div>
                            ) : (
                                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="greet">
                            <p><span>Hello, Atharva.</span></p>
                            <p>How can I help you today?</p>
                        </div>
                        <div className="cards">
                            <div className="card" onClick={() => handleCardClick('Suggest beautiful places to see on an upcoming road trip')}>
                                <p>Suggest beautiful places to see on an upcoming road trip</p>
                                <img src={assets.compass_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick('Trending Technologies for 2k24')}>
                                <p>Trending Technologies for 2k24</p>
                                <img src={assets.question_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick('Brainstorm team bonding activities for our work retreat')}>
                                <p>Brainstorm team bonding activities for our work retreat</p>
                                <img src={assets.message_icon} alt="" />
                            </div>
                            <div className="card" onClick={() => handleCardClick('Easy Tipes and Trickes to learn the coding language')}>
                                <p>Easy Tipes and Trickes to learn the coding language</p>
                                <img src={assets.code_icon} alt="" />
                            </div>
                        </div>
                    </>
                )}

                <div className="main-bottom">
                    <div className="search-box">
                        {uploadedImage && (
                            <div className="uploaded-image">
                                <img src={uploadedImage} alt="Uploaded" />
                            </div>
                        )}
                        <input
                            onChange={(e) => setInput(e.target.value)}
                            value={input}
                            type="text"
                            placeholder={isListening ? 'Listening...' : 'Enter a prompt here'}
                        />
                        <div>
                            <input
                                type="file"
                                id="file-input"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleGalleryClick}
                            />
                            <label htmlFor="file-input">
                                <img src={assets.gallery_icon} width={30} alt="" className="icon-hover" />
                            </label>
                            <img onClick={handleMicClick} src={assets.mic_icon} width={30} alt="" className={`icon-hover ${isListening ? 'listening' : ''}`} />
                            {(input || uploadedImage) && (
                                <img onClick={handleSend} src={assets.send_icon} width={30} alt="" className="icon-hover" />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;
