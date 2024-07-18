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
  export const formatPhoneNumber = (value: string): string => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/\D/g, '');
  
    // Formatação: (XX) XXXXX-XXXX
    const formattedValue = numericValue
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  
    // Limita a quantidade de caracteres após a formatação
    return formattedValue.slice(0, 15); // Telefone tem 15 caracteres formatados
  };