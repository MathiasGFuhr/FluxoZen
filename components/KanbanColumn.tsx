
import React, { useState } from 'react';
import { Column, Task, Assignee } from '../types';
import KanbanCard from './KanbanCard';
import PlusIcon from './icons/PlusIcon';
import TrashIcon from './icons/TrashIcon';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
  onDragStart: (taskId: string, sourceColumnId: string) => void;
  onDrop: (targetColumnId: string) => void;
  addTask: (columnId: string, content: string) => void;
  requestDeleteTask: (taskId: string, columnId: string) => void;
  updateTask: (taskId: string, newContent: string) => void;
  updateColumnTitle: (columnId: string, newTitle: string) => void;
  requestDeleteColumn: (columnId: string) => void;
  availableAssignees: Assignee[];
  updateTaskAssignee: (taskId: string, assignee: Assignee | null) => void;
  draggedTaskId?: string;
  isCompactView: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column, tasks, onDragStart, onDrop, addTask, requestDeleteTask, updateTask,
  updateColumnTitle, requestDeleteColumn, availableAssignees, updateTaskAssignee,
  draggedTaskId, isCompactView,
}) => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);
  const [isHovered, setIsHovered] = useState(false);

  const handleAddCard = () => {
    if (newCardContent.trim()) {
      addTask(column.id, newCardContent.trim());
      setNewCardContent('');
      setIsAddingCard(false);
    }
  };

  const handleTitleBlur = () => {
    updateColumnTitle(column.id, columnTitle.trim() || column.title);
    setIsEditingTitle(false);
  };
  
  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleTitleBlur();
  };

  return (
    <div
      className="flex-shrink-0 w-full md:w-80 bg-secondary rounded-xl shadow-lg flex flex-col max-h-[calc(100vh-12rem)]"
      onDragOver={(e) => { e.preventDefault(); }}
      onDrop={() => onDrop(column.id)}
    >
      <div 
        className="p-4 flex justify-between items-center cursor-pointer relative"
        onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      >
        {isEditingTitle ? (
           <input
             type="text" value={columnTitle} onChange={(e) => setColumnTitle(e.target.value)}
             onBlur={handleTitleBlur} onKeyDown={handleTitleKeyDown} autoFocus
             className="bg-card text-text-primary p-1 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-accent"
           />
        ) : (
            <h2 onClick={() => setIsEditingTitle(true)} className="font-bold text-lg flex items-center gap-2" title="Clique para editar o título">
                {column.title}
                <span className="text-sm font-normal text-text-secondary bg-primary px-2 py-1 rounded-full">{tasks.length}</span>
            </h2>
        )}
        {isHovered && !isEditingTitle && (
            <button
                onClick={() => requestDeleteColumn(column.id)}
                className="text-text-secondary hover:text-red-500 transition-colors"
                title="Excluir coluna"
            >
                <TrashIcon className="w-5 h-5"/>
            </button>
        )}
      </div>

      <div className="px-2 pb-2 overflow-y-auto flex-grow">
        {tasks.map((task) => (
          <KanbanCard
            key={task.id} task={task} columnId={column.id} onDragStart={onDragStart}
            requestDeleteTask={requestDeleteTask} updateTask={updateTask}
            availableAssignees={availableAssignees} updateTaskAssignee={updateTaskAssignee}
            isBeingDragged={draggedTaskId === task.id}
            isCompactView={isCompactView}
          />
        ))}
      </div>

      <div className="p-4 pt-2 mt-auto">
        {isAddingCard ? (
          <div>
            <textarea
              value={newCardContent} onChange={(e) => setNewCardContent(e.target.value)}
              placeholder="Digite um título para este cartão..."
              className="w-full p-2 rounded-lg bg-card border-2 border-transparent focus:border-accent focus:outline-none resize-none text-text-primary"
              rows={3} autoFocus
            />
            <div className="flex items-center gap-2 mt-2">
              <button onClick={handleAddCard} className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors">Adicionar cartão</button>
              <button onClick={() => setIsAddingCard(false)} className="px-4 py-2 text-text-secondary hover:bg-card-hover rounded-lg transition-colors">Cancelar</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCard(true)}
            className="w-full text-left p-3 flex items-center gap-2 text-text-secondary hover:bg-card-hover rounded-lg transition-colors"
            title="Adicionar um novo cartão a esta coluna"
          >
            <PlusIcon className="w-5 h-5" />
            Adicionar um cartão
          </button>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
