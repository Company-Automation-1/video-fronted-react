import { useState, useEffect, useRef } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { IconArrowUp } from '../Icons'
import './index.css'

interface DialogProps {
    onSend?: (file: File, normalMode: boolean, perturbProb: number | null) => void
    hasStarted?: boolean
}

const Dialog = ({ onSend, hasStarted = false }: DialogProps) => {
    const [pendingFile, setPendingFile] = useState<{ file: File; url: string; type: 'image' | 'video' } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [normalMode, setNormalMode] = useState(false)
    const [numberValue, setNumberValue] = useState<number | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const revokeBlobUrl = (url: string) => {
        if (url.startsWith('blob:')) {
            URL.revokeObjectURL(url)
        }
    }

    const prepareFile = (file: File) => {
        const isVideo = file.type.startsWith('video/')
        const isImage = file.type.startsWith('image/')
        if (!isVideo && !isImage) return

        setPendingFile({
            file,
            url: URL.createObjectURL(file),
            type: isVideo ? 'video' : 'image'
        })
    }

    const clearPendingFile = () => {
        if (pendingFile) {
            revokeBlobUrl(pendingFile.url)
            setPendingFile(null)
        }
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) prepareFile(file)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSend = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!pendingFile || !onSend) return

        onSend(pendingFile.file, normalMode, numberValue)
        clearPendingFile()
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) prepareFile(file)
    }

    const handleBoxClick = () => {
        if (!pendingFile) fileInputRef.current?.click()
    }

    const stopPropagation = (e: React.MouseEvent) => e.stopPropagation()

    useEffect(() => {
        return () => {
            if (pendingFile) revokeBlobUrl(pendingFile.url)
        }
    }, [pendingFile])

    const isCompact = hasStarted && !pendingFile

    return (
        <div className="dialog-container">
            <div
                className={`dialog-box ${isDragging ? 'dialog-dragging' : ''} ${isCompact ? 'dialog-compact' : ''}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleBoxClick}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    className="dialog-input-hidden"
                    accept="image/*,video/*"
                />

                <div className={`dialog-content ${isCompact ? 'dialog-content-compact' : ''}`}>
                    <div className="dialog-center">
                        {pendingFile ? (
                            <div className="dialog-preview">
                                <div className="dialog-preview-box">
                                    {pendingFile.type === 'video' ? (
                                        <video src={pendingFile.url} className="dialog-preview-media" muted />
                                    ) : (
                                        <img src={pendingFile.url} alt="Preview" className="dialog-preview-media" />
                                    )}
                                    <button type="button" onClick={clearPendingFile} className="dialog-preview-close">
                                        <CloseOutlined className="dialog-preview-close-icon" />
                                    </button>
                                </div>
                                <p className="dialog-preview-name">{pendingFile.file.name}</p>
                            </div>
                        ) : (
                            <div className="dialog-placeholder">
                                <span>Click to upload or drag and drop</span>
                            </div>
                        )}
                    </div>

                    <div className="dialog-controls-row" onClick={stopPropagation}>
                        <div className="dialog-controls">
                            <button
                                type="button"
                                className={`dialog-mode-button ${normalMode ? 'dialog-mode-active' : ''}`}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setNormalMode(!normalMode)
                                }}
                            >
                                {normalMode ? '调试模式' : '普通模式'}
                            </button>
                            <input
                                type="number"
                                value={numberValue ?? 0.01}
                                min={0}
                                max={1}
                                step={0.01}
                                onChange={e => {
                                    const val = e.target.value
                                    setNumberValue(val ? Math.max(0, Math.min(1, +val)) : null)
                                }}
                                placeholder="范围0-1"
                                className="dialog-number-input"
                                onClick={stopPropagation}
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!pendingFile}
                            className={`dialog-send-button ${pendingFile ? 'dialog-send-enabled' : 'dialog-send-disabled'}`}
                        >
                            <IconArrowUp className="dialog-send-icon" />
                        </button>
                    </div>
                </div>

                {isDragging && (
                    <div className="dialog-drag-overlay">
                        <p className="dialog-drag-text">Drop file here</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dialog
