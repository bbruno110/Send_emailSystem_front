'use client'
import React, { useState } from 'react';
import Card from './Card';
import { data } from '@/helpers/data'; // Import data
import { useRouter } from 'next/navigation'; // Import useNavigation hook

const Cards: React.FC = () => {
  const navigation = useRouter(); // Initialize useNavigation hook
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const toggleCardSelection = (id: number) => {
    setSelectedCards((prevCards) =>
      prevCards.includes(id)
        ? prevCards.filter((cardId) => cardId !== id)
        : [...prevCards, id]
    );
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, id: number) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  const clearSelection = () => {
    setSelectedCards([]);
    setContextMenuVisible(false);
  };

  const getSelectedEmails = (): string => {
    return selectedCards.reduce((acc, cardId) => {
      const card = data.find((card) => card.id === cardId);
      return card ? `${acc},${card.email}` : acc; // Handle missing email gracefully
    }, '').slice(1); // Remove leading comma if any
  };

  const sendEmail = () => {
    const emails = getSelectedEmails();
    if (!emails) {
      alert('Nenhum e-mail selecionado.');
      return;
    }

    // Redirect to '/Email' with selected emails as query parameter
    navigation.push(`/Email?emails=${emails}`);
  };

  const handleCardClick = (id: number) => {
    if (selectedCards.length === 0) {
      setContextMenuVisible(false);
    }
    toggleCardSelection(id);
  };

  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a.dt_vencimento); // Convert strings to dates
    const dateB = new Date(b.dt_vencimento);
    if (dateA < dateB) return -1;
    if (dateA > dateB) return 1;
    return 0;
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {sortedData.map(({ id, nome, cnpj, email, telefone, data_criacao, dt_vencimento }) => (
        <Card
          key={id}
          id={id}
          nome={nome}
          cnpj={cnpj}
          email={email}
          telefone={telefone}
          data_criacao={data_criacao}
          dt_vencimento={dt_vencimento}
          selected={selectedCards.includes(id)}
          onClick={() => handleCardClick(id)}
          onContextMenu={(e) => handleContextMenu(e, id)}
        />
      ))}

      {selectedCards.length > 0 && contextMenuVisible && (
        <div
          className="fixed z-50 bg-white border border-gray-300 shadow-lg p-2"
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <button className="block w-full text-left py-2 px-4 hover:bg-gray-200" onClick={clearSelection}>
            Limpar seleção
          </button>
          <button className="block w-full text-left py-2 px-4 hover:bg-gray-200" onClick={sendEmail}>
            Enviar e-mail
          </button>
        </div>
      )}
    </div>
  );
};

export default Cards;