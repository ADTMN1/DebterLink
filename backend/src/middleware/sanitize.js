// middleware/sanitize.js
import xss from 'xss';

// Sanitize all string inputs in req.body and req.query
export function sanitizeInput(req, res, next) {
  for (const key in req.body) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = xss(req.body[key].trim());
    }
  }

  for (const key in req.query) {
    if (typeof req.query[key] === 'string') {
      req.query[key] = xss(req.query[key].trim());
    }
  }

  next();
}
