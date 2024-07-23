'use client';

import React, { useEffect, useState } from 'react';
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
import { FileText, ArrowRight } from 'lucide-react'; // Import the ArrowRight icon
import { useRouter } from 'next/navigation'; // Import useRouter from 'next/navigation'

interface HistoricoData {
  id: number;
  empresa_id: number;
  perfil_id: number;
  ds_assunto: string;
  ds_conteudo: string;
  dt_envio: string;
}

const columns: ColumnDef<HistoricoData, any>[] = [
  {
    accessorFn: row => row.id,
    id: 'id',
    header: 'ID',
  },
  {
    accessorFn: row => row.empresa_id,
    id: 'empresa_id',
    header: 'Empresa ID',
  },
  {
    accessorFn: row => row.perfil_id,
    id: 'perfil_id',
    header: 'Perfil ID',
  },
  {
    accessorFn: row => row.ds_assunto,
    id: 'ds_assunto',
    header: 'Assunto',
  },
  {
    accessorFn: row => row.ds_conteudo,
    id: 'ds_conteudo',
    header: 'Conteúdo',
  },
  {
    accessorFn: row => new Date(row.dt_envio).toLocaleString(),
    id: 'dt_envio',
    header: 'Data de Envio',
  },
];

const Historico: React.FC = () => {
  const [data, setData] = useState<HistoricoData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/send-list');
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const exportToPDF = () => {
    const doc = new jsPDF();

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
    });

    doc.save('historico.pdf');
  };

  const navigateToOtherPage = () => {
    router.push('/Relatorio'); // Replace with your target page
  };

  return (
    <div className="w-full p-4">
      <div className="flex flex-col md:flex-row items-center md:items-start mb-4 gap-4">
        <Button variant="outline" onClick={exportToPDF} className="flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          Exportar para PDF
        </Button>
        <Button variant="outline" onClick={navigateToOtherPage} className="flex items-center">
          <ArrowRight className="mr-2 h-4 w-4" />
          Ir para outra página
        </Button>
      </div>
      {isLoading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="text-left p-2">
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
                    Nenhum resultado encontrado.
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

export default Historico;
