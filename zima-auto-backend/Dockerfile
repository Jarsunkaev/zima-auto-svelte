FROM node:18-alpine

WORKDIR /app

# Copy only necessary backend files
COPY package*.json ./
COPY server.js ./
COPY utils/ ./utils/
COPY public/ ./public/
COPY credentials/ ./credentials/
COPY templates/ ./templates/


# Install only production dependencies
RUN npm install --production

EXPOSE 3001

CMD ["node", "server.js"] 