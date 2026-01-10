import {FileDownloader} from '../../domain/ports/FileDownloader.js';

export class BrowserFileDownloader implements FileDownloader {
    download(filename: string, content: string, mimeType: string): void {
        const blob = new Blob([content], {type: mimeType});
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    }
}
