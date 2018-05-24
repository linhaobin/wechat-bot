FROM node:10.1.0-alpine

# Create app directory
WORKDIR /usr/src/app

# add npm package
COPY package.json yarn.lock /usr/src/app/

# install
RUN yarn

# copy code
COPY . /usr/src/app

# build
RUN yarn run ci

ENV PORT=80

EXPOSE 80

CMD yarn start