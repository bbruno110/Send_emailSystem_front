import React, { useState, useEffect } from 'react';
import Card from './Card';
import axiosInstance from '@/instance/axiosInstance';
import { useRouter } from 'next/navigation';

const Cards: React.FC = () => {
    const router = useRouter();
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [contextMenuVisible, setContextMenuVisible] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [cardsData, setCardsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCardsData = async () => {
            try {
                const response = await axiosInstance.get('/empresas/list');
                setCardsData(response.data);
                setLoading(false);
            } catch (error) {
                setError('Erro ao carregar os dados.');
                setLoading(false);
            }
        };

        fetchCardsData();
    }, []);

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
        setSelectedCards(cardsData.map(card => card.id));
        setContextMenuVisible(false);
    };

    const getSelectedEmails = (): string[] => {
        return selectedCards
            .map(cardId => cardsData.find(card => card.id === cardId)?.ds_email)
            .filter(Boolean) as string[];
    };

    const sendEmail = () => {
        const emails = getSelectedEmails();
        if (emails.length === 0) {
            alert('Nenhum e-mail selecionado.');
            return;
        }

        console.log('Emails selecionados:', emails);

        sessionStorage.setItem('selectedEmails', JSON.stringify(emails));
        router.push(`/Email`);
    };

    const handleCardClick = (id: number) => {
        if (selectedCards.length === 0) {
            setContextMenuVisible(false);
        }
        toggleCardSelection(id);
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const sortedData = [...cardsData].sort((a, b) => {
        const dateA = new Date(a.dt_vencimento);
        const dateB = new Date(b.dt_vencimento);
        return dateA.getTime() - dateB.getTime();
    });

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 select-none">
            {sortedData.map(({ id, ds_nome, cd_cnpj, ds_email, nr_telefone_1, nr_telefone_2, dt_vencimento }) => (
                <div
                    key={id}
                    className="card-container"
                    onContextMenu={(e) => handleContextMenu(e, id)}
                >
                    <Card
                        id={id}
                        nome={ds_nome}
                        cnpj={cd_cnpj}
                        email={ds_email}
                        telefone1={nr_telefone_1}
                        telefone2={nr_telefone_2}
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
