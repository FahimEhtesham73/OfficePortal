# Stage 1: Build the React app
FROM node:20-alpine AS build


# Set the working directory
WORKDIR /portal_client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Expose the port NGINX will run on
EXPOSE 5000

# Start NGINX
CMD ["npm", "start"]
