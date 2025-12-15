// 定义 API 返回类型
declare namespace API {
    // 接口返回类型
    type Response<T> = {
        code?: number
        success?: boolean
        data?: T
        message?: string
        timestamp: number
    }
}