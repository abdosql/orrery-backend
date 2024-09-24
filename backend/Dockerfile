FROM node:14

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application code
COPY . .

# Verify installed packages
RUN npm list

EXPOSE 5090

# Start the application
CMD ["npm", "start"]