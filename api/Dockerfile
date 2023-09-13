FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
COPY ./datas ./datas

RUN npm install

COPY . .

RUN chmod +x ready.sh
RUN npm run build

EXPOSE 3001

CMD ["sh", "ready.sh"]
