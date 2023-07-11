# Use an official Node runtime as a parent image
FROM node:19-alpine as builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json to the working directory
COPY package*.json ./

RUN npm install
COPY . .
ENV GENERATE_SOURCEMAP=false
RUN npm run build:production

FROM nginx:1.22.1-alpine

COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]