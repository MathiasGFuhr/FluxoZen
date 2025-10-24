import React from 'react';

const HelpPage: React.FC = () => {
    
  const faqs = [
    {
      question: "Como eu adiciono uma nova coluna?",
      answer: "No cabeçalho, clique no botão 'Adicionar Coluna'. Uma nova coluna chamada 'Nova Coluna' aparecerá no final do seu quadro. Clique no título para renomeá-la."
    },
    {
      question: "Como eu atribuo uma tarefa a alguém?",
      answer: "Em cada cartão de tarefa, você verá um ícone de avatar no canto inferior direito. Clique nele para abrir um menu com todos os membros do projeto. Selecione o membro desejado para atribuir a tarefa."
    },
    {
      question: "É possível reordenar as tarefas e colunas?",
      answer: "Sim! Para reordenar tarefas, clique e arraste um cartão para uma nova posição dentro da mesma coluna ou para uma coluna diferente. A reordenação de colunas ainda não está implementada."
    },
    {
      question: "Como eu edito o título de uma tarefa ou coluna?",
      answer: "Simplesmente clique no texto do título que deseja alterar. Uma caixa de edição aparecerá. Digite o novo título e pressione 'Enter' ou clique fora da caixa para salvar."
    }
  ];

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Obrigado pelo seu feedback!");
    const form = e.target as HTMLFormElement;
    form.reset();
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 text-text-primary">
      <h1 className="text-3xl font-bold text-accent">Ajuda & Feedback</h1>

      {/* FAQ Section */}
      <div className="bg-secondary p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Perguntas Frequentes (FAQ)</h2>
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <details key={index} className="bg-card p-4 rounded-lg cursor-pointer">
                    <summary className="font-semibold text-text-primary hover:text-accent transition-colors">{faq.question}</summary>
                    <p className="text-text-secondary mt-2">{faq.answer}</p>
                </details>
            ))}
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-secondary p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Envie seu Feedback</h2>
        <p className="text-text-secondary mb-4">Encontrou um bug? Tem alguma sugestão? Adoraríamos ouvir de você!</p>
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div>
                <label htmlFor="feedbackType" className="block text-sm font-semibold text-text-secondary mb-2">Tipo de Feedback</label>
                <select id="feedbackType" className="w-full p-3 bg-card rounded-lg border-2 border-transparent focus:border-accent focus:outline-none transition-colors">
                    <option>Sugestão</option>
                    <option>Relatar um Bug</option>
                    <option>Outro</option>
                </select>
            </div>
             <div>
                <label htmlFor="feedbackMessage" className="block text-sm font-semibold text-text-secondary mb-2">Sua Mensagem</label>
                <textarea 
                    id="feedbackMessage"
                    rows={5}
                    placeholder="Descreva sua sugestão ou o problema encontrado..."
                    className="w-full p-3 bg-card rounded-lg border-2 border-transparent focus:border-accent focus:outline-none transition-colors resize-y"
                    required
                ></textarea>
            </div>
            <div className="text-right">
                 <button type="submit" className="px-6 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors font-semibold">
                    Enviar Feedback
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default HelpPage;