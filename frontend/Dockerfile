# Dockerfile for React Vite App (in frontend/ directory)

# --- Build Stage ---
# Use a Node.js image to build the React app
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend application files
COPY frontend/ ./

# Build the production version of the app
RUN npm run build

# --- Final Image Stage ---
# Use a lightweight Nginx image to serve the static files
FROM nginx:1.25-alpine

# Copy the built static files from the builder stage to the Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration file
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the Nginx server
EXPOSE 80

# Command to start Nginx
CMD ["nginx", "-g", "daemon off;"]
