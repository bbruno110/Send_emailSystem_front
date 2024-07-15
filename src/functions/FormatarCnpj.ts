export const formatarCNPJ = (value: string): string => {
    console.log('Valor recebido:', value); // Verifique se está recebendo o valor corretamente

    const onlyNums = value.replace(/[^\d]/g, ''); // Remove tudo que não é dígito
    console.log('Apenas números:', onlyNums); // Verifique se está removendo corretamente os caracteres não numéricos

    let formatted = '';
    if (onlyNums.length >= 2) {
        formatted += onlyNums.substring(0, 2) + '.';
    }
    if (onlyNums.length >= 5) {
        formatted += onlyNums.substring(2, 5) + '.';
    }
    if (onlyNums.length >= 8) {
        formatted += onlyNums.substring(5, 8) + '/';
    }
    if (onlyNums.length >= 12) {
        formatted += onlyNums.substring(8, 12) + '-';
    }
    if (onlyNums.length >= 14) {
        formatted += onlyNums.substring(12, 14);
    }

    console.log('Valor formatado:', formatted); // Verifique o valor formatado antes de retornar

    return formatted;
};
