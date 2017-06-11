// This script will be executed each time a user attempts to login.
// parameters: email and password, are used to validate the authenticity of the user. 

function login(email, password, callback) {
  console.log("login");
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  var conString = "postgres://"+configuration.dbUsername+":"+configuration.dbPassword+"@"+configuration.dbHost+"/"+configuration.dbDatabase;
  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    var query = 'SELECT id, email, password ' +
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
        return callback(new WrongUsernameOrPasswordError(email));
      }

      var user = result.rows[0];
      var query = 'SELECT id, organization, disabled ' +
        'FROM organization_information.employee WHERE "user" = $1';
      client.query(query, [user.id], function (err, result2) {
        done();
        if (err) {
          console.log('error executing query', err);
          return callback(err);
        }
        if (result2.rows.length === 0) {
          return callback(new Error(email));
        }
        var employee = result2.rows[0];
        if (employee.disabled) {
          return callback(new Error("Account Disabled"));
        }
        console.log(employee.disabled);
        user.org = employee.organization;
      });

      bcrypt.compare(password, user.password, function (err, isValid) {
        if (err) {
          callback(err);
        } else if (!isValid) {
          callback(new WrongUsernameOrPasswordError(email));
        } else {
          callback(null, {
            id: user.id,
            email: user.email,
            uid: user.id,
            org: user.org
          });
        }
      });
    });
  });
}
