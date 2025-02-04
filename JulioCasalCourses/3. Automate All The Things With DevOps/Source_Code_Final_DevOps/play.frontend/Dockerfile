# build environment
FROM node:16.13 as build
WORKDIR /app
COPY package*.json .
RUN npm ci --production
COPY . .
RUN npm run build

# production environment
FROM nginx:1.21-alpine
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d
CMD ["nginx", "-g", "daemon off;"]