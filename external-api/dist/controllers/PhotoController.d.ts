import { Request, Response } from "express";
export default class PhotoController {
    static getById(req: Request, res: Response): Promise<void>;
    static filter(req: Request, res: Response): Promise<void>;
}
