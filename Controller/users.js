
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        req.login(registerUser, (err) => {
            if (err) {
                next(err);
            } else {
                req.flash("success", "Welcome to Wonderlust!!");
                res.redirect("/listings");
            }
        })
        // console.log(registerUser);
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};
module.exports.renderSignupForm=async (req,res)=>{
    res.render("user/signup.ejs");
};
module.exports.login=async(req,res)=>{
        req.flash("success","Welcome back to Wonderlust!");
        let redirect= res.locals.redirectUrl || "/listings";
        res.redirect(redirect);
    };
module.exports.renderLoginForm=async(req,res)=>{
    res.render("user/login.ejs");
};
module.exports.logout=async(req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "you are logged  out!");
        res.redirect("/listings");
    });
};