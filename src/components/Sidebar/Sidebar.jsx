import React, { useContext, useState, useEffect } from 'react';
import './Sidebar.css';
import { assets } from '../../assets/assets';
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const [view, setView] = useState(''); // state to manage current view (help, activity, settings)
    const [darkMode, setDarkMode] = useState(false); // state to manage dark mode
    const { onSent, prevPrompts, setPrevPrompts, setRecentPrompt, newChat, setInput, setResultData } = useContext(Context);

    const loadPrompt = async (prompt) => {
        setRecentPrompt(prompt);
        setInput(prompt); // Set the input in Main.jsx to the selected prompt
        const response = await onSent(prompt);
        setResultData(response); // Update the resultData with the fetched response
    };

    const deletePrompt = (index) => {
        setPrevPrompts(prev => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    const handleToggleChange = () => {
        setDarkMode(prev => !prev);
        setView(''); // close the popup after changing state
    };

    return (
        <div className='sidebar'>
            <div className="top">
                <img src={assets.menu_icon} alt="" className="menu" onClick={() => setExtended(prev => !prev)} />
                <div onClick={() => newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended && view === 'activity' &&
                    <div className="recent">
                        <p className='recent-title'>Recent</p>
                        <div className="recent-scroll">
                            {prevPrompts.map((item, index) => (
                                <div key={index} className="recent-entry" onClick={() => loadPrompt(item)}>
                                    <div className="recent-text">
                                        <img src={assets.message_icon} alt="" />
                                        <p>{item.slice(0, 18)} {"..."}</p>
                                    </div>
                                    <img
                                        src="https://cdn-icons-png.flaticon.com/512/3221/3221803.png"
                                        alt="delete"
                                        className="delete-icon"
                                        onClick={() => deletePrompt(index)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry" onClick={() => setView('help')}>
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry" onClick={() => setView('activity')}>
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry" onClick={() => setView('settings')}>
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
            {view === 'help' && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setView('')}>&times;</span>
                        <h3>How to Use the Chat Bot</h3>
                        <p>To use this Chat Bot, type your queries in the input box and press send. The bot will respond with relevant information to help solve your issues.</p>
                    </div>
                </div>
            )}
            {view === 'settings' && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setView('')}>&times;</span>
                        <label className="dark-mode-toggle">
                            <span>Dark theme</span>
                            <input
                                type="checkbox"
                                checked={darkMode}
                                onChange={handleToggleChange}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
