const express = require("express");
const passport = require("../middleware/passport");
const router = express.Router();
const db = require("../db/db");
const jwt = require("jsonwebtoken");
const useragent = require('useragent');

// The "Trigger" route
// Accessible at: http://localhost:4000/api/auth/google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    prompt: "select_account",
  }),
);

// The "Callback" route
// Accessible at: http://localhost:4000/api/auth/oauth2/redirect/google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/`,
    session: false,
  }),
  async (req, res) => {
    try {
      const user = req.user;

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.display_name,
          avatar_url: user.avatar_url,
          created_at: user.created_at,
        },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: "15m" },
      );

      const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" },
      );
      const expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const existingToken = req.cookies.refreshToken;
      let updateResult = { result: { rowCount: 0 }};
      const agent = useragent.parse(req.headers['user-agent']);
      const deviceInfo = `${agent.family} on ${agent.os.family}`;

      if (existingToken) {
        updateResponse = await db(
          'UPDATE refresh_tokens SET token = $1, expires_at = $2, device_info = $3 WHERE token = $4',
          [refreshToken, expiryDate, deviceInfo, existingToken]
        );
      }

      if (!existingToken || updateResponse.result.rowCount === 0) {
        await db(
          'INSERT INTO refresh_tokens (user_id, token, expires_at, device_info) VALUES ($1, $2, $3, $4)',
          [user.id, refreshToken, expiryDate, deviceInfo]
        );
      }

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.redirect(
        `${process.env.FRONTEND_URL}/signinsuccess?token=${accessToken}`,
      );
    } catch (error) {
      console.error(error);
      res.redirect(
        `${process.env.FRONTEND_URL}/signin?error=token_generation_failed`,
      );
    }
  },
);

module.exports = router;
