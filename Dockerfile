# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project to the container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]