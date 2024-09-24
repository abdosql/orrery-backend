FROM node:14

WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies without cleaning cache
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 5090

# Start the application
CMD ["npm", "start"]