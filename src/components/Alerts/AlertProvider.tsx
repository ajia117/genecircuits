import React, { useState, useContext, createContext, ReactNode, FC } from 'react';
import { TriangleAlert, X } from "lucide-react";
import { AlertDialog, Button, Flex, Text } from "@radix-ui/themes";

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
            <AlertDialog.Root open={open} onOpenChange={setOpen}>
                <AlertDialog.Content maxWidth="300px">
                    <Flex direction="column" justify="center" gap="5" my="3">
                        <Flex direction="row" align="center" justify="center" gap="3">
                            <TriangleAlert size={24} strokeWidth={2} color="var(--accent-9)" />
                            <AlertDialog.Title style={{ margin: 0, paddingTop: 5 }}>Alert</AlertDialog.Title>
                        </Flex>
                        <Flex direction="column" align="center" gap="5">
                            <AlertDialog.Description>
                                <Text>{message || 'An error occurred'}</Text>
                            </AlertDialog.Description>
                            <AlertDialog.Action>
                                <Button variant='solid' style={{ maxWidth: "200px" }}>OK</Button>
                            </AlertDialog.Action>
                        </Flex>
                    </Flex>
                </AlertDialog.Content>
            </AlertDialog.Root>
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