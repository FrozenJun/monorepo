/**
 *
 * 导出功能
 * 如xlsx/word等
 */
export function downloadByData(
  data: BlobPart | string,
  filename?: string,
  mime?: string,
  bom?: BlobPart
) {
  let url = ''
  if (typeof data === 'string') {
    url = data
  } else {
    const blobData = typeof bom !== 'undefined' ? [bom, data] : [data]
    const blob = new Blob(blobData, { type: mime || 'application/octet-stream' })

    url = window.URL.createObjectURL(blob)
  }
  const tempLink = document.createElement('a')
  tempLink.style.display = 'none'
  tempLink.href = url
  tempLink.setAttribute('download', filename || '')
  if (typeof tempLink.download === 'undefined') {
    tempLink.setAttribute('target', '_blank')
  }
  document.body.appendChild(tempLink)
  tempLink.click()
  document.body.removeChild(tempLink)
  window.URL.revokeObjectURL(url)
}
