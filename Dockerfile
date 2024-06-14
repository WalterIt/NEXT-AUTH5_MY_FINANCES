# Use a imagem oficial do Node.js como base
FROM node:20.11.0

# Defina o diretório de trabalho dentro do contêiner  /home/wshir/NEXTJS/MFinances/client  /usr/src/app 
WORKDIR /usr/src/app

# Copie o arquivo package.json para o diretório de trabalho
COPY package.json ./

# Instale as dependências do projeto
RUN npm install 

# Copie todo o código-fonte do Next.js para o contêiner
COPY . .

RUN npm run build

COPY . .

# Execute o servidor Next.js em modo de desenvolvimento
CMD ["npm", "run", "dev"]