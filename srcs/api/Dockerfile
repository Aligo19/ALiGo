# Utilisez l'image de base Node.js
FROM node:16-alpine

# Définissez le répertoire de travail de l'application
WORKDIR /app

# Copiez les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./
COPY ./datas ./datas
# Installez les dépendances de l'application
RUN npm install

# Copiez le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Compilez l'application
RUN npm run build

# Exposez le port sur lequel l'application écoute
EXPOSE 3000

# Démarrez l'application
CMD ["npm", "run", "start:prod"]
