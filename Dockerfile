FROM node:18-alpine
WORKDIR /ani-rec
COPY package*.json ./
RUN npm install
COPY ./apps/api ./

WORKDIR /ani-rec
RUN npm install
EXPOSE 3000
RUN npm run build
CMD [ "node", "dist/index.js"]