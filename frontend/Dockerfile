# First stage: build the frontend
FROM node:16 AS build

# Set the working directory
WORKDIR /src

# Copy package.json and package-lock.json for efficient caching
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the source code
COPY . .

# run npm start
EXPOSE 3000
CMD ["npm", "start", "--port=3000"]


