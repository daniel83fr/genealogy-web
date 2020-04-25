FROM node:12.16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli
# If you are building your code for production
#RUN npm ci --only=production

# Bundle app source
COPY . .


EXPOSE 4200
#RUN npm run start
CMD ng serve --host 0.0.0.0

