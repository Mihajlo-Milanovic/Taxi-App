import {Request, Response, NextFunction} from "express";

export const errorHandler = (
    err: { status: any; message: any; },
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
};
