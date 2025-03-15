import React from "react";
import { Play, Pause, Save, Trash, Graph } from "../../assets";
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
                    <Save />
                </button>
                <button onClick={onClearClick} className="clear-button">
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
        </div>
    );
};

export default TopRibbon;
