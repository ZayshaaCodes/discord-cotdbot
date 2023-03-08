# just add the packages.json

FROM node

# Create app directory
WORKDIR /usr/src/app
# COPY ./src .

# install discord api
RUN npm install discord.js --save
RUN npm install dotenv --save
RUN npm install pngjs --save
RUN npm install canvas --save
RUN npm install fs --save

RUN npm init -y

# CMD [ "node", "dotenv" ]

# CMD [ "node", "src/index.js" ]
CMD [ "node", "src/app.js" ]