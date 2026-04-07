const express = require("express");
const db = require("../db/db");
const router = express.Router();

// The "Trigger" route
// Accessible at: http://localhost:4000/api/auth/google
router.get("/userlist", async (req,res,next) => {
  try {
     const { rows } = await db(`select u.*, count(rt.*) as session_count, COALESCE(
        JSON_AGG(
            JSON_BUILD_OBJECT(
                'id', rt.id,
                'device_info', rt.device_info, 
                'expires_at', rt.expires_at, 
                'created_at', rt.created_at
            )
            ORDER BY rt.expires_at ASC
        ) FILTER (WHERE rt.id IS NOT NULL), 
        '[]'
        ) AS sessions from users u
    left join refresh_tokens rt on rt.user_id = u.id
    group by u.id`);

    res.send(rows)
  } catch (error) {
    console.error(error)
  }
});

module.exports = router;
