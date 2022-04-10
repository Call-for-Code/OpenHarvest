import { IDaaSOIDCStrategy as OpenIDConnectStrategy } from "passport-ci-oidc";
import { getCoopManager } from "./../services/coopManager.service";
import { getOrganisations } from "./../services/organisation.service";

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
            const doc = await getCoopManager(id);
            if (doc) {
                profile.isOnboarded = true;
                profile.coopManager = doc.toObject();
                profile.organisations = await getOrganisations(doc.coopOrganisations);
                profile.selectedOrganisation = profile.organisations[0];
            }
            else {
                profile.isOnboarded = false;
                profile.coopManager = null;
            }
            console.log(profile);
            done(null, profile);
        });
    }
)