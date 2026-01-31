/*
export const logger = (
    req: { params: any; method: any; url: any; query: any; body: any; },
    res: any,
    next: () => void
) => {
    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■")
    console.log(`${req.method} ${req.url}`);
    console.log("Query:", req.query);
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
    next();
};
*/

import { Request, Response, NextFunction } from "express";

export const logger = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
    console.log(`${req.method} ${req.url}`);
    console.log("Query:", req.query);
    console.log("Params:", req.params);
    console.log("Body:", req.body);
    console.log("■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■");
    next();
};
