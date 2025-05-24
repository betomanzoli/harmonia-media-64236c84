import React, { useState } from 'react';

interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

// ✅ CONTEXT PARA GERENCIAR ESTADO DOS TABS
const TabsContext = React.createContext<{
  activeTab: string;
  setActiveTab: (value: string) => void;
}>({
  activeTab: '',
  setActiveTab: () => {}
});

// ✅ COMPONENTE PRINCIPAL TABS
export function Tabs({ defaultValue = '', value, onValueChange, children, className = '' }: TabsProps) {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultValue);
  
  const activeTab = value !== undefined ? value : internalActiveTab;
  
  const setActiveTab = (newValue: string) => {
    if (value === undefined) {
      setInternalActiveTab(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ✅ LISTA DE TRIGGERS
export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

// ✅ TRIGGER INDIVIDUAL
export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      className={`px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isActive 
          ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      } ${className}`}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// ✅ CONTEÚDO DO TAB
export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const { activeTab } = React.useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  );
}
