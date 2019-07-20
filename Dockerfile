FROM node:10

WORKDIR /code

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start" ]