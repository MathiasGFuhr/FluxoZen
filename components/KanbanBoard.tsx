
import React, { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { Column, Task, Assignee } from '../types';
import KanbanColumn from './KanbanColumn';
import ConfirmationDialog from './ConfirmationDialog';

const initialColumnsData: Record<string, Column> = {
  'column-1': { id: 'column-1', title: 'A Fazer', taskIds: [] },
  'column-2': { id: 'column-2', title: 'Em Andamento', taskIds: [] },
  'column-3': { id: 'column-3', title: 'Concluído', taskIds: [] },
};
const initialColumnOrderData: string[] = ['column-1', 'column-2', 'column-3'];

export interface KanbanBoardHandle { addColumn: () => void; }
export interface KanbanBoardProps {
  availableAssignees: Assignee[];
  addNotification: (message: string) => void;
  isCompactView: boolean;
}
type DeletionTarget = { type: 'task'; taskId: string; columnId: string; content: string } | { type: 'column'; columnId: string; title: string } | null;


const KanbanBoard = forwardRef<KanbanBoardHandle, KanbanBoardProps>(({ availableAssignees, addNotification, isCompactView }, ref) => {
  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [columns, setColumns] = useState<Record<string, Column>>(initialColumnsData);
  const [columnOrder, setColumnOrder] = useState<string[]>(initialColumnOrderData);
  const [draggedItem, setDraggedItem] = useState<{ taskId: string; sourceColumnId: string } | null>(null);
  const [deletionTarget, setDeletionTarget] = useState<DeletionTarget>(null);

  const boardRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const startPanning = (e: React.MouseEvent) => {
    if (boardRef.current && (e.target as HTMLElement).contains(boardRef.current) ) {
      isPanning.current = true;
      startX.current = e.pageX - boardRef.current.offsetLeft;
      scrollLeft.current = boardRef.current.scrollLeft;
      boardRef.current.style.cursor = 'grabbing';
      boardRef.current.style.userSelect = 'none';
    }
  };
  const stopPanning = () => {
    isPanning.current = false;
    if (boardRef.current) {
      boardRef.current.style.cursor = 'grab';
      boardRef.current.style.userSelect = 'auto';
    }
  };
  const onPan = (e: React.MouseEvent) => {
    if (!isPanning.current || !boardRef.current) return;
    e.preventDefault();
    const x = e.pageX - boardRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    boardRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleDragStart = (taskId: string, sourceColumnId: string) => { setDraggedItem({ taskId, sourceColumnId }); };
  const handleDrop = (targetColumnId: string) => {
    if (!draggedItem) return;
    const { taskId, sourceColumnId } = draggedItem;
    if (sourceColumnId !== targetColumnId) {
      const sourceCol = columns[sourceColumnId];
      const targetCol = columns[targetColumnId];
      const newSourceTaskIds = sourceCol.taskIds.filter(id => id !== taskId);
      const newTargetTaskIds = [...targetCol.taskIds, taskId];
      setColumns({
        ...columns,
        [sourceColumnId]: { ...sourceCol, taskIds: newSourceTaskIds },
        [targetColumnId]: { ...targetCol, taskIds: newTargetTaskIds },
      });
    }
    setDraggedItem(null);
  };
  const addTask = (columnId: string, content: string) => {
    const newTaskId = `task-${Date.now()}`;
    setTasks({ ...tasks, [newTaskId]: { id: newTaskId, content } });
    const column = columns[columnId];
    setColumns({ ...columns, [columnId]: { ...column, taskIds: [...column.taskIds, newTaskId] } });
  };
  const updateTask = (taskId: string, newContent: string) => { setTasks({ ...tasks, [taskId]: { ...tasks[taskId], content: newContent } }); };
  const updateTaskAssignee = (taskId: string, assignee: Assignee | null) => {
    const task = tasks[taskId];
    if (assignee && task.assignee?.id !== assignee.id) {
        addNotification(`${assignee.name} foi atribuído(a) à tarefa "${task.content}"`);
    }
    setTasks(prev => ({ ...prev, [taskId]: { ...prev[taskId], assignee: assignee || undefined } }));
  };
  
  const requestDeleteTask = (taskId: string, columnId: string) => { setDeletionTarget({ type: 'task', taskId, columnId, content: tasks[taskId].content }); };
  const requestDeleteColumn = (columnId: string) => { setDeletionTarget({ type: 'column', columnId, title: columns[columnId].title }); };

  const handleConfirmDelete = () => {
    if (!deletionTarget) return;
    if (deletionTarget.type === 'task') {
      const { taskId, columnId } = deletionTarget;
      const newTasks = { ...tasks };
      delete newTasks[taskId];
      setTasks(newTasks);
      const column = columns[columnId];
      setColumns({ ...columns, [columnId]: { ...column, taskIds: column.taskIds.filter(id => id !== taskId) } });
    } else if (deletionTarget.type === 'column') {
      const { columnId } = deletionTarget;
      const columnTasks = columns[columnId].taskIds;
      const newTasks = { ...tasks };
      columnTasks.forEach(taskId => delete newTasks[taskId]);
      setTasks(newTasks);
      const newColumns = { ...columns };
      delete newColumns[columnId];
      setColumns(newColumns);
      setColumnOrder(columnOrder.filter(id => id !== columnId));
    }
    setDeletionTarget(null);
  };

  const addColumn = () => {
    const newColumnId = `column-${Date.now()}`;
    const newColumn: Column = { id: newColumnId, title: 'Nova Coluna', taskIds: [] };
    setColumns({ ...columns, [newColumnId]: newColumn });
    setColumnOrder([...columnOrder, newColumnId]);
  };
  useImperativeHandle(ref, () => ({ addColumn }));

  const updateColumnTitle = (columnId: string, newTitle: string) => { setColumns({ ...columns, [columnId]: { ...columns[columnId], title: newTitle } }); };

  return (
    <>
      <div 
        ref={boardRef}
        className="flex items-start gap-6 overflow-x-auto pb-4 h-full cursor-grab"
        onMouseDown={startPanning}
        onMouseLeave={stopPanning}
        onMouseUp={stopPanning}
        onMouseMove={onPan}
      >
        {columnOrder.map((columnId) => {
          const column = columns[columnId];
          const columnTasks = column.taskIds.map((taskId) => tasks[taskId]).filter(Boolean);
          return (
            <KanbanColumn
              key={column.id} column={column} tasks={columnTasks}
              onDragStart={handleDragStart} onDrop={handleDrop}
              addTask={addTask} updateTask={updateTask}
              requestDeleteTask={requestDeleteTask}
              updateColumnTitle={updateColumnTitle}
              requestDeleteColumn={requestDeleteColumn}
              availableAssignees={availableAssignees}
              updateTaskAssignee={updateTaskAssignee}
              draggedTaskId={draggedItem?.taskId}
              isCompactView={isCompactView}
            />
          );
        })}
      </div>
      {deletionTarget && (
        <ConfirmationDialog
          isOpen={!!deletionTarget}
          onClose={() => setDeletionTarget(null)}
          onConfirm={handleConfirmDelete}
          title={deletionTarget.type === 'task' ? 'Excluir Tarefa' : 'Excluir Coluna'}
          message={`Tem certeza que deseja excluir "${deletionTarget.type === 'task' ? deletionTarget.content : deletionTarget.title}"? Esta ação não pode ser desfeita.`}
        />
      )}
    </>
  );
});

export default KanbanBoard;
