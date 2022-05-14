import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";

export const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.jwt_secret,
    issuer: 'http://openharvest.net',
    audience: 'http://openharvest.net'
}

export const JWTOpenHarvestStrategy = new JwtStrategy(opts, (jwt_payload, done) => {
    return jwt_payload;
});


