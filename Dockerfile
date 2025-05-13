# 构建阶段
FROM node:14-alpine

WORKDIR /app

COPY package.json .

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install

COPY . .

RUN npm run build

# 生产阶段
FROM node:18-alpine

WORKDIR /app

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

RUN npm config set registry https://registry.npmmirror.com/

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]