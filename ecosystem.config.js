module.exports = {
    apps: [
      {
        name: 'email-sends', // Nome da aplicação
        script: 'node_modules/next/dist/bin/next', // Caminho para o script Next.js
        args: 'start -p 3000', // Argumentos para iniciar o Next.js na porta 3000
        env: {
          NODE_ENV: 'development', // Variáveis de ambiente para o modo de desenvolvimento
          // Adicione outras variáveis de ambiente aqui, se necessário
        },
        env_production: {
          NODE_ENV: 'production', // Variáveis de ambiente para o modo de produção
          // Adicione outras variáveis de ambiente aqui, se necessário
        },
        cwd: './', // Diretório de trabalho da aplicação
        exec_mode: 'cluster', // Modo de execução em cluster (opcional)
        instances: 1, // Número de instâncias para executar (pode ser ajustado conforme a necessidade)
        watch: false, // Habilitar a observação de arquivos (opcional)
      }
    ]
  };
  