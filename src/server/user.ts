import request from './request'


/**
 * 登录
 * @param data 登录数据
 * @returns 登录结果
 */
export const login = async (data: {
    username: string
    password: string
}) => {
    return request.post<API.Response<{
        access_token: string
        expires_in: number
    }>>('/api/v1/auth/user/login', data)
}

/**
 * 发送验证码
 * @param data 发送验证码数据
 * @returns 发送验证码结果
 */
export const sendCode = async (data: {
    email: string
}) => {
    return request.post<API.Response<string>>('/api/v1/users/send-verification-code', data)
}

/**
 * 注册
 * @param data 注册数据
 * @returns 注册结果
 */
export const register = async (data: {
    username: string
    password: string
    email: string
    verificationCode: string
}) => {
    return request.post<API.Response<string>>('/api/v1/users/register', data)
}
