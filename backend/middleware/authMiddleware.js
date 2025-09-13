import jwt from 'jsonwebtoken';

//check if the token is valid
export const verifyToken = (req, response, next) => {
  const auth = req.headers['authorization'];
  if (!auth) return response.status(401).json({ error: 'No token provided' });

  const token = auth.split(' ')[1];
  if (!token) return response.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    response.status(403).json({ error: 'Invalid token' });
  }
};

//check if user has required role
export const verifyRoles = (roles) => (req, response, next) => {
  if (!roles.includes(req.user.role)) return response.status(403).json({ error: 'Access denied' });
  next();
};
