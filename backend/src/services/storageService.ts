import fs from 'fs';
import path from 'path';

export interface StorageService {
  saveFile(file: Express.Multer.File): Promise<string>;
  deleteFile(filePath: string): Promise<void>;
  getFileUrl(filePath: string): string;
}

export class LocalStorageService implements StorageService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = path.resolve(__dirname, '../../uploads');
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async saveFile(file: Express.Multer.File): Promise<string> {
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    const destinationPath = path.join(this.uploadDir, filename);
    await fs.promises.writeFile(destinationPath, file.buffer);
    return `/uploads/${filename}`;
  }

  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(__dirname, '../../', filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  }

  getFileUrl(filePath: string): string {
    return filePath;
  }
}

export const storageService: StorageService = new LocalStorageService();
