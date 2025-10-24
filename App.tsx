
import React, { useState, useEffect, useRef } from 'react';
import KanbanBoard, { KanbanBoardHandle } from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import MenuIcon from './components/icons/MenuIcon';
import PlusIcon from './components/icons/PlusIcon';
import BellIcon from './components/icons/BellIcon';
import ViewListIcon from './components/icons/ViewListIcon';
import ViewGridIcon from './components/icons/ViewGridIcon';
import CreateProjectPage from './pages/CreateProjectPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import NotificationPanel from './components/NotificationPanel';
import { Project, Page, Notification } from './types';
import Avatar from './components/Avatar';

const App: React.FC = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [currentPage, setCurrentPage] = useState<Page>('board');
  const [isCompactView, setIsCompactView] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const kanbanBoardRef = useRef<KanbanBoardHandle>(null);
  const notificationPanelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationPanelRef.current && !notificationPanelRef.current.contains(event.target as Node)) {
        setIsNotificationPanelOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddColumn = () => {
    kanbanBoardRef.current?.addColumn();
  };

  const addNotification = (message: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      message,
      timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
    setHasUnread(true);
  };
  
  const toggleNotificationPanel = () => {
    setIsNotificationPanelOpen(prev => !prev);
    if (!isNotificationPanelOpen) {
      setHasUnread(false);
    }
  };

  const handleProjectCreate = (projectData: Project) => {
    setProject(projectData);
    setCurrentPage('board');
  };
  
  const handleProjectUpdate = (updatedProject: Project) => {
    setProject(updatedProject);
  };

  const handleProjectDelete = () => {
    setProject(null);
  };

  if (!project) {
    return <CreateProjectPage onProjectCreate={handleProjectCreate} />;
  }
  
  const renderPage = () => {
    switch (currentPage) {
      case 'settings':
        return <SettingsPage project={project} onProjectUpdate={handleProjectUpdate} onProjectDelete={handleProjectDelete} />;
      case 'help':
        return <HelpPage />;
      case 'board':
      default:
        return <KanbanBoard 
                  ref={kanbanBoardRef} 
                  availableAssignees={project.members}
                  addNotification={addNotification}
                  isCompactView={isCompactView}
               />;
    }
  }

  return (
    <div className="flex h-screen bg-primary text-text-primary font-sans antialiased overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        currentPage={currentPage}
        onNavigate={(page) => setCurrentPage(page)}
       />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="p-4 bg-secondary shadow-md flex items-center justify-between flex-shrink-0 z-20">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-text-secondary hover:text-accent transition-colors"
                    title="Alternar barra lateral"
                >
                    <MenuIcon className="w-6 h-6" />
                </button>
                 <div className="flex items-center gap-3">
                    {project.logo ? (
                      <img src={project.logo} alt="Logo do Projeto" className="w-8 h-8 rounded-md object-cover" />
                    ) : (
                      <div className="w-8 h-8 flex-shrink-0">
                         <Avatar name={project.name} />
                      </div>
                    )}
                    <h1 className="text-xl sm:text-2xl font-bold text-accent hidden sm:block truncate" title={project.name}>
                        {project.name}
                    </h1>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {currentPage === 'board' && (
                  <>
                  <button
                      onClick={() => setIsCompactView(prev => !prev)}
                      className="p-2 text-text-secondary hover:text-accent transition-colors"
                      title={isCompactView ? "Visualização Detalhada" : "Visualização Compacta"}
                  >
                      {isCompactView ? <ViewGridIcon className="w-6 h-6" /> : <ViewListIcon className="w-6 h-6" />}
                  </button>
                  <button
                      onClick={handleAddColumn}
                      className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-semibold"
                      title="Adicionar uma nova coluna ao quadro"
                  >
                      <PlusIcon className="w-5 h-5" />
                      <span className="hidden md:block">Adicionar Coluna</span>
                  </button>
                  </>
                )}
                 <div className="relative" ref={notificationPanelRef}>
                    <button 
                        onClick={toggleNotificationPanel}
                        className="p-2 text-text-secondary hover:text-accent transition-colors relative"
                        title="Ver notificações"
                    >
                        <BellIcon className="w-6 h-6" />
                        {hasUnread && <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-secondary"></span>}
                    </button>
                    {isNotificationPanelOpen && <NotificationPanel notifications={notifications} />}
                 </div>
            </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-primary">
          {renderPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
