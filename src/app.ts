document.addEventListener('DOMContentLoaded', () => {
    const fileInput: HTMLInputElement = document.querySelector('#input-rom') as HTMLInputElement;
  
    fileInput.addEventListener('change', function () {
      const filelist: FileList = fileInput.files as FileList;
      const reader: FileReader = new FileReader();
      const selectedFile: File | null = filelist[0];
  
      if (selectedFile) {
        reader.onload = function (event: ProgressEvent<FileReader>) {
          const fileContent: string | ArrayBuffer | undefined | null = event.target?.result;
          
          if (typeof fileContent === 'string') {
            const base64Content: string = btoa(fileContent);
            const fileContentDiv: HTMLElement | null = document.getElementById('output-debug');
            
            if (fileContentDiv) {
              fileContentDiv.innerHTML = base64Content;
            }
          }
        };
  
        reader.readAsBinaryString(selectedFile);
      }
    });
});
