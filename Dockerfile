FROM node:10

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "dev"]