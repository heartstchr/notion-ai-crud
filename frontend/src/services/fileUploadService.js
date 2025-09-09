// File Upload Service using Netlify Blob
// Handles file uploads and returns URLs for Notion integration

class FileUploadService {
  constructor() {
    this.baseUrl = '/.netlify/functions'
  }

  /**
   * Upload files to Netlify Blob storage
   * @param {Array} files - Array of file objects
   * @returns {Promise<Array>} Array of uploaded file info with URLs
   */
  async uploadFiles(files) {
    if (!files || files.length === 0) {
      return []
    }

    try {
      // Create FormData
      const formData = new FormData()

      // Add files to FormData
      files.forEach((file) => {
        if (file.file instanceof File) {
          formData.append('files', file.file)
        } else if (file instanceof File) {
          formData.append('files', file)
        }
      })

      // Upload to Netlify function
      const response = await fetch(`${this.baseUrl}/upload-file`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Upload failed')
      }

      return result.files
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error(`Failed to upload files: ${error.message}`)
    }
  }

  /**
   * Upload a single file
   * @param {File} file - File object to upload
   * @returns {Promise<Object>} Uploaded file info with URL
   */
  async uploadFile(file) {
    const result = await this.uploadFiles([file])
    return result[0]
  }

  /**
   * Get file URL from blob key
   * @param {string} blobKey - The blob key
   * @returns {string} Public URL for the file
   */
  getFileUrl(blobKey) {
    return `${window.location.origin}/.netlify/functions/blob/${blobKey}`
  }

  /**
   * Validate file before upload
   * @param {File} file - File to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateFile(file, options = {}) {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/*'],
      allowedExtensions = [
        '.jpg',
        '.jpeg',
        '.png',
        '.gif',
        '.webp',
        '.svg',
        '.pdf',
        '.doc',
        '.docx',
        '.txt',
      ],
    } = options

    const errors = []

    // Check file size
    if (file.size > maxSize) {
      errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`)
    }

    // Check file type
    const isValidType = allowedTypes.some((type) => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1))
      }
      return file.type === type
    })

    if (!isValidType) {
      // Check by extension as fallback
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      const isValidExtension = allowedExtensions.includes(fileExtension)

      if (!isValidExtension) {
        errors.push(`File type not allowed. Allowed types: ${allowedTypes.join(', ')}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}

export default new FileUploadService()
