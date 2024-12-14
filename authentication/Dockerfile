FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./
COPY . .

RUN npm install

ENV PORT=5174

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host"]