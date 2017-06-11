// This script will be executed when a user is deleted. 

function remove (id, callback) {
  console.log("remove");
  // this example uses the "pg" library
  // more info here: https://github.com/brianc/node-postgres
  var conString = "postgres://"+configuration.dbUsername+":"+configuration.dbPassword+"@"+configuration.dbHost+"/"+configuration.dbDatabase;

  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    client.query('DELETE FROM '+configuration.dbSchema+'.'+configuration.dbTable+' WHERE id = $1', [id], function (err) {
      // NOTE: always call `done()` here to close
      // the connection to the database
      done();

      if (err) {
        return callback(err);
      }

      callback(null);
    });
  });

}
