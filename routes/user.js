const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../Models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../Controller/users.js");

router
    .route("/signup")
    .get(wrapAsync(userController.renderSignupForm))
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(wrapAsync(userController.renderLoginForm))
    .post(saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        wrapAsync(userController.login));

// router.get("/login", wrapAsync(userController.renderLoginForm));

// router.post("/login", saveRedirectUrl,
//     passport.authenticate("local", {
//         failureRedirect: "/login",
//         failureFlash: true,
//     }),
//     wrapAsync(userController.login));
//logout 
router.get("/logout", wrapAsync(userController.logout));

module.exports = router;