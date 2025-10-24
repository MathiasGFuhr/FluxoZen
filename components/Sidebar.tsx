
import React from 'react';
import BoardIcon from './icons/BoardIcon';
import SettingsIcon from './icons/SettingsIcon';
import HelpIcon from './icons/HelpIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import { Page } from '../types';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, currentPage, onNavigate }) => {
  const navItems: { page: Page; label: string; icon: React.FC<{className?: string}> }[] = [
    { page: 'board', label: 'Quadro Principal', icon: BoardIcon },
    { page: 'settings', label: 'Configurações', icon: SettingsIcon },
    { page: 'help', label: 'Ajuda & Feedback', icon: HelpIcon },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 z-20 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      ></div>

      <aside
        className={`absolute top-0 left-0 h-full bg-secondary w-64 z-30 flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Barra lateral principal"
      >
        <div className="flex items-center justify-between p-4 border-b border-card flex-shrink-0">
          <h2 className="text-xl font-bold text-accent">FluxoZen</h2>
          <button onClick={toggleSidebar} className="p-1 md:hidden text-text-secondary hover:text-accent rounded-full" title="Fechar barra lateral">
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow p-2">
          <ul>
            {navItems.map(item => {
              const isActive = currentPage === item.page;
              return (
                <li key={item.page} className='mt-2'>
                  <button
                    onClick={() => onNavigate(item.page)}
                    title={`Ir para ${item.label}`}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'text-text-primary bg-card' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
        <footer className="p-4 text-xs text-center text-text-secondary/50 border-t border-card flex-shrink-0">
            <div>© 2024 FluxoZen</div>
        </footer>
      </aside>
    </>
  );
};

export default Sidebar;
