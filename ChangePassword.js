// This script will be executed when the user wishes to change his password, the reset email was sent and the user follows the "change password" link.
// parameters: email and newPassword are used to confirm the new password.

function changePassword (email, newPassword, callback) {
  console.log("changePassword");
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  var conString = "postgres://"+configuration.dbUsername+":"+configuration.dbPassword+"@"+configuration.dbHost+"/"+configuration.dbDatabase;
  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    bcrypt.hash(newPassword, 10, function (err, hash) {
      if (err) return callback(err);
      client.query('UPDATE '+configuration.dbSchema+'.'+configuration.dbTable+' SET password = $1 WHERE email = $2', [hash, email], function (err, result) {
        // NOTE: always call `done()` here to close
        // the connection to the database
        done();

        if (err) {
          return callback(err);
        }

        if (result.rowCount === 0) {
          return callback();
        }

        callback(null, result.rowCount > 0);
      });
    });
  });
}
