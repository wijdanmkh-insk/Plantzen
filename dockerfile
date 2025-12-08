FROM node:22.14.0

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 5173

CMD ["npm", "start", "dev", "--", "--host"]