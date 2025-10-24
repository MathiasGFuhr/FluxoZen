
import React, { useState, useRef } from 'react';
import { Project, Assignee } from '../types';
import Avatar from '../components/Avatar';
import UploadIcon from '../components/icons/UploadIcon';
import CopyIcon from '../components/icons/CopyIcon';
import XIcon from '../components/icons/XIcon';

interface CreateProjectPageProps {
  onProjectCreate: (project: Project) => void;
}

const CreateProjectPage: React.FC<CreateProjectPageProps> = ({ onProjectCreate }) => {
  const [projectName, setProjectName] = useState('');
  const [projectLogo, setProjectLogo] = useState<string | null>(null);
  const [members, setMembers] = useState<Assignee[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
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
  
  const generateInviteLink = () => {
      const newLink = `https://fluxozen.app/invite/${Math.random().toString(36).substring(2, 10)}`;
      setInviteLink(newLink);
  };

  const copyLink = () => {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleCreateProject = () => {
    if (projectName.trim()) {
      onProjectCreate({
        name: projectName.trim(),
        logo: projectLogo,
        members: members,
      });
    }
  };

  return (
    <div className="min-h-screen bg-primary text-text-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-secondary rounded-2xl shadow-2xl p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-accent">Crie seu novo projeto</h1>
          <p className="text-center text-text-secondary mt-2">Dê um nome, personalize e convide sua equipe para começar.</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-6">
            <div 
              className="w-24 h-24 rounded-xl bg-card flex-shrink-0 flex items-center justify-center cursor-pointer border-2 border-dashed border-card-hover hover:border-accent transition-colors"
              onClick={() => fileInputRef.current?.click()}
              title="Clique para carregar uma logo"
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

          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Convidar Equipe</label>
            <form onSubmit={handleAddMember} className="flex gap-2">
              <input
                type="text"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                placeholder="Digite o nome do membro"
                className="flex-grow p-3 bg-card rounded-lg border-2 border-transparent focus:border-accent focus:outline-none transition-colors"
              />
              <button type="submit" className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-semibold" title="Adicionar membro à equipe">Adicionar</button>
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
          
          <div>
            <label className="block text-sm font-semibold text-text-secondary mb-2">Gerar link de convite</label>
            {inviteLink ? (
                 <div className="flex gap-2">
                    <input type="text" value={inviteLink} readOnly className="flex-grow p-3 bg-card text-text-secondary rounded-lg" />
                    <button onClick={copyLink} className="px-4 py-2 bg-card-hover hover:bg-accent text-white rounded-lg transition-colors font-semibold flex items-center gap-2" title="Copiar link de convite">
                       <CopyIcon className="w-5 h-5" />
                       {copied ? 'Copiado!' : 'Copiar'}
                    </button>
                </div>
            ) : (
                <button onClick={generateInviteLink} className="w-full p-3 bg-card-hover hover:bg-accent text-white rounded-lg transition-colors font-semibold">
                    Gerar link
                </button>
            )}
          </div>
        </div>

        <button
          onClick={handleCreateProject}
          disabled={!projectName.trim()}
          className="w-full p-4 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-bold text-lg disabled:bg-card disabled:text-text-secondary disabled:cursor-not-allowed"
          title={!projectName.trim() ? "Digite um nome para o projeto" : "Criar o projeto"}
        >
          Criar Projeto
        </button>
      </div>
    </div>
  );
};

export default CreateProjectPage;
