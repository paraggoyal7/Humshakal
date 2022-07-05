FROM node:12
WORKDIR /test-react-app
COPY package.json /test-react-app
RUN npm install
COPY . /test-react-app
CMD npm run start
EXPOSE 3000
