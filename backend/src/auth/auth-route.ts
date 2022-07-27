import { Router } from "express";
import passport from "passport";
import { formatUser, ensureAuthenticated } from "./helpers";
import { IBMidStrategy } from "./IBMiDStrategy";
import { JWTOpenHarvestStrategy, opts } from "./jwtStrategy";
import jwt from 'jsonwebtoken';

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

const redirect_url = process.env.NODE_ENV == "production" ? "https://openharvest.net/" : "http://localhost:3001/";

passport.use(IBMidStrategy);
passport.use(JWTOpenHarvestStrategy);

const router = Router();

router.get('/login', passport.authenticate('openidconnect', { state: Math.random().toString(36).substr(2, 10) }));

router.get('/logout', (req, res) => {
    if (req.user) {
        if (req.user.logout) {
            req.user.logout();
        }
        req.session.destroy(() => {
            res.redirect(redirect_url);
        });
    }
    else {
        res.redirect(redirect_url);
    }
});

/**
 * This handles the callback from IBMid
 * Complete url: '/auth/sso/callback'
 */
router.get(
    '/sso/callback',
    passport.authenticate('openidconnect', {failureRedirect: '/failure'}),
    function (req, res) {
        // Encode a new JWT token and pass it to the web app via a http param
        const formattedUser = formatUser(req.user);
        const token = jwt.sign(formattedUser!!, opts.secretOrKey!!);
        return res.redirect(redirect_url + "?token=" + token);
    }
);

// failure page
router.get('/failure', function(req, res) {
    res.send('login failed'); 
});


router.get('/my_details_openid', ensureAuthenticated, function (req, res) {
   var claims = req.user['_json'];
   var html ="<p>Hello " + claims.given_name + " " + claims.family_name + ": </p>";

   html += "User details (ID token in _json object): </p>";

   html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";

   html += "<br /><a href=\"/logout\">logout</a>";

   html += "<hr> <a href=\"/\">home</a>";

   //res.send('Hello '+ claims.given_name + ' ' + claims.family_name + ', your email is ' + claims.email + '<br /> <a href=\'/\'>home</a>');

   res.send(html);
});



router.get('/me', ensureAuthenticated, (req, res) => {
    return res.json(formatUser(req.user));
});

export const AuthRoutes = router;