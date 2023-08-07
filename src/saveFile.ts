export function saveFile(fileContent: string | HTMLCanvasElement, fileName: string) {
    function getLinkFromBlob(fileContent: string): string {
      const binaryArray = new Uint8Array(fileContent.length)
      for (let i = 0; i < fileContent.length; i++) {
        binaryArray[i] = fileContent.charCodeAt(i)
      }
    
      const blob = new Blob([binaryArray], { type: 'application/octet-stream' })
      return URL.createObjectURL(blob)
   } 
   
   function getLinkFromCanvas(fileContent: HTMLCanvasElement, fileExtension: string): string {
      return fileContent.toDataURL(`image/${fileExtension}`)
   }

    const ext = fileName.slice(fileName.lastIndexOf('.'))
    const url = typeof fileContent == 'string'?
      getLinkFromBlob(fileContent):
      getLinkFromCanvas(fileContent, ext)
  
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.target = "_blank"
    downloadLink.download = fileName
  
    downloadLink.click()
  
    URL.revokeObjectURL(url)
}
