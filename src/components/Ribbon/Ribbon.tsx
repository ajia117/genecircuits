import React, { useState } from "react";
import { Play, Pause, Save, Trash, Graph } from "../../assets";
import "./Ribbon.css";
import { Panel } from "@xyflow/react";

interface TopRibbonProps {
    onPlayClick: () => void;
    onPauseClick: () => void;
    onSaveClick: () => void;
    onClearClick: () => void;
    onToggleOutputWindow: () => void;
}

const TopRibbon: React.FC<TopRibbonProps> = ({ onPlayClick, onPauseClick, onSaveClick, onClearClick, onToggleOutputWindow }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    const handleClear = () => {
        setShowConfirmation(true);
    };

    const confirmClear = () => {
        onClearClick();
        setShowConfirmation(false);
    };

    const cancelClear = () => {
        setShowConfirmation(false);
    };

    return (
        <div className="top-ribbon-container">
            <div className="ribbon-left">
                <button onClick={onSaveClick} className="save-button">
                    <Save />
                </button>
                <button onClick={handleClear} className="clear-button">
                    <Trash />
                </button>
            </div>
            <div className="ribbon-center">
                <button onClick={onPlayClick} className="play-button">
                    <Play />
                </button>
                <button onClick={onPauseClick} className="pause-button">
                    <Pause />
                </button>
            </div>
            <div className="ribbon-right">
                <button onClick={onToggleOutputWindow} className="toggle-output-button">
                    <Graph />
                </button>
            </div>

            {showConfirmation && (
                <div className="ribbon-overlay">
                    <div className="confirmation-window">
                        <h2>Are you sure you want to clear the screen?</h2>
                        <div className="confirmation-buttons">
                            <button onClick={confirmClear} className="confirm">Clear</button>
                            <button onClick={cancelClear} className="cancel">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TopRibbon;
