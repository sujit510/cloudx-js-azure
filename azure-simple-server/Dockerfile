FROM --platform=linux/amd64 node:20
WORKDIR /usr/src/app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]