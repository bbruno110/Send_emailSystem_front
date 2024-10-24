'use client';

import React, { useState } from 'react';
import axiosInstance from '@/instance/axiosInstance';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, X, ArrowLeft } from 'lucide-react'; // Import the ArrowLeft icon
import { useRouter } from 'next/navigation'; // Import useRouter from 'next/navigation'

interface EmpresaData {
  id: number;
  ds_nome: string;
  cd_cnpj: string;
  nr_telefone_1: string;
  nr_telefone_2: string;
  ds_email: string;
  nr_repeticao: number;
  //ie_situacao: string;
  dt_processo: string;
  nr_valor: number;
  total_valor: number; // Soma do valor
  nr_cpf: string;
}

// Função para formatar CNPJ
const formatCNPJ = (cnpj: string | null | undefined) => {
  if (!cnpj) return ''; // Retorna uma string vazia se o CNPJ for nulo ou indefinido
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
};

// Função para formatar telefone
const formatTelefone = (telefone: string | null | undefined) => {
  if (!telefone) return ''; // Retorna uma string vazia se o telefone for nulo ou indefinido
  return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
};

// Função para formatar valor
const formatValor = (valor: number | string | null | undefined) => {
  if (valor === null || valor === undefined || valor === '') return '';

  // Converte valor para número, se necessário
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  // Verifica se a conversão resultou em um número válido
  if (isNaN(numero)) return '';

  // Converte o número para string e separa a parte inteira e decimal
  const valorString = numero.toFixed(2); // Garante que há duas casas decimais
  const [inteiro, decimal] = valorString.split('.');

  // Adiciona a formatação de milhar à parte inteira
  const parteInteiraFormatada = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Concatena a parte inteira e decimal com a vírgula e adiciona o símbolo
  return `R$ ${parteInteiraFormatada},${decimal}`;
};

// Função para formatar CPF
const formatCPF = (cpf: string | null | undefined) => {
  if (!cpf) return ''; // Retorna uma string vazia se o CPF for nulo ou indefinido
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
};


const columns: ColumnDef<EmpresaData, any>[] = [
  {
    accessorFn: row => row.id,
    id: 'id',
    header: 'ID',
  },
  {
    accessorFn: row => row.ds_nome,
    id: 'ds_nome',
    header: 'Nome',
  },
  {
    accessorFn: row => formatCNPJ(row.cd_cnpj), // Aplicando a máscara de CNPJ
    id: 'cd_cnpj',
    header: 'CNPJ',
  },
  {
    accessorFn: row => formatCPF(row.nr_cpf), // Aplicando a máscara de CNPJ
    id: 'nr_cpf',
    header: 'CPF',
  },
  {
    accessorFn: row => formatTelefone(row.nr_telefone_1), // Aplicando a máscara de telefone
    id: 'nr_telefone_1',
    header: 'Telefone 1',
  },
  {
    accessorFn: row => formatTelefone(row.nr_telefone_2), // Aplicando a máscara de telefone
    id: 'nr_telefone_2',
    header: 'Telefone 2',
  },
  {
    accessorFn: row => row.ds_email,
    id: 'ds_email',
    header: 'Email',
  },
  /*{
    accessorFn: row => row.ie_situacao,
    id: 'ie_situacao',
    header: 'Situação',
  },*/
  {
    accessorFn: row => new Date(row.dt_processo).toLocaleDateString(),
    id: 'dt_processo',
    header: 'Data de Processo',
  },
  {
    accessorFn: row => formatValor(row.nr_valor), // Aplicando a máscara de valor
    id: 'nr_valor',
    header: 'Valor',
  },
];

const Relatorio: React.FC = () => {
  const [data, setData] = useState<EmpresaData[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const router = useRouter(); // Initialize useRouter

  const fetchData = async () => {
    if (!startDate || !endDate) {
      alert('Por favor, insira ambas as datas.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.get('/empresas/intervalo-datas', {
        params: {
          dataInicio: startDate,
          dataFim: endDate,
        },
      });

      setData(response.data.empresas);
      setTotal(response.data.total || 0); // Ajuste para receber o total de valor
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setData([]); // Limpa os dados da tabela
    setTotal(0); // Limpa o total
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportToPDF = () => {
    if (data.length === 0) {
      alert('Nenhum dado para exportar.');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape' }); // Define a orientação para paisagem

    // Extract headers
    const headers = columns.map(col => col.header as string);

    // Extract body rows
    const body = table.getRowModel().rows.map(row => 
      columns.map(col => {
        const cellValue = row.getValue(col.id as string);
        return cellValue !== undefined ? String(cellValue) : '';
      })
    );

    autoTable(doc, {
      head: [headers],
      body: body as any[][],  // Type casting here to satisfy TypeScript
      theme: 'striped',
      didDrawPage: () => {
        // Add total to PDF
        doc.text(`Total de Processos: ${formatValor(total.toFixed(2))}`, 14, doc.internal.pageSize.height - 10);
      },
    });

    doc.save('relatorio.pdf');
  };

  const navigateToHistorico = () => {
    router.push('/Historico'); // Navigate to the historico page
  };

  return (
    <div className="w-full p-4">
      {/* Container for filters and buttons */}
      <div className="mb-4 flex flex-col md:flex-row items-start gap-4">
        {/* Filters section */}
        <div className="flex flex-col md:flex-row items-center mb-4 md:mb-0 gap-2">
          <label className="mr-2" htmlFor="startDate">Data Inicial:</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mr-4 border border-gray-300 p-2 rounded"
          />
          <label className="mr-2" htmlFor="endDate">Data Final:</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="mr-4 border border-gray-300 p-2 rounded"
          />
          <Button onClick={fetchData} className="flex items-center mr-2">
            <Calendar className="mr-2 h-4 w-4" />
            Buscar
          </Button>
          <Button onClick={clearFilters} className="flex items-center">
            <X className="mr-2 h-4 w-4" />
            Limpar
          </Button>
        </div>

        {/* Export and navigate buttons */}
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Button variant="outline" onClick={exportToPDF} className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Exportar para PDF
          </Button>
          <Button onClick={navigateToHistorico} className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Histórico
          </Button>
        </div>
      </div>

      {/* Total section */}
      <div className="mb-4">
        <label className="font-semibold">Total de Processos:</label>
        <span> {formatValor(total.toFixed(2))}</span>
      </div>

      {/* Table section */}
      {isLoading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="p-2 text-left">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Nenhum resultado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Relatorio;
