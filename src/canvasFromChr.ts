export async function canvasFromChr(fileContent: string): Promise<HTMLCanvasElement> {
    // Define the constant palette with a magic number
    const NES_PALLETE :string =
        "808080" + "003DA6" + "0012B0" + "440096" + "A1005E" +
        "C70028" + "BA0600" + "8C1700" + "5C2F00" + "104500" +
        "054A00" + "00472E" + "004166" + "000000" + "050505" +
        "050505" + "C7C7C7" + "0077FF" + "2155FF" + "8237FA" +
        "EB2FB5" + "FF2950" + "FF2200" + "D63200" + "C46200" +
        "358000" + "058F00" + "008A55" + "0099CC" + "212121" +
        "090909" + "090909" + "FFFFFF" + "0FD7FF" + "69A2FF" +
        "D480FF" + "FF45F3" + "FF618B" + "FF8833" + "FF9C12" +
        "FABC20" + "9FE30E" + "2BF035" + "0CF0A4" + "05FBFF" +
        "5E5E5E" + "0D0D0D" + "0D0D0D" + "FFFFFF" + "A6FCFF" +
        "B3ECFF" + "DAABEB" + "FFA8F9" + "FFABB3" + "FFD2B0" +
        "FFEFA6" + "FFF79C" + "D7E895" + "A6EDAF" + "A2F2DA" +
        "99FFFC" + "DDDDDD" + "111111" + "111111"

    // Create an off-screen canvas
    const canvas: HTMLCanvasElement = document.createElement('canvas')
    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d')
  
    if (!ctx) {
      throw new Error('Canvas context is not supported.')
    }
  
    // Parse the palette data into an array of color values (e.g., 'rrggbb')
    const colors: string[] = []
    for (let i = 0; i < NES_PALLETE.length; i += 6) {
      const colorValue: string = NES_PALLETE.slice(i, i + 6)
      colors.push(colorValue)
    }
  
    // Assuming each sprite is 8x8 pixels
    const spriteSize = 8
  
    // Draw the sprites on the canvas based on the file content and palette
    for (let spriteId = 0; spriteId < 512; spriteId++) {
      const row = Math.floor(spriteId / 32)
      const col = spriteId % 32
  
      for (let pixelX = 0; pixelX < spriteSize; pixelX++) {
        for (let pixelY = 0; pixelY < spriteSize; pixelY++) {
          // Get the index of the pixel in the sprite data
          const pixelIndex = spriteId * spriteSize * spriteSize + pixelY * spriteSize + pixelX
  
          // @todo wrong algoritimo generate by chat gpt
          const pixelColor = fileContent.slice(pixelIndex * 2, pixelIndex * 2 + 2)
  
          // Find the corresponding color from the palette
          const colorIndex = parseInt(pixelColor, 16) % colors.length
          const colorValue = colors[colorIndex]
  
          // Draw the pixel on the canvas
          ctx.fillStyle = `#${colorValue}`
          ctx.fillRect(col * spriteSize + pixelX, row * spriteSize + pixelY, 1, 1)
        }
      }
    }
  
    // Return the canvas with the rendered sprites
    return canvas
}
  