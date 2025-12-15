const _createDefaultImage = (): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        canvas.width = 100
        canvas.height = 100
        const ctx = canvas.getContext('2d')!

        ctx.fillStyle = 'red'
        if (ctx.roundRect) {
            ctx.roundRect(0, 0, 100, 100, 10)
            ctx.fill()
        } else {
            ctx.fillRect(0, 0, 100, 100)
        }

        ctx.fillStyle = 'white'
        ctx.font = 'bold 12px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('默认图片', 50, 50)

        canvas.toBlob((blob) => {
            resolve(URL.createObjectURL(blob!))
        }, 'image/jpeg', 0.95)
    })
}

const _cleanupVideo = (video: HTMLVideoElement) => {
    video.src = ''
    video.load()
}

export const getVideoFirstFrame = (file: File): Promise<string> => {
    return new Promise((resolve) => {
        const video = document.createElement('video')
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
            _createDefaultImage().then(resolve)
            return
        }

        video.preload = 'metadata'
        video.muted = true
        video.playsInline = true

        video.onloadedmetadata = () => {
            video.currentTime = 0.1
        }

        video.onseeked = () => {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

            canvas.toBlob((blob) => {
                if (blob) {
                    resolve(URL.createObjectURL(blob))
                } else {
                    _createDefaultImage().then(resolve)
                }
                _cleanupVideo(video)
            }, 'image/jpeg', 0.95)
        }

        video.onerror = () => {
            _createDefaultImage().then(resolve)
            _cleanupVideo(video)
        }

        video.src = URL.createObjectURL(file)
    })
}