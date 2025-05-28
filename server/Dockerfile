# Stage 1: Build the React app
FROM node:20-alpine AS build

RUN npm install -g nodemon

# Set the working directory
WORKDIR /portal_server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install pm2 -g && npm install

# Copy the rest of the application code
COPY . .


# Expose the port NGINX will run on
EXPOSE 5001

# Start pm2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
