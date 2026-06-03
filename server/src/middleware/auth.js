import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET || 'development-only-secret';

export function signToken(user) {
  return jwt.sign(
    { id: user.id, role: user.role, universityId: user.universityId },
    jwtSecret,
    { expiresIn: '8h' }
  );
}

export function requireAuth(role) {
  return (req, res, next) => {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    try {
      const user = jwt.verify(token, jwtSecret);
      if (role && user.role !== role) {
        return res.status(403).json({ message: 'You do not have access to this resource.' });
      }
      req.user = user;
      next();
    } catch {
      res.status(401).json({ message: 'Invalid or expired session.' });
    }
  };
}
