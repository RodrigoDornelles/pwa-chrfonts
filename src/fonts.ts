import { printInterface, fontInterface } from "./interfaces"

async function canvasFromFont(char: string, font: fontInterface): Promise<HTMLCanvasElement> {
    const canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D  
    const size = font.height
    canvas.width = font.width
    canvas.height = font.height

    ctx.font = `${size}px ${font.family}`;
    ctx.fillStyle = `#${font.colors[1]}FF`
    ctx?.fillText(char, 0, font.height)
    const raw = ctx.getImageData(0, 0,  font.width, font.height)

    for (let i = 0; i < raw.data.length; i += 4) {
        const alpha = raw.data[i + 3]
        if (alpha >= font.weight) {
            const x = (i / 4) % font.width
            const y = Math.floor(i / (4 * font.width))
            ctx.fillRect(x, y, 1, 1)
        }
    }

    ctx.fillStyle = `#${font.colors[0]}FF`
    for (let i = 0; i < raw.data.length; i += 4) {
        const alpha = raw.data[i + 3]
        if (alpha <= font.weight) {
            const x = (i / 4) % font.width
            const y = Math.floor(i / (4 * font.width))
            ctx.fillRect(x, y, 1, 1)
        }
    }

    return canvas
}

export async function canvasFromPrint(cfg: printInterface): Promise<HTMLCanvasElement> {
    const canvas: HTMLCanvasElement = document.createElement('canvas') as HTMLCanvasElement
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D  
    canvas.width = cfg.width
    canvas.height = cfg.height

    Object.entries(cfg.table).forEach(async ([unicode, char]) => {
        const x = Math.floor((parseInt(unicode) * cfg.font.width) % cfg.width)
        const y = Math.floor((parseInt(unicode) * cfg.font.width) / cfg.width)  * cfg.font.width
        const put = await canvasFromFont(char as string, cfg.font)
        ctx.drawImage(put, x, y)
    });

    return canvas
}
