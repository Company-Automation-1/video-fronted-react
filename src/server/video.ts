/* eslint-disable @typescript-eslint/no-explicit-any */
import request from './request'

/**
 * 处理图片
 * @param formData 表单数据（包含 file, perturb_prob, visual_debug）
 * @returns 处理后的图片 Blob
 */
export const processImage = async (formData: FormData, options?: { [key: string]: any }): Promise<Blob> => {
    return request.postBlob('/api/py/process_image', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        ...(options || {}),
    })
}

/**
 * 处理视频
 * @param formData 表单数据（包含 file, perturb_prob, visual_debug）
 * @returns 任务 ID
 */
export const processVideo = async (formData: FormData, options?: { [key: string]: any }): Promise<{ task_id: string }> => {
    return request.post<{ task_id: string }>('/api/py/process_video', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        ...(options || {}),
    })
}

/**
 * 获取视频处理结果 URL
 * @param taskId 任务 ID
 * @returns 视频 URL（相对路径，会被代理处理）
 */
export const getVideoResultUrl = (taskId: string) => {
    return `/api/py/video_result/${taskId}`
}

