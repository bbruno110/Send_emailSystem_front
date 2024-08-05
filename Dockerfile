# Use uma imagem Node.js oficial como base
FROM node:19

# Crie e defina o diretório de trabalho
WORKDIR /email-sends

# Copie os arquivos de definição de dependências
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie os arquivos do projeto
COPY . .

# Execute o build
RUN npm run build

# Exponha a porta que sua aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run","start"]
