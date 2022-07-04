import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

if (process.env.jwt_secret == undefined) {
    throw new Error("jwt_secret MUST be defined in the environment");
}

export const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwt_secret,
    issuer: 'http://openharvest.net',
    audience: 'http://openharvest.net'
}

export const JWTOpenHarvestStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
    return jwt_payload;
});


