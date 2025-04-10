FROM node:23-alpine3.20
WORKDIR /
COPY package*.json .
RUN npm i
COPY . .
RUN npm run build
EXPOSE 7000
# Mount the .env secret at build time (it won't persist)
# RUN --mount=type=secret,id=env_file cat /run/secrets/env_file > .env
# CMD [ "node", "dist/src/index.js" ]
CMD ["npm" ,"run" ,"start" ]