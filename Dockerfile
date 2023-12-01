FROM node:20.5.1-slim

RUN npm install -g @nestjs/cli@10.1.17
RUN npm install -g typescript

USER node

WORKDIR /home/node/app
COPY package.json .
COPY . .

CMD ["tail", "-f", "/dev/null"]