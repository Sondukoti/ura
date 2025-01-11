import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import styles from '@/styles/FileUploader.module.css'

interface FileUploaderProps {
  onUpload: (files: File[]) => void
  isUploading: boolean
  accept: string
}

export const FileUploader = ({ onUpload, isUploading, accept }: FileUploaderProps) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    onUpload(acceptedFiles)
  }, [onUpload])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, curr) => ({ ...acc, [curr]: [] }), {}),
    maxFiles: 5,
    maxSize: 10485760 // 10MB
  })

  return (
    <div className={styles.uploaderWrapper}>
      <div {...getRootProps()} className={styles.dropzone}>
        <input {...getInputProps()} />
        <button type="button" className={styles.uploadButton}>
          {isUploading ? (
            <i className="fas fa-spinner fa-spin" />
          ) : (
            <i className="fas fa-paperclip" />
          )}
        </button>
      </div>
    </div>
  )
} 