FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app /app

RUN npm install 

EXPOSE 5173

CMD ["npm", "run", "start"]
