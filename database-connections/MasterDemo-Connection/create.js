// This script will be executed when the user signs up.
// parameters: user.email and user.password, are used to create a record in the user store. 

function create(user, callback) {
  console.log("create");
  //console.log(user);
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  var conString = "postgres://"+configuration.dbUsername+":"+configuration.dbPassword+"@"+configuration.dbHost+"/"+configuration.dbDatabase;
  console.log(conString);
  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }
    bcrypt.hash(user.password, 10, function (err, hashedPassword) {
      var query = 'INSERT INTO '+configuration.dbSchema+'.'+configuration.dbTable+'(email, password, "firstName", "lastName", "emailVerified") VALUES ($1, $2, $3, $4, $5)';
      console.log(query);
      client.query(query, [user.email, hashedPassword, user.user_metadata.first_name, user.user_metadata.last_name, false], function (err, result) {
        // NOTE: always call `done()` here to close
        // the connection to the database
        done();
        if (err) {
          console.log('error executing query', err);
          return callback(err);
        }
        if (result.rows.length === 0) {
          return callback(new Error("Failed"));
        }

        var user = result.rows[0];
        console.log(user);
        return callback(null);
      });
    });
  });
}
