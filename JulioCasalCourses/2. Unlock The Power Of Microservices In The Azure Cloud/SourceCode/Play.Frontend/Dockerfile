# build environment
FROM node:18.12 as build
ENV NODE_OPTIONS=--openssl-legacy-provider
WORKDIR /app
COPY package*.json .
RUN npm ci --production
COPY . .
RUN npm run build

# production environment
FROM nginx:1.22-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]