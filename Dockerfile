FROM node:19-alpine as builder

WORKDIR /app

COPY . .

RUN npm install
ENV GENERATE_SOURCEMAP=false
RUN npm run build:production

FROM node:19-alpine

WORKDIR /app

FROM nginx:1.22.1-alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]