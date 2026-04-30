FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json /app/
RUN npm ci
COPY . /app
ARG configuration=production
RUN npm run build -- --configuration $configuration

FROM nginx:alpine
WORKDIR /usr/share/nginx/html/
COPY --from=build /app/dist/index/browser/ .
RUN chmod -R 755 .

COPY --from=build /app/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["./docker-entrypoint.sh"]
