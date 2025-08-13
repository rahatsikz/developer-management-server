# Dockerfile
FROM node:20

WORKDIR /app

# Copy only what's needed for install
COPY package.json ./
# RUN npm ci --only=production
COPY prisma ./prisma     
RUN npm install

# Now copy everything else
COPY . .

RUN npm run build

EXPOSE 5000

CMD ["node", "dist/server.js"]
