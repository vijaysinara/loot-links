const { isAuthed } = require("../../lib/auth");

module.exports = async (req, res) => {
  res.json({ loggedIn: isAuthed(req) });
};
