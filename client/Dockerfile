# Use the official Node.js image as the base
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files
COPY package*.json ./

#install dependencies
RUN npm install

#Copy the rest of your applications
COPY . .

#Expose port 3000
EXPOSE 3000

#Command to run your app
CMD ["node", "app.js"]