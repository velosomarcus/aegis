"use strict";
console.log(process.cwd())

const jwt = require("express-jwt");
const jwks = require("jwks-rsa");

//TODO: This needs to be dynamic
const keySet = require(process.cwd() + "/auth/key-set.json");

const authEnabled = /true/i.test(process.env.AUTH_ENABLED);

module.exports = function (app, path) {
  if (!authEnabled) return app;

  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: keySet.cache,
      rateLimit: keySet.rateLimit,
      jwksRequestsPerMinute: keySet.jwksRequestsPerMinute,
      jwksUri: keySet.jwksUri,
    }),
    audience: keySet.audience,
    issuer: keySet.issuer,
    algorithms: keySet.algorithms,
  });

  app.use(path, jwtCheck);

  return app;
};
