# ================= Stage 1: 构建阶段 ================
FROM ghcr.io/yangws29/nextjs-desktop-docker-base-image:latest AS base

# 复制本地 7zzs 并设置权限
COPY bin/7zzs /usr/local/bin/7zzs
RUN chmod +x /usr/local/bin/7zzs && \
    ln -sf /usr/local/bin/7zzs /usr/local/bin/7z

# ================= Stage 2: 安装依赖 ================
FROM base as deps

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY desktop/package.json ./
COPY desktop/package-lock.json ./

# 安装构建所需依赖
RUN npm ci

# ================= Stage 3: 构建应用 ================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# 复制源码
COPY ./desktop .

# 构建 Next.js 应用
RUN npm run build

# ================= Stage 4: 运行阶段 - 最小化运行环境 ================
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
