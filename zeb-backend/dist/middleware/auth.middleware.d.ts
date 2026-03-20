import type { Request, Response, NextFunction } from "express";
declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export default auth;
//# sourceMappingURL=auth.middleware.d.ts.map