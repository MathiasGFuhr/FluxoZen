
import React, { useState, useRef } from 'react';
import { Project, Assignee } from '../types';
import Avatar from '../components/Avatar';
import UploadIcon from '../components/icons/UploadIcon';
import XIcon from '../components/icons/XIcon';
import CheckIcon from '../components/icons/CheckIcon';
import AlertTriangleIcon from '../components/icons/AlertTriangleIcon';

interface SettingsPageProps {
  project: Project;
  onProjectUpdate: (updatedProject: Project) => void;
  onProjectDelete: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ project, onProjectUpdate, onProjectDelete }) => {
  const [projectName, setProjectName] = useState(project.name);
  const [projectLogo, setProjectLogo] = useState<string | null>(project.logo);
  const [members, setMembers] = useState<Assignee[]>(project.members);
  const [newMemberName, setNewMemberName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProjectLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemberName.trim() && !members.find(m => m.name === newMemberName.trim())) {
      setMembers([...members, { id: `user-${Date.now()}`, name: newMemberName.trim() }]);
      setNewMemberName('');
    }
  };

  const removeMember = (id: string) => {
    setMembers(members.filter(m => m.id !== id));
  };
  
  const handleSaveChanges = () => {
    onProjectUpdate({
      name: projectName.trim(),
      logo: projectLogo,
      members: members,
    });
    alert('Alterações salvas com sucesso!');
  };
  
  const handleDeleteProject = () => {
    if (window.confirm(`Tem certeza de que deseja excluir o projeto "${project.name}"? Esta ação não pode ser desfeita.`)) {
        onProjectDelete();
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-text-primary">
      <h1 className="text-3xl font-bold text-accent">Configurações do Projeto</h1>
      
      {/* Project Details */}
      <div className="bg-secondary p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Detalhes do Projeto</h2>
        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div 
              className="w-24 h-24 rounded-xl bg-card flex-shrink-0 flex items-center justify-center cursor-pointer border-2 border-dashed border-card-hover hover:border-accent transition-colors"
              onClick={() => fileInputRef.current?.click()}
              title="Clique para alterar a logo"
            >
              {projectLogo ? (
                <img src={projectLogo} alt="Logo do Projeto" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <div className="text-center text-text-secondary">
                  <UploadIcon className="w-8 h-8 mx-auto" />
                  <span className="text-xs mt-1 block">Logo</span>
                </div>
              )}
              <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
            </div>
            <div className="flex-grow">
              <label htmlFor="projectName" className="block text-sm font-semibold text-text-secondary mb-2">Nome do Projeto</label>
              <input
                id="projectName"
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Lançamento do Produto X"
                className="w-full p-3 bg-card rounded-lg border-2 border-transparent focus:border-accent focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Manage Members */}
      <div className="bg-secondary p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Gerenciar Membros</h2>
         <div>
            <form onSubmit={handleAddMember} className="flex gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Digite o nome do novo membro"
                className="flex-grow p-3 bg-card rounded-lg border-2 border-transparent focus:border-accent focus:outline-none transition-colors"
              />
              <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-semibold" title="Adicionar membro">Adicionar</button>
            </form>
            <div className="mt-4 flex flex-wrap gap-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-full">
                  <Avatar name={member.name} />
                  <span className="text-sm font-medium">{member.name}</span>
                  <button onClick={() => removeMember(member.id)} className="text-text-secondary hover:text-red-500" title={`Remover ${member.name}`}>
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
      </div>

      <div className="flex justify-end">
          <button 
            onClick={handleSaveChanges}
            className="flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-semibold"
            title="Salvar todas as alterações feitas nesta página"
          >
            <CheckIcon className="w-5 h-5" />
            Salvar Alterações
          </button>
      </div>
      
      {/* Danger Zone */}
      <div className="bg-secondary p-6 rounded-xl border border-red-500/30">
        <h2 className="text-xl font-semibold text-red-400 flex items-center gap-2"><AlertTriangleIcon className="w-6 h-6"/> Zona de Perigo</h2>
        <p className="text-text-secondary mt-2 mb-4">A exclusão de um projeto é uma ação permanente e não pode ser desfeita. Todos os dados associados, incluindo colunas e tarefas, serão perdidos para sempre.</p>
        <button 
            onClick={handleDeleteProject}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-colors font-semibold"
            title="Excluir o projeto permanentemente"
        >
            Excluir este projeto
        </button>
      </div>

    </div>
  );
};

export default SettingsPage;
