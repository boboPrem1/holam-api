# Specidie the base image to be installed from docker hub
FROM node:18-alpine

# Watch for changes in the code and restart the application
RUN npm install --location=global nodemon

# Create a directory to store the application code inside the image
WORKDIR /app

# Layer caching 
COPY package.json .
RUN npm install

# Copy the package.json and package-lock.json files to the image
COPY . .

# Install the dependencies
# RUN npm install

# Expose the port 3000
EXPOSE 5000

# Run the application
CMD [ "npm", "run", "dev" ]