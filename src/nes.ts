export async function canvasFromChr(fileContent: string, paletteText: string, width: number, height: number): Promise<HTMLCanvasElement> {
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
    canvas.width = width
    canvas.height = height
  
    if (!ctx) {
      throw new Error('Canvas context is not supported.')
    }
  
    // Parse the palette data into an array of color values (e.g., 'rrggbb')
    const colors: string[] = []
    for (let i = 0; i < NES_PALLETE.length; i += 6) {
      const colorValue: string = NES_PALLETE.slice(i, i + 6)
      colors.push(colorValue)
    }
    const palette: number[] = []
    for (let i = 0; i < paletteText.length; i += 2) {
      palette.push(parseInt(paletteText.slice(i, i + 2), 16))
    }
  
    // Assuming each sprite is 8x8 pixels
    const spriteSize = 8
    const colorDepth = 2
    const spriteColumns = Math.floor(width/spriteSize)
    const lastSprite = Math.floor(fileContent.length/16)
  
    // Draw the sprites on the canvas based on the file content and palette
    for (let spriteId = 0; spriteId < lastSprite; spriteId++) {
      const row = Math.floor(spriteId / spriteColumns)
      const col = spriteId % spriteColumns

      for (let pixelX = 0; pixelX < spriteSize; pixelX++) {
        for (let pixelY = 0; pixelY < spriteSize; pixelY++) {
          // Get the index of the pixel in the sprite data
          const pixelIndex = spriteId * (spriteSize*colorDepth)
          
          // @todo wrong algoritimo generate by chat gpt
          const color1 = fileContent.slice(pixelIndex, pixelIndex + 8)
          const color2 = fileContent.slice(pixelIndex + 8, pixelIndex + 16)

          const pixelColor = ((color1.charCodeAt(pixelY) >> (7 - pixelX)) & 1) | (((color2.charCodeAt(pixelY) >> (7 - pixelX)) & 1) << 1)
          const indexColor = palette[pixelColor]
          const valueColor = colors[indexColor]
  
          // Draw the pixel on the canvas
          ctx.fillStyle = `#${valueColor}`
          ctx.fillRect(col * spriteSize + pixelX, row * spriteSize + pixelY, 1, 1)
        }
      }
    }
  
    // Return the canvas with the rendered sprites
    return canvas
}

export function isRom(fileContent: string): Boolean
{
  return fileContent.slice(0, 4) == "NES\x1a"
}

export function getBanks(fileContent: string): number
{
  return fileContent.charCodeAt(4)
}

export function chrFromRom(fileContent: string, bank: number): string
{
  // https://www.nesdev.org/wiki/INES
  function hasTraine(fileContent: string): Boolean {
    return !!(fileContent.charCodeAt(6) & 4)
  }

  const header = 16
  const chrTotal = 8192
  const chrSkip = chrTotal * bank
  const rom = 16384 * fileContent.charCodeAt(4)
  const traine = hasTraine(fileContent)? 512: 0
  const begin = header + traine + rom + chrSkip
  const end = begin + chrTotal

  return fileContent.slice(begin, end)
}
