FROM node:21-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

RUN npm install

RUN rm -rf node_modules package-lock.json

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:21-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY package*.json ./

RUN npm ci --only=production

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]