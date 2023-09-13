# Utilisez une image de base avec Node.js préinstallé
FROM node:14

# Créez le répertoire de travail dans le conteneur
WORKDIR /app

# Copiez le fichier package.json et package-lock.json (s'il existe)
COPY package*.json ./

# Installez les dépendances
RUN npm install

# Copiez tout le reste de l'application dans le répertoire de travail
COPY . .

# Compilez votre application TypeScript (assurez-vous que vous avez déjà un projet TypeScript fonctionnel)
RUN npm run build

# Exposez le port sur lequel votre application s'exécutera (ajustez-le selon vos besoins)
EXPOSE 3000

# Commande pour démarrer votre application (assurez-vous que cette commande correspond à votre application)
CMD ["npm", "start"]
