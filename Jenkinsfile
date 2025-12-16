pipeline {
    agent any
    options { 
        skipDefaultCheckout(true)
        // 构建历史保留策略
        buildDiscarder(logRotator(
            numToKeepStr: '10',        // 保留最近10次构建
            daysToKeepStr: '7',        // 保留7天内的构建
            artifactNumToKeepStr: '5'  // 保留最近5次构建的工件
        ))
        timeout(time: 30, unit: 'MINUTES')
    }

    triggers {
        cron('H/5 * * * *')  // 每5分钟执行一次
    }

    environment {
        IMAGE = 'video-frontend'      // Docker 镜像名
        APP_NAME = 'video-frontend'  // 容器名称
    }
    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
                // 给所有脚本文件添加执行权限
                sh 'chmod +x ci/*.sh'
            }
        }
        stage('Build') {
            steps {
                script {
                    // 使用 Jenkins 已配置的 Node 工具（Manage Jenkins → Global Tool Configuration）
                    def nodeHome = tool 'NodeJS-22'
                    env.PATH = "${nodeHome}/bin:${env.PATH}"
                }
                sh './ci/build.sh'
            }
        }
        stage('Deploy') {
            steps {
                sh './ci/deploy.sh'
            }
        }
    }
    // 后置处理块，用于在所有阶段执行完成后执行操作
    post {
        // cleanup：总是执行（推荐用于清理）
        cleanup { 
            // 清理 Jenkins 工作空间
            cleanWs() 
        }
    }
}
