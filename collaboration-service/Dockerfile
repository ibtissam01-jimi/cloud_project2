# Utilisation d'une image Node.js officielle
FROM node:16

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port
EXPOSE 5004

# Lancer l'application
CMD ["node", "index.js"]
