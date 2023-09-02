# Use the official Node.js LTS image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Upgrade npm
RUN npm install -g npm@latest
# Install project dependencies, including pm2
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port your Express API listens on (change it to your actual port)
EXPOSE 8080

# Start the Express API using local pm2 binary
CMD ["pm2-runtime", "npm", "--", "start"]