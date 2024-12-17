FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install

ENV PORT=5173

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]