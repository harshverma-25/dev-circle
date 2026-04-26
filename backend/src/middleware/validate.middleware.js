import { validationResult } from "express-validator";

/**
 * Reads the express-validator result and short-circuits with 422
 * if any field failed validation. Pass this as middleware after
 * your validation rules array.
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg
      }))
    });
  }

  next();
};
