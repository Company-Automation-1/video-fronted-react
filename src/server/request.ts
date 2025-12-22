import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios'
import type { MessageInstance } from 'antd/es/message/interface'
import { useAuthStore } from '../store'

interface RequestConfig extends AxiosRequestConfig {
    showError?: boolean
}

class Request {
    private instance: AxiosInstance
    private messageApi: MessageInstance | null = null

    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config)
        this.setupInterceptors()
    }

    setMessageApi(messageApi: MessageInstance) {
        this.messageApi = messageApi
    }

    private setupInterceptors() {
        // 请求拦截器
        this.instance.interceptors.request.use(
            (config) => {
                const token = useAuthStore.getState().token
                if (token) {
                    config.headers = config.headers || {}
                    config.headers.Authorization = `Bearer ${token}`
                }
                return config
            },
            (error: AxiosError) => {
                return Promise.reject(error)
            }
        )

        // 响应拦截器
        this.instance.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response
                // 如果响应是 Blob，直接返回
                if (data instanceof Blob) {
                    return data
                }
                // 如果有 code 或 success 字段，按标准格式处理
                if ('code' in data || 'success' in data) {
                    if (data.code >= 200 && data.code < 300 || data.success) {
                        return data
                    }
                    return Promise.reject(new Error(data.message || '请求失败'))
                }
                // 否则直接返回数据（兼容直接返回数据的情况）
                return data
            },
            (error: AxiosError) => {
                let errorMessage = '请求失败'
                
                if (error.response) {
                    const { status, data } = error.response
                    const config = error.config as RequestConfig
                    const showError = config?.showError !== false
                    
                    switch (status) {
                        case 401:
                            errorMessage = '未授权'
                            useAuthStore.getState().logout()
                            window.location.replace('/login')
                            break
                        case 403:
                            errorMessage = '没有权限'
                            break
                        case 404:
                            errorMessage = '请求的资源不存在'
                            break
                        case 500:
                            errorMessage = '服务器错误'
                            break
                        default:
                            errorMessage = (data as API.Response<unknown>)?.message || '请求失败'
                    }
                    
                    // 全局错误提示
                    if (showError && this.messageApi) {
                        this.messageApi.error(errorMessage)
                    }
                } else {
                    // 网络错误或其他错误
                    errorMessage = error.message || '网络错误'
                    const config = error.config as RequestConfig
                    const showError = config?.showError !== false
                    if (showError && this.messageApi) {
                        this.messageApi.error(errorMessage)
                    }
                }
                
                return Promise.reject(error?.response?.data)
            }
        )
    }

    get<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
        return this.instance.get(url, config)
    }

    post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        return this.instance.post(url, data, config)
    }

    put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<T> {
        return this.instance.put(url, data, config)
    }

    delete<T = unknown>(url: string, config?: RequestConfig): Promise<T> {
        return this.instance.delete(url, config)
    }

    upload<T = unknown>(
        url: string,
        formData: FormData,
        onProgress?: (progress: number) => void,
        config?: RequestConfig
    ): Promise<T> {
        return this.instance.post(url, formData, {
            ...config,
            headers: {
                ...config?.headers,
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                if (onProgress && progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(progress)
                }
            },
        })
    }

    postBlob(url: string, data?: unknown, config?: RequestConfig): Promise<Blob> {
        return this.instance.post(url, data, {
            ...config,
            responseType: 'blob',
        }).then((response) => {
            if (response instanceof Blob) {
                return response
            }
            return (response as AxiosResponse<Blob>).data
        })
    }
}

const request = new Request({
    baseURL: '',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default request

