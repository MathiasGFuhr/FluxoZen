import React from 'react';

interface AvatarProps {
  name: string;
}

const getInitials = (name: string): string => {
  if (!name) return '';
  const names = name.split(' ');
  const initials = names.map(n => n[0]).join('');
  return initials.slice(0, 2).toUpperCase();
};

const generateColor = (name: string): string => {
    let hash = 0;
    if (name.length === 0) return 'hsl(0, 0%, 70%)';
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }
    const hue = hash % 360;
    return `hsl(${hue}, 50%, 60%)`;
};

const Avatar: React.FC<AvatarProps> = ({ name }) => {
  const initials = getInitials(name);
  const bgColor = generateColor(name);

  return (
    <div
      title={name}
      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white select-none"
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  );
};

export default Avatar;
