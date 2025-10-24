
import React from 'react';
import AlertTriangleIcon from './icons/AlertTriangleIcon';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-secondary rounded-xl shadow-2xl p-6 w-full max-w-md text-text-primary border border-card">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangleIcon className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{title}</h2>
            <p className="text-text-secondary mt-2">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:bg-card-hover rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-semibold"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
