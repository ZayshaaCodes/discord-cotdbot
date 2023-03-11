FROM node

# app directory
WORKDIR /usr/src/app

# install libs
RUN npm install discord.js --save
RUN npm install dotenv --save
RUN npm install pngjs --save
RUN npm install canvas --save
RUN npm install fs --save

# set timezone to system time zone
RUN ln -snf /usr/share/zoneinfo/America/Los_Angeles /etc/localtime && echo America/Los_Angeles > /etc/timezone

RUN npm init -y

CMD [ "node", "src/app.js" ]