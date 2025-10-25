import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {

  const authHeader = req.headers.authorization;


  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Logga in för att komma åt denna resurs.' });
  }


  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, JWT_SECRET); 

    req.user = decoded; 
    next(); 
  } catch (ex) {
   
    res.status(401).json({ message: 'Token ogiltig eller utgången.' });
  }
};

export default authMiddleware;