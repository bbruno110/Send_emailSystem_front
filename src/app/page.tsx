'use client';
import React, { useState, useEffect } from 'react';
import Combobox from '@/components/ui/comboBox';
import axiosInstance from '@/instance/axiosInstance';
import Cards from '@/components/Cards';

const Home: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [vencimentoFilter, setVencimentoFilter] = useState<string>('');
  const [dateFilterStart, setDateFilterStart] = useState<string>(formatDate(new Date(new Date().getFullYear(), new Date().getMonth(), 1)));
  const [dateFilterEnd, setDateFilterEnd] = useState<string>(formatDate(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)));
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'Oposição', label: 'Oposição' },
    { value: 'Indeferimento', label: 'Indeferimento' },
    { value: 'Concessão', label: 'Concessão' },
    { value: 'Nulidade', label: 'Nulidade' },
  ];

  const vencimentoOptions = [
    { value: '', label: 'Todos' },
    { value: 'vencidas', label: 'Vencidos' },
    { value: 'proximas', label: 'Próximo a Vencer' },
    { value: 'naoVencidas', label: 'No Prazo' },
  ];

  const itemsPerPageOptions = [
    { value: '10', label: '10 itens por página' },
    { value: '50', label: '50 itens por página' },
    { value: '100', label: '100 itens por página' },
  ];

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get('/empresas/list', {
        params: {
          status: statusFilter,
          start_date: dateFilterStart,
          end_date: dateFilterEnd,
          page: currentPage,
          items_per_page: itemsPerPage,
          statusVencimento: vencimentoFilter
        }
      });

      const totalItems = response.data.totalItems;
      const totalPaginas = Math.ceil(totalItems / itemsPerPage);

      setTotalPages(totalPaginas);

      if (currentPage > totalPaginas) {
        setCurrentPage(totalPaginas);
      }
    } catch (error) {
      console.error('Erro ao carregar os dados.', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, vencimentoFilter, dateFilterStart, dateFilterEnd, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-blue-100 min-h-screen flex flex-col items-center justify-start py-4 px-4">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-8 max-w-4xl w-full flex flex-col">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center select-none">Lista de Empresas</h1>

        {/* Filtros */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between mb-6">
          <Combobox
            value={statusFilter}
            onSelect={setStatusFilter}
            options={statusOptions}
            placeholder="Filtrar por status"
            className="w-full md:w-[200px] z-40"
          />
          <Combobox
            value={vencimentoFilter}
            onSelect={setVencimentoFilter}
            options={vencimentoOptions}
            placeholder="Filtrar por vencimento"
            className="w-full md:w-[200px] z-30"
          />
          <input
            type="date"
            value={dateFilterStart}
            onChange={(e) => setDateFilterStart(e.target.value)}
            className="border p-1 rounded w-full md:w-[200px] text-sm"
            style={{ height: '2.5rem', lineHeight: '1.5rem' }}
          />
          <input
            type="date"
            value={dateFilterEnd}
            onChange={(e) => setDateFilterEnd(e.target.value)}
            className="border p-1 rounded w-full md:w-[200px] text-sm"
            style={{ height: '2.5rem', lineHeight: '1.5rem' }}
          />
        </div>

        {/* Lista de cartões */}
        <div className="flex-grow">
          <Cards
            statusFilter={statusFilter}
            vencimentoFilter={vencimentoFilter}
            startDate={dateFilterStart}
            endDate={dateFilterEnd}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        </div>

        {/* Paginação */}
        <div className="flex flex-col md:flex-row md:justify-between items-center mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-2 md:mb-0"
          >
            Anterior
          </button>
          <div className="flex items-center mb-2 md:mb-0 whitespace-nowrap">
            <span className="text-sm mr-2">
              Página {currentPage} de {totalPages}
            </span>
            <Combobox
              value={itemsPerPage.toString()}
              onSelect={(value: string) => {
                setItemsPerPage(Number(value));
              }}
              direction='up'
              options={itemsPerPageOptions}
              placeholder="Itens por página"
              className="w-full md:w-[190px]"
            />
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export default Home;
