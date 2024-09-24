FROM node:16

WORKDIR /usr/src/app

# Update npm to the latest version
RUN npm install -g npm@latest

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies without cleaning cache
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5090

# Start the application
CMD ["npm", "start"]