export interface FileDownloader {
    download(filename: string, content: string, mimeType: string): void;
}
