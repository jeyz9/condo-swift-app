FROM node:22 AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

RUN ls -la /app/dist

FROM nginx:latest
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/dist .
CMD ["nginx", "-g", "daemon off;"]