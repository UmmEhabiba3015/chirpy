import { NextFunction, Request, Response } from 'express';
import config from "../config.js";

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction) {
    // Increment the file server hits counter in the config
    config.api.fileserverHits += 1;
    next();
}
