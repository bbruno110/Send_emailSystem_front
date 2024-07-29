import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '@/instance/axiosInstance';
import { useRouter } from 'next/navigation';
import Card from './Card'; // Certifique-se de que o caminho para o Card está correto
import ModalStatus from './modalStatus'; // Importa o componente ModalStatus

interface CardsProps {
  statusFilter: string;
  vencimentoFilter: string;
  startDate: string;
  endDate: string;
  currentPage: number;
  itemsPerPage: number;
}

const Cards: React.FC<CardsProps> = ({
  statusFilter,
  vencimentoFilter,
  startDate,
  endDate,
  currentPage,
  itemsPerPage
}) => {
  const router = useRouter();
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [cardsData, setCardsData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Referência para o menu de contexto
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCardsData = async () => {
      setLoading(true);
      setError(null); // Limpar qualquer erro anterior
      try {
        const response = await axiosInstance.get('/empresas/list', {
          params: {
            ie_status: statusFilter,
            start_date: startDate,
            end_date: endDate,
            pagina: currentPage,
            itensPorPagina: itemsPerPage,
            statusVencimento: vencimentoFilter
          }
        });
        clearSelection();
        setCardsData(response.data.empresas);
      } catch (error) {
        setError('Erro ao carregar os dados.');
        console.error('Erro ao carregar os dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCardsData();
  }, [statusFilter, vencimentoFilter, startDate, endDate, currentPage, itemsPerPage]);

  // Adiciona o listener para cliques fora do menu de contexto
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setContextMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleCardSelection = (id: number) => {
    setSelectedCards(prevCards =>
      prevCards.includes(id)
        ? prevCards.filter(cardId => cardId !== id)
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

  const openModalStatus = () => {
    setIsModalOpen(true);
  };

  const closeModalStatus = () => {
    setIsModalOpen(false);
  };

  const handleSaveStatus = async (status: string) => {
    try {
      // Atualiza o status das empresas no servidor
      await axiosInstance.put('/update-status', {
        ids: selectedCards,
        ie_status: status
      });
  
      // Atualiza os dados dos cartões após a alteração
      const response = await axiosInstance.get('/empresas/list', {
        params: {
          ie_status: statusFilter,
          start_date: startDate,
          end_date: endDate,
          pagina: currentPage,
          itensPorPagina: itemsPerPage,
          statusVencimento: vencimentoFilter
        }
      });
      setCardsData(response.data.empresas);
  
      // Limpa a seleção e fecha o modal
      clearSelection();
    } catch (error) {
      console.error('Erro ao alterar status:', error);
      alert('Erro ao alterar status.');
    } finally {
      closeModalStatus();
    }
  };

  const handleCardClick = (id: number) => {
    toggleCardSelection(id);
    if (selectedCards.length === 0) {
      setContextMenuVisible(false);
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const sortedData = [...cardsData].sort((a, b) => new Date(a.dt_vencimento).getTime() - new Date(b.dt_vencimento).getTime());

  return (
    <div className="relative">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 select-none">
        {sortedData.length > 0 ? (
          sortedData.map(({ id, ds_nome, cd_cnpj, ds_email, nr_telefone_1, nr_telefone_2, dt_vencimento, dt_processo, nr_valor, ie_status, nr_processo }) => (
            <div
              key={id}
              className={`card-container${selectedCards.includes(id) ? 'bg-gray-200 mt-[2px] mb-[2px] ' : ''}`}
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
                dt_processo={dt_processo}
                nr_valor={nr_valor}
                ie_status={ie_status}
                nr_processo={nr_processo}
                selected={selectedCards.includes(id)}
                onClick={() => handleCardClick(id)}
                onContextMenu={(e) => handleContextMenu(e, id)}
              />
            </div>
          ))
        ) : (
          <p>Nenhum cartão encontrado.</p>
        )}
      </div>

      {selectedCards.length > 0 && contextMenuVisible && (
        <div
          ref={contextMenuRef} // Adiciona a referência aqui
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
          <button className="block w-full text-left py-2 px-4 hover:bg-gray-200" onClick={openModalStatus}>
            Alterar status
          </button>
        </div>
      )}

      <ModalStatus
        isOpen={isModalOpen}
        onClose={closeModalStatus}
        onSave={handleSaveStatus}
      />
    </div>
  );
};

export default Cards;
