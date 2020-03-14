import 'dotenv/config';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

function getKey(header, cb) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    cb(null, signingKey);
  });
}

const options = {
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
};

const validateUser = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  const token = req.headers.authorization.split(' ');

  return new Promise((resolve, reject) => {
    jwt.verify(token[1], getKey, options, (err, decoded) => {
      if (err) {
        reject(err);
        return res.sendStatus(401);
      }
      req.user = {
        email: decoded[`${process.env.AUTH0_AUDIENCE}/email`],
      };
      resolve(decoded[`${process.env.AUTH0_AUDIENCE}/email`]);
      next();
    });
  });

};

export default validateUser;
