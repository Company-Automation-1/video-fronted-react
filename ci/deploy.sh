#!/bin/bash
set -e

# 部署阶段脚本（使用 docker-compose 部署容器）

echo "=== 开始部署阶段 ==="

echo "Docker 镜像: ${IMAGE}:latest"
echo "容器名称: ${APP_NAME}"

# 检查网络是否存在
echo "检查 Docker 网络: video"
if ! docker network inspect video >/dev/null 2>&1; then
    echo "创建 Docker 网络: video"
    docker network create video
fi

# 停止并删除旧容器（如果存在）
if docker ps -a --filter "name=${APP_NAME}" --format "{{.Names}}" | grep -q "^${APP_NAME}$"; then
    echo "停止并删除旧容器: ${APP_NAME}"
    docker compose -f docker-compose.yml up -d --force-recreate
fi

# 使用 docker-compose 部署
echo "使用 docker-compose 部署容器..."
IMAGE=${IMAGE} APP_NAME=${APP_NAME} \
    docker compose -f docker-compose.yml up -d

# 等待容器启动
echo "等待容器启动..."
sleep 3

# 检查容器状态
echo "容器状态:"
docker ps --filter "name=${APP_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# 清理悬空镜像
echo "清理悬空镜像..."
docker image prune -f >/dev/null 2>&1 || true

echo "=== 部署阶段完成 ==="
