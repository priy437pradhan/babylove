// Compress an image file to a data URL (JPEG) so it can live inside the
// event payload. In mock mode this is stored in localStorage, so we keep
// photos small. When the real backend arrives, swap this for an upload
// endpoint (POST /api/uploads -> { url }) and store that URL instead —
// only ImageInput.jsx needs to change.
export function compressImageFile(file, maxDim = 1100, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file'))
      return
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the file'))
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale)
        const h = Math.round(img.height * scale)
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.onerror = () => reject(new Error('Could not load that image'))
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
