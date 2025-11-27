# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./

# install including devDependencies (vite is here)
RUN npm install --include=dev

COPY . .

# ensure vite has execute permission
RUN chmod +x node_modules/.bin/vite

# build react app
RUN npm run build

# Stage 2: Serve production
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
