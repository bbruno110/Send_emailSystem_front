'use client'
import React, { useState } from 'react';
import Card from './Card';
import { data } from '@/helpers/data'; // Import data
import { useRouter } from 'next/navigation'; // Import useRouter hook

const Cards: React.FC = () => {
    const router = useRouter(); // Initialize useRouter hook
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

    const selectAllCards = () => {
        setSelectedCards(sortedData.map(card => card.id)); // Select all cards
        setContextMenuVisible(false); // Hide context menu after selecting all
    };

    const getSelectedEmails = (): string[] => {
        return selectedCards
            .map(cardId => data.find(card => card.id === cardId)?.email)
            .filter(Boolean) as string[];
    };

    const sendEmail = () => {
        const emails = getSelectedEmails();
        if (emails.length === 0) {
            alert('Nenhum e-mail selecionado.');
            return;
        }

        console.log('Emails selecionados:', emails); // Log emails selecionados

        // Store emails in sessionStorage
        sessionStorage.setItem('selectedEmails', JSON.stringify(emails));

        // Redirect to '/Email'
        router.push(`/Email`);
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
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 select-none">
            {sortedData.map(({ id, nome, cnpj, email, telefone1, telefone2, dt_vencimento }) => (
                <div
                    key={id}
                    onContextMenu={(e) => handleContextMenu(e, id)}
                >
                    <Card
                        id={id}
                        nome={nome}
                        cnpj={cnpj}
                        email={email}
                        telefone1={telefone1}
                        telefone2={telefone2}
                        dt_vencimento={dt_vencimento}
                        selected={selectedCards.includes(id)}
                        onClick={() => handleCardClick(id)}
                        onContextMenu={(e) => handleContextMenu(e, id)}
                    />
                </div>
            ))}

            {selectedCards.length > 0 && contextMenuVisible && (
                <div
                    className="fixed z-50 bg-white border border-gray-300 shadow-lg p-2"
                    style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
                >
                    <button className="block w-full text-left py-2 px-4 hover:bg-gray-200" onClick={selectAllCards}>
                        Selecionar Todos
                    </button>
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
