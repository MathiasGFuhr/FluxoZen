
import React from 'react';
import { Notification } from '../types';
import BellIcon from './icons/BellIcon';

interface NotificationPanelProps {
  notifications: Notification[];
}

const timeSince = (date: string): string => {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos";
    return "agora mesmo";
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-secondary rounded-xl shadow-2xl z-30 border border-card overflow-hidden">
        <div className="p-4 border-b border-card">
            <h3 className="font-bold text-lg">Notificações</h3>
        </div>
        <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
                <ul>
                    {notifications.map(notification => (
                        <li key={notification.id} className="p-4 border-b border-card hover:bg-card-hover transition-colors">
                            <p className="text-sm text-text-primary">{notification.message}</p>
                            <span className="text-xs text-text-secondary mt-1 block">{timeSince(notification.timestamp)}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-8 text-center text-text-secondary">
                    <BellIcon className="w-10 h-10 mx-auto opacity-30" />
                    <p className="mt-4 text-sm">Você não tem novas notificações.</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default NotificationPanel;
