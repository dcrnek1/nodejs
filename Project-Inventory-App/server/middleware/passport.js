const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const db = require("../db/db");

passport.use(new GoogleStrategy({
    clientID: process.env['GOOGLE_CLIENT_ID'],
    clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
    callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
    scope: [ 'profile', 'email' ],
    state: false
  },
  async function verify(accessToken, refreshToken, profile, cb) {
    try {
    const email = profile.emails[0].value;
    const googleId = profile.id;

    // 1. Check if user exists
    let { rows } = await db('SELECT * FROM users WHERE google_id = $1', [googleId]);
    let user = rows[0];

    // 2. If not, create them
    if (!user) {
      const newUser = await db(
        'INSERT INTO users (google_id, email, display_name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING *',
        [googleId, email, profile.displayName, profile.photos[0]?.value]
      );
      user = newUser.rows[0];
    }

    // Pass the actual DB user object to the next step
    return cb(null, user);
  } catch (err) {
    return cb(err);
  }
  }
));

module.exports = passport;