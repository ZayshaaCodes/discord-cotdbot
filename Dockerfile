FROM node

# app directory
WORKDIR /usr/src/app

# install libs
RUN npm install discord.js --save
RUN npm install dotenv --save
RUN npm install pngjs --save
RUN npm install canvas --save
RUN npm install fs --save

RUN npm init -y

CMD [ "node", "src/app.js" ]