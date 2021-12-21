# Stage 1
FROM node:latest As builder
# confiar na certificadora da MPS
WORKDIR /app
# instalar os pacotes via NPM
COPY package.json package-lock.json ./
RUN npm install
# compilar o projeto
COPY . .
ARG configuration=
RUN npm run build -- --configuration=$configuration
# Stage 2
FROM nginx:1.19.9-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/marvin-webapp /usr/share/nginx/html