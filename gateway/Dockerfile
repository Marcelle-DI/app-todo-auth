# Get the node 12 image
FROM node:12
# Create a folder called App
WORKDIR /app
# Copy everything apart from node modules into app folder
# See dockerignore file
COPY . /app
# run these commands
RUN ["npm", "install"]
# expose a port
EXPOSE 8080
# run this command at entrypoint/on start
ENTRYPOINT ["npm", "start"]