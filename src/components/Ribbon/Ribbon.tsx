import React from "react";
import Play from "../../assets/Play";
import PauseIcon from "../../assets/Pause";
import SaveIcon from "../../assets/Save";
import EraserIcon from "../../assets/Eraser";
import GraphIcon from "../../assets/Graph";
import './Ribbon.css';

interface TopRibbonProps {
    onPlayClick: () => void;
    onPauseClick: () => void;
    onSaveClick: () => void;
    onClearClick: () => void;
    onToggleOutputWindow: () => void;
}

const TopRibbon: React.FC<TopRibbonProps> = ({ onPlayClick, onPauseClick, onSaveClick, onClearClick, onToggleOutputWindow }) => {
    return (
        <div className="top-ribbon-container">
            <div className="ribbon-left">
                <button onClick={onSaveClick} className="save-button">
                    <SaveIcon />
                </button>
                <button onClick={onClearClick} className="clear-button">
                    <EraserIcon />
                </button>
            </div>
            <div className="ribbon-center">
                <button onClick={onPlayClick} className="play-button">
                    <Play />
                </button>
                <button onClick={onPauseClick} className="pause-button">
                    <PauseIcon />
                </button>
            </div>
            <div className="ribbon-right">
                <button onClick={onToggleOutputWindow} className="toggle-output-button">
                    <GraphIcon />
                </button>
            </div>
        </div>
    );
};

export default TopRibbon;
