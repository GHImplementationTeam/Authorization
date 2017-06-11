// This script will be executed after a user that signed-up, and follows the "verification" link.
// parameter: email is used to verify an account. 

function verify (email, callback) {
  console.log("verify");
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  var conString = "postgres://"+configuration.dbUsername+":"+configuration.dbPassword+"@"+configuration.dbHost+"/"+configuration.dbDatabase;
  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    var query = 'UPDATE '+configuration.dbSchema+'.'+configuration.dbTable+' SET "emailVerified" = true ' +
      'WHERE "emailVerified" = false AND email = $1';

    client.query(query, [email], function (err, result) {
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

}
