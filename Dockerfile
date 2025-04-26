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
EXPOSE 7000
CMD ["npm", "run", "start"]
