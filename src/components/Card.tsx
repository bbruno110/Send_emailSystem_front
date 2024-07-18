
import React from 'react';
import { HiOutlineIdentification, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { HiDevicePhoneMobile } from "react-icons/hi2";
import { FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { usePathname } from 'next/navigation'; // Importando o hook usePathname
import { formatCnpj, formatPhoneNumber } from '@/helpers/format';

interface CardProps {
  id: number;
  nome: string;
  cnpj: string;
  email: string;
  telefone1: string;
  telefone2: string;
  data_criacao?: string;
  dt_vencimento: string;
  selected: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Card: React.FC<CardProps> = ({
  id,
  nome,
  cnpj,
  email,
  telefone1,
  telefone2,
  data_criacao,
  dt_vencimento,
  selected,
  onClick,
  onContextMenu,
}) => {
  const isDueSoon = isDateDueSoon(dt_vencimento);
  const isOverdue = isDateOverdue(dt_vencimento);

  // Determina a cor da borda com base na situação do vencimento
  let borderColorClass = 'border-gray-300'; // Cor padrão

  if (isOverdue) {
    borderColorClass = 'border-red-500'; // Card vencido
  } else if (isDueSoon) {
    borderColorClass = 'border-yellow-500'; // Card próximo a vencer
  }

  const pathname = usePathname(); // Obtendo o pathname atual

  return (
    <div
      className={`border rounded-lg p-4 mb-4 cursor-pointer ${selected ? 'bg-blue-100' : 'bg-white'} ${borderColorClass}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="flex items-center mb-2">
        <HiOutlineIdentification className="text-gray-600 mr-2" />
        <h2 className="text-lg font-bold">{nome}</h2>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlineIdentification className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">CNPJ: {formatCnpj(cnpj)}</p>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlineMail className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Email: {email}</p>
      </div>
      <div className="flex items-center mb-2">
        <HiOutlinePhone className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Telefone 1: {formatPhoneNumber(telefone1)}</p>
      </div>
      <div className="flex items-center mb-2">
        <HiDevicePhoneMobile className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Telefone 2: { formatPhoneNumber(telefone2)}</p>
      </div>
      <div className={`flex items-center ${isDueSoon ? 'text-yellow-800' : ''} ${isOverdue ? 'text-red-800' : ''}`}>
        <FiCalendar className="text-gray-400 mr-2" />
        <p className="text-sm text-gray-600">Data de Vencimento: {formatDate(dt_vencimento)}</p>
        {isDueSoon && (
          <FiAlertCircle className="ml-2 text-yellow-500" title="Próximo a vencer" />
        )}
        {isOverdue && (
          <FiAlertCircle className="ml-2 text-red-500" title="Vencido" />
        )}
      </div>
    </div>
  );
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

function isDateDueSoon(dt_vencimento: string): boolean {
  const dueDate = new Date(dt_vencimento);
  const currentDate = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(currentDate.getMonth() + 1);

  return dueDate > currentDate && dueDate <= oneMonthLater;
}

function isDateOverdue(dt_vencimento: string): boolean {
  const dueDate = new Date(dt_vencimento);
  const currentDate = new Date();

  return dueDate < currentDate;
}

export default Card;
