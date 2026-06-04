import { Request, Response } from "express";
import config from "../config.js";

export function resetFileServerHits(req: Request, res: Response) {
  config.api.fileserverHits = 0;
  res.set({
    "Content-Type": "text/html",
    charset: "utf-8",
  }).send(`<html>
            <body>
                <h1>Welcome, Chirpy Admin</h1>
                <p>File server hits counter reset to 0</p>
            </body>
            </html>`);
}
