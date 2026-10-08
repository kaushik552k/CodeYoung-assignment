import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("[ErrorHandler]", err);

  if (res.headersSent) return;

  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";

  res.status(500).json({
    error: message,
    code: "INTERNAL_ERROR",
  });
}
