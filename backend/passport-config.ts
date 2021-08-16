const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

function initialize(passport, getUserByUsername) {
  const authenticateUser = async (username, password, done) => {
    const user = await getUserByUsername(username);
    if (user == null) {
      return done(null, false, {
        message: `No user with username '${username}`,
      });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));

  //serialise and deserialise allow for storage of tokens locally
  passport.serializeUser(function (user, done) {
    //   console.log(`SerializeUser ${user.username}`);
    done(null, user.username);
  });

  passport.deserializeUser(async function (username, done) {
    //  console.log(`deserializedUser ${username}`);

    const user = await getUserByUsername(username);

    done(null, user);
  });
}

module.exports = initialize;
