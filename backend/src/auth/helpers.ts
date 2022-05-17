import { Organisation, User } from "../../../common-types/src";

export interface CoopManagerUser {
    id: string;
    email_verified: boolean
    displayName: string;
    given_name: string;
    name: string;
    family_name: string;
    iss: number;
    aud: number;
    sub: number;
    iat: number;
    exp: number;
    accessToken: string;
    refreshToken: string;
    coopManager: User | null;
    organisations: Organisation[];
    selectedOrganisation: Organisation;
}

export function formatUser(user: any): CoopManagerUser {
  return {
    id: user.id,
    email_verified: user._json.email_verified,
    displayName: user.displayName,
    given_name: user._json.given_name,
    name: user._json.name,
    family_name: user._json.family_name,
    iss: user._json.iss,
    aud: user._json.aud,
    sub: user._json.sub,
    iat: user._json.iat,
    exp: user._json.exp,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
    coopManager: user.coopManager,
    organisations: user.organisations,
    selectedOrganisation: user.selectedOrganisation
  }
}

// @ts-ignore
export function ensureAuthenticated(req, res, next) {
    // console.log(req);
    if (!req.isAuthenticated()) {
        console.info("Unauthenticated request:", req.originalUrl);
        console.info("Redirecting to /login to authenticate");
        req.session.originalUrl = req.originalUrl;
        res.redirect('/login');
    } else {
        return next();
    }
}
