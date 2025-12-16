// middleware/sanitize.js
import xss from 'xss';

// Sanitize all string inputs in req.body and req.query
export function sanitizeInput(req, res, next) {
  const strictPaths = new Set([
    'school.name',
    'school.address',
    'admin.first_name',
    'admin.last_name'
  ]);

  let rejected = null;

  const sanitizeDeepInPlace = (value, path = '') => {
    if (rejected) return value;

    if (typeof value === 'string') {
      const trimmed = value.trim();
      const cleaned = xss(trimmed);
      if (strictPaths.has(path) && cleaned !== trimmed) {
        rejected = { path };
        return value;
      }
      return cleaned;
    }

    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        value[i] = sanitizeDeepInPlace(value[i], `${path}[${i}]`);
      }
      return value;
    }

    if (value && typeof value === 'object') {
      for (const k of Object.keys(value)) {
        const nextPath = path ? `${path}.${k}` : k;
        value[k] = sanitizeDeepInPlace(value[k], nextPath);
      }
      return value;
    }

    return value;
  };

  if (req.body) sanitizeDeepInPlace(req.body);
  if (req.query) sanitizeDeepInPlace(req.query);
  if (req.params) sanitizeDeepInPlace(req.params);

  if (rejected) {
    return res.status(400).json({
      error: 'Validation failed',
      details: [{ msg: 'HTML is not allowed', path: rejected.path, location: 'body' }]
    });
  }

  next();
}
