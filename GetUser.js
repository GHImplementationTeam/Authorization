// This script will be executed when the user wishes to change his password to test if the user exists. 

function getByEmail (email, callback) {
  console.log("getByEmail");
  //console.log(email);
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  var conString = "postgres://"+configuration.dbUsername+":"+configuration.dbPassword+"@"+configuration.dbHost+"/"+configuration.dbDatabase;
  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    var query = 'SELECT nickname, email ' +
      'FROM '+configuration.dbSchema+'.'+configuration.dbTable+' WHERE email = $1';

    client.query(query, [email], function (err, result) {
      // NOTE: always call `done()` here to close
      // the connection to the database
      done();

      if (err) {
        console.log('error executing query', err);
        return callback(err);
      }

      if (result.rows.length === 0) {
        return callback(null);
      }

      var user = result.rows[0];
      //console.log(user);

      callback(null, user);
    });
  });
}
