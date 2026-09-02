import fs from "fs";
import path from "path";
import multer from "multer";

class StorageService {
    constructor() {
        this.baseDir = path.join(process.cwd(), "storage");
        this.ensureBaseDir();
    }

    ensureBaseDir() {
        if (!fs.existsSync(this.baseDir)) {
            fs.mkdirSync(this.baseDir, { recursive: true });
        }
    }

    ensureDomainDir(domain) {
        const domainDir = path.join(this.baseDir, domain);
        if (!fs.existsSync(domainDir)) {
            fs.mkdirSync(domainDir, { recursive: true });
        }
        return domainDir;
    }

    getDiskStorage(domain, filenameResolver) {
        const domainDir = this.ensureDomainDir(domain);

        return multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, domainDir);
            },
            filename: (req, file, cb) => {
                if (filenameResolver) {
                    filenameResolver(req, file, cb);
                } else {
                    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                    cb(null, uniqueSuffix + path.extname(file.originalname));
                }
            },
        });
    }

    getFilePath(domain, filename) {
        return path.join(this.baseDir, domain, filename);
    }

    getDomainPath(domain) {
        return path.join(this.baseDir, domain);
    }
}

export const storageService = new StorageService();
