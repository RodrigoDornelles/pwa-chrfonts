export function readFile(file: File): Promise<string> {
    const reader: FileReader = new FileReader()

    return new Promise<string>((resolve, reject) => {
        reader.onload = function (event: ProgressEvent<FileReader>) {
            const fileContent: string | ArrayBuffer | undefined | null = event.target?.result

            if (typeof fileContent === 'string') {
                resolve(fileContent)
            } else {
                reject(new Error('Failed to read file content.'))
            }
        }

        reader.onerror = function () {
            reject(new Error('Failed to read the file.'))
        }

        reader.readAsBinaryString(file)
    })
}
