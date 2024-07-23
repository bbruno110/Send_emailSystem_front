// Função para formatar CNPJ
export const formatCnpj = (value: string): string => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
  
    // Formatação: XX.XXX.XXX/XXXX-XX
    const formattedValue = numericValue
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  
    // Limita a quantidade de caracteres após a formatação
    return formattedValue.slice(0, 18); // CNPJ tem 14 caracteres formatados
  };
  
// Função para formatar números de telefone
export const formatPhoneNumber = (value: any): string => {
  // Assegura que `value` é uma string
  const stringValue = String(value);

  // Remove caracteres não numéricos
  const numericValue = stringValue.replace(/\D/g, '');

  // Verifica se o número possui 10 ou 11 dígitos
  if (numericValue.length === 10) {
    // Formatação para números com 10 dígitos: (XX) XXXX-XXXX
    return numericValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else if (numericValue.length === 11) {
    // Formatação para números com 11 dígitos: (XX) XXXXX-XXXX
    return numericValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else {
    // Retorna o valor original caso não seja um número válido
    return stringValue;
  }
};

export const formatCurrency = (value: string) => {
  if (!value) return ''; // Retorna uma string vazia se o valor for vazio

  // Remove todos os caracteres não numéricos
  const numericValue = value.replace(/\D/g, '');

  // Converte a string numérica para número e divide por 100
  const number = parseFloat(numericValue) / 100;

  // Converte o número para o formato desejado
  return number.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const parseCurrency = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  return parseFloat(numericValue) / 100;
};