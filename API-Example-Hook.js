function (user, context, callback) {
  var token = jwt.sign({
    aud: '[AUTH_ID]',
    iss: '[AUTH_DOMAIN]'
  }, '[AUTH_SECRET]');
  var user = {
    email: user.email,
    picture: user.picture,
  };
  var options = {
    method: 'POST',
    url: '[API_ENDPOINT]',
    body: JSON.stringify(user),
    headers: {
      'authorization': 'Bearer ' + token
    }
  };
  function cb(error, response, body) {
    if (error || response.statusCode !== 200){
      callback(error);
    } else {
      // success
      callback(null, user, context);
    }
  }
  request(options, cb);
}
