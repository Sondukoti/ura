export const readFileAsBase64 = (file: File): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Uint8Array(reader.result))
      } else if (typeof reader.result === 'string') {
        // Convert base64 string to Uint8Array
        const binaryString = window.atob(reader.result.split(',')[1])
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i)
        }
        resolve(bytes)
      } else {
        reject(new Error('Failed to read file'))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export const extractTextFromPDF = async (file: File): Promise<Uint8Array> => {
  // For now, just return an empty array since PDF extraction requires additional libraries
  // You can implement proper PDF text extraction using libraries like pdf.js later
  return new Uint8Array()
} 