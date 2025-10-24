
import React, { useState, useRef, useEffect } from 'react';
import { Task, Assignee } from '../types';
import TrashIcon from './icons/TrashIcon';
import Avatar from './Avatar';
import UserPlusIcon from './icons/UserPlusIcon';

interface KanbanCardProps {
  task: Task;
  columnId: string;
  onDragStart: (taskId: string, sourceColumnId: string) => void;
  requestDeleteTask: (taskId: string, columnId: string) => void;
  updateTask: (taskId: string, newContent: string) => void;
  availableAssignees: Assignee[];
  updateTaskAssignee: (taskId: string, assignee: Assignee | null) => void;
  isBeingDragged: boolean;
  isCompactView: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ task, columnId, onDragStart, requestDeleteTask, updateTask, availableAssignees, updateTaskAssignee, isBeingDragged, isCompactView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);
  const [isAssigneePopoverOpen, setIsAssigneePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsAssigneePopoverOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBlur = () => {
    updateTask(task.id, content.trim() || task.content);
    setIsEditing(false);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleBlur(); }
    if (e.key === 'Escape') { setContent(task.content); setIsEditing(false); }
  };
  const handleAssigneeSelect = (assignee: Assignee | null) => {
    updateTaskAssignee(task.id, assignee);
    setIsAssigneePopoverOpen(false);
  }

  const cardClasses = `
    my-2 rounded-lg shadow-sm transition-all duration-200 cursor-grab relative 
    border border-card-hover/20 bg-gradient-to-br from-card to-secondary/10
    ${isBeingDragged ? 'transform rotate-3 scale-105 shadow-2xl ring-2 ring-accent' : 'hover:bg-card-hover'}
    ${isCompactView ? 'p-2' : 'p-3'}
  `;

  return (
    <div
      draggable onDragStart={() => onDragStart(task.id, columnId)}
      onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      className={cardClasses}
    >
      {isEditing ? (
        <textarea
            value={content} onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur} onKeyDown={handleKeyDown} autoFocus
            className="w-full bg-transparent text-text-primary resize-none focus:outline-none"
            rows={isCompactView ? 1 : 3}
        />
      ) : (
        <div className="flex justify-between items-end gap-2">
          <p onClick={() => setIsEditing(true)} className="text-text-primary whitespace-pre-wrap break-words flex-grow" title="Clique para editar">
            {task.content}
          </p>
          {!isCompactView && (
            <div className="relative flex-shrink-0">
               <button onClick={() => setIsAssigneePopoverOpen(prev => !prev)} aria-label="Alterar responsável">
                  {task.assignee ? ( <Avatar name={task.assignee.name} /> ) : (
                      <div title="Adicionar responsável" className="w-7 h-7 rounded-full flex items-center justify-center bg-card-hover text-text-secondary hover:bg-accent hover:text-white transition-colors">
                          <UserPlusIcon className="w-4 h-4" />
                      </div>
                  )}
               </button>
               {isAssigneePopoverOpen && (
                  <div ref={popoverRef} className="absolute bottom-full right-0 mb-2 w-56 bg-secondary rounded-lg shadow-2xl z-20 p-2 border border-card">
                      <p className="text-xs text-text-secondary px-2 pb-2 font-semibold">Atribuir a</p>
                      <ul className="max-h-40 overflow-y-auto">
                          {availableAssignees.map(assignee => (
                              <li key={assignee.id}>
                                  <button onClick={() => handleAssigneeSelect(assignee)} className="w-full text-left flex items-center gap-2 p-2 rounded-md hover:bg-card-hover text-text-primary text-sm">
                                      <Avatar name={assignee.name} /> <span>{assignee.name}</span>
                                  </button>
                              </li>
                          ))}
                      </ul>
                      {availableAssignees.length > 0 && <div className="border-t border-card my-1"></div>}
                       <button onClick={() => handleAssigneeSelect(null)} className="w-full text-left p-2 rounded-md hover:bg-card-hover text-text-secondary text-sm">Remover atribuição</button>
                  </div>
               )}
            </div>
          )}
        </div>
      )}

      {isHovered && !isEditing && (
        <button
          onClick={() => requestDeleteTask(task.id, columnId)}
          className="absolute top-2 right-2 p-1 text-text-secondary hover:text-red-500 rounded-full transition-colors opacity-70 hover:opacity-100"
          title="Excluir tarefa"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default KanbanCard;
