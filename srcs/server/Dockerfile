# Utilisez l'image Node.js comme base
FROM node:16-alpine

# Répertoire de travail dans le conteneur
WORKDIR /server

# Copiez les fichiers nécessaires du serveur (index.js, etc.)
COPY . .

# Installez les dépendances du serveur
RUN npm install

# Commande pour démarrer le serveur
CMD ["npm", "start"]
