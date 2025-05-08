FROM node:23-alpine3.20 AS builder
WORKDIR /app
COPY package*.json . 
RUN npm install
COPY . .
RUN npm run build

FROM node:23-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json . 
EXPOSE 7000 9229
# CMD ["npm", "run", "start"]
CMD ["node", "--inspect=0.0.0.0:9229", "dist/index.js"]
