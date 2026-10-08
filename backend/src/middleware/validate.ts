import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

/**
 * Middleware factory that validates req.query or req.body against a Zod schema.
 * On failure, returns 400 with structured field errors.
 */
export function validate<T>(
  schema: ZodSchema<T>,
  source: "body" | "query" = "body"
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(
      source === "body" ? req.body : req.query
    );

    if (!result.success) {
      const errors = (result.error as ZodError).errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      res.status(400).json({
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: errors,
      });
      return;
    }

    // Attach parsed & coerced data back to request
    if (source === "body") {
      req.body = result.data;
    } else {
      (req as any).validatedQuery = result.data;
    }

    next();
  };
}
