FROM node:20 as base
WORKDIR /
COPY package*.json ./
COPY yarn*.json ./

FROM base as build
RUN yarn install
COPY . .
RUN npm run build

FROM base as debug
RUN yarn install
COPY . .
CMD ["npm", "run", "start:dev"]

FROM base as prod   
ENV NODE_ENV=production
RUN yarn install --production
COPY --from=build /dist ./
CMD ["npm", "run", "start"]