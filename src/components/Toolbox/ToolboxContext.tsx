import { ReactNode, createContext, useContext, useState } from 'react';
 
const ToolboxContext = createContext([null, (_: any) => {}]);
 
export const ToolboxProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState(null);
 
  return (
    <ToolboxContext.Provider value={[type, setType]}>
      {children}
    </ToolboxContext.Provider>
  );
}
 
export default ToolboxContext;
 
export const useDnD = () => {
  return useContext(ToolboxContext);
}