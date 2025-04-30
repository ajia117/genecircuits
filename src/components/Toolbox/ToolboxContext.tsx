import React, { ReactNode, createContext, useState } from 'react';

type ToolboxType = string | null;
type ToolboxContextType = [ToolboxType, React.Dispatch<React.SetStateAction<ToolboxType>>];
const ToolboxContext = createContext<ToolboxContextType>(null as unknown as ToolboxContextType);

export const ToolboxProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ToolboxType>(null);

  return (
      <ToolboxContext.Provider value={[type, setType]}>
        {children}
      </ToolboxContext.Provider>
  );
}