# Use Node 20 as the base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Ensure Ionic CLI can be found by npm scripts
ENV PATH="./node_modules/.bin:$PATH"

# Build the Ionic Vue app
RUN npm run build

# Expose the Vite preview server port
EXPOSE 4173

# Start the app using Vite's preview server
CMD ["npm", "run", "preview"]
