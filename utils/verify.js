const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./database/database.db");

module.exports.verify = (cookie, callback) => {
  if (!cookie) {
    callback([false]);
    return;
  }

  if (cookie.toLowerCase() == "failed") {
    callback([false]);
    return;
  }

  //final check to make sure the account exists
  let userAccount = null;
  db.each("SELECT * FROM users WHERE password=? LIMIT 1", [cookie], (error, account) => {
    if (error) throw error;

    userAccount = account;

  }, () => {
    if (!userAccount) {
      callback([false]);
      return
    }
    callback([true, userAccount])
  })

}
