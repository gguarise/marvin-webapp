# Stage 1
FROM node:latest As builder
WORKDIR /usr/local/app
COPY . /usr/local/app
RUN npm install
RUN npm run build --prod --outputHashing=all
# Stage 2
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/local/app/dist/marvin-webapp /usr/share/nginx/html
EXPOSE 80