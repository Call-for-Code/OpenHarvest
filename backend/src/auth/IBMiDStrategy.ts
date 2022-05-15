import { IDaaSOIDCStrategy as OpenIDConnectStrategy } from "passport-ci-oidc";
import { userService } from "../services/UserService";

export const IBMidStrategy = new OpenIDConnectStrategy({
    discoveryURL: process.env.AUTH_discovery_url,
    clientID: process.env.AUTH_client_id,
    scope: 'email',
    response_type: 'code',
    clientSecret: process.env.AUTH_client_secret,
    callbackURL: process.env.AUTH_callback_url,
    skipUserProfile: true},
    // Add your own data here.
    function (iss, sub, profile, accessToken, refreshToken, params, done) {
        process.nextTick(async function () {
            profile.accessToken = accessToken;
            profile.refreshToken = refreshToken;
            // Get the farmer coop details
            const id = "IBMid:" + profile.id;
            const doc = await userService.getUser(id);
            if (doc) {
                profile.isOnboarded = true;
                profile.user = doc;
            }
            else {
                profile.isOnboarded = false;
                profile.user = null;
            }
            console.log(profile);
            done(null, profile);
        });
    }
)
