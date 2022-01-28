FROM node:17.4

WORKDIR /api
COPY package.json /api/
RUN npm install --silent
COPY . /api/

EXPOSE 3000
CMD ["npm", "start"]
