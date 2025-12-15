#!/bin/bash
set -e

# 构建阶段脚本（构建 Docker 镜像）

echo "=== 开始构建阶段 ==="

# 检查环境变量
DOCKER_IMAGE="${DOCKER_IMAGE:-video-frontend}"

echo "Docker 镜像: ${DOCKER_IMAGE}:latest"

# 如果存在旧镜像，删除它（确保重新构建）
if docker image inspect ${DOCKER_IMAGE}:latest >/dev/null 2>&1; then
    echo "发现旧镜像，删除中..."
    docker rmi ${DOCKER_IMAGE}:latest || true
fi

# 显示 Docker 版本信息
echo "Docker 版本信息:"
docker version | sed -n '1,5p'

# 构建 Docker 镜像（Dockerfile 中已经包含了 npm install 和 npm run build）
echo "构建 Docker 镜像..."
docker build -t ${DOCKER_IMAGE}:latest -f Dockerfile .

echo "=== 构建阶段完成 ==="
