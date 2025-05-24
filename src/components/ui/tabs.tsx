import React, { useState } from 'react';
import { cn } from '@/lib/utils';

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
  disabled?: boolean;
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
export function Tabs({ 
  defaultValue = '', 
  value, 
  onValueChange, 
  children, 
  className = '' 
}: TabsProps) {
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
      <div className={cn('w-full', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

// ✅ LISTA DE TRIGGERS
export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={cn(
      'inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-500',
      className
    )}>
      {children}
    </div>
  );
}

// ✅ TRIGGER INDIVIDUAL
export function TabsTrigger({ 
  value, 
  children, 
  className = '',
  disabled = false 
}: TabsTriggerProps) {
  const { activeTab, setActiveTab } = React.useContext(TabsContext);
  
  const isActive = activeTab === value;
  
  return (
    <button
      type="button"
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive 
          ? 'bg-white text-gray-950 shadow' 
          : 'text-gray-500 hover:text-gray-900',
        className
      )}
      onClick={() => !disabled && setActiveTab(value)}
    >
      {children}
    </button>
  );
}

// ✅ CONTEÚDO DO TAB
export function TabsContent({ 
  value, 
  children, 
  className = '' 
}: TabsContentProps) {
  const { activeTab } = React.useContext(TabsContext);
  
  if (activeTab !== value) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        'mt-2 ring-offset-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        className
      )}
    >
      {children}
    </div>
  );
}
