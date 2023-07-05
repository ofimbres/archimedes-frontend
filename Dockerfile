# Use an official Node runtime as a parent image
FROM node:19

# Set the working directory to /app
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD ["npm", "run", "start:production"]