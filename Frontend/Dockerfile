# Stage 1: Build the Vite application
FROM node:21-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Configure npm proxy settings (if needed)
# RUN npm config set proxy http://your-proxy-url:port
# RUN npm config set https-proxy http://your-proxy-url:port

# Increase npm timeout settings
RUN npm config set fetch-retry-mintimeout 20000
RUN npm config set fetch-retry-maxtimeout 120000

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the Vite application using a Node.js server
FROM node:21-alpine

# Set the working directory
WORKDIR /app

# Copy the built Vite application from the build stage
COPY --from=build /app/dist ./dist

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the server file
COPY server.js .

# Expose port 3000
EXPOSE 3000

# Start the Node.js server
CMD ["node", "server.js"]