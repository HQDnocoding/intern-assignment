import type { PixelCrop } from "react-image-crop"

export async function cropImage(image: HTMLImageElement, crop: PixelCrop, fileName: string) {
  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext("2d")

  if (!ctx) {
    throw new Error("Canvas not supported")
  }

  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  )

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => {
      if (result) {
        resolve(result)
        return
      }
      reject(new Error("Failed to crop image"))
    }, "image/png")
  })

  return new File([blob], fileName, { type: blob.type })
}
