import jwt, { JwtPayload } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { userEmail: string; userRole: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  // check if the token is valid
  return jwt.verify(token, secret) as JwtPayload;
};
