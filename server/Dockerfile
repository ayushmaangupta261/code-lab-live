# Use Ubuntu base image
FROM ubuntu:22.04

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install tools for Node.js, building native modules, and compilers
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    python3 \
    python3-pip \
    g++ \
    openjdk-17-jdk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js 20 from NodeSource
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install -g npm@latest

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install Node.js dependencies inside container
RUN npm install

# Copy the rest of backend source code
COPY . .

# Make sure projects directory exists inside container
RUN mkdir -p /app/projects

# Expose backend port (Render will map it to $PORT)
EXPOSE 4000

# Start Node.js backend
CMD ["npm", "start"]
