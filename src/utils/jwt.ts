import jwt, { type SignOptions } from "jsonwebtoken";

const createAccessToken = (
  payload: object,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(payload, secret, {
    expiresIn} as SignOptions,
  );
};

const createRefreshToken = (
  payload: object,
  secret: string,
  expiresIn: SignOptions["expiresIn"]
) => {
  return jwt.sign(
    payload,
    secret,
    {
      expiresIn,
    } as SignOptions
  );
};

export const jwtUtils = {
  createAccessToken,
  createRefreshToken,
};

