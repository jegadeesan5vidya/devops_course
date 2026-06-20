# FROM node:20-alpine

# WORKDIR /app

# COPY package*.json ./

# RUN npm install

# COPY . .

# ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

# RUN npm run build

# EXPOSE 5173
# CMD [ "npm", "run", "preview" ]

# ----- Build Stage ----- 
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ----- Run Stage ----- 
FROM node:20-alpine
WORKDIR /app
RUN npm i -g serve
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173" ]
