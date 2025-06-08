# ================= Stage 1: 构建阶段 ================
FROM node:20.10.0-alpine3.19 AS base

# 添加源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories

# 安装 7za（7-Zip 命令行工具）
RUN apk add --no-cache p7zip

# ================= Stage 2: 安装 node-pty ================
FROM base AS deps-node-pty

# node-pty install
RUN apk add --no-cache g++ make py3-pip

# ================= Stage 3: 安装依赖 ================
FROM deps-node-pty as deps

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY desktop/package.json ./
COPY desktop/package-lock.json ./

# 安装构建所需依赖
RUN npm ci

# ================= Stage 4: 构建应用 ================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# 复制源码
COPY ./desktop .

# 构建 Next.js 应用
RUN npm run build

# ================= Stage 5: 运行阶段 - 最小化运行环境 ================
FROM base AS runner

# 设置工作目录
WORKDIR /app

ENV NODE_ENV production

# 复制 standalone 模式下的所有必要文件
COPY --from=builder --chown=1000:100 /app/.next/standalone ./
COPY --from=builder --chown=1000:100 /app/.next/static ./.next/static
COPY --from=builder --chown=1000:100 /app/public ./public

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "./server.js"]
