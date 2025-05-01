import React, { useState, useContext, createContext, ReactNode, FC } from 'react';
import './AlertsStyles.css';
import {TriangleAlert, X} from "lucide-react";

// Define the alert context type
interface AlertContextType {
    showAlert: (message: string) => void;
}

// Create the context with a non-empty default implementation that throws an error
const AlertContext = createContext<AlertContextType | undefined>(undefined);

// Props for the AlertProvider component
interface AlertProviderProps {
    children: ReactNode;
}

export const AlertProvider: FC<AlertProviderProps> = ({ children }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const showAlert = (message: string): void => {
        setMessage(message);
        setOpen(true);
    };

    const value = {
        showAlert
    };

    return (
        <AlertContext.Provider value={value}>
            {children}
            {open && (
                <>
                    {/* Overlay */}
                    <div className="alert-overlay" onClick={() => setOpen(false)} />

                    {/* Alert Container */}
                    <div className="alert-container">
                        <div className="alert-content">
                            {/* Header */}
                            <div className="alert-header">
                                <div className="alert-title">
                                    <TriangleAlert size={16} strokeWidth={2} color="var(--accent-9)" />
                                    <span className="alert-title-text">Alert</span>
                                </div>
                                <button
                                    className="alert-close-button"
                                    onClick={() => setOpen(false)}
                                    aria-label="Close"
                                >
                                    <X size={16} strokeWidth={2} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="alert-body">
                                <div className="alert-message">
                                    {message || 'An error occurred'}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="alert-footer">
                                <button
                                    className="alert-ok-button"
                                    onClick={() => setOpen(false)}
                                >
                                    OK
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </AlertContext.Provider>
    );
};

// Custom hook with proper error handling
export const useAlert = (): AlertContextType => {
    const context = useContext(AlertContext);
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};