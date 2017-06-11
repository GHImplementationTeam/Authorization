function (user, context, cb) {
  // get your slack's hook url from: https://slack.com/services/10525858050
  var SLACK_HOOK = configuration.slackURL;

  var slack = require('slack-notify')(SLACK_HOOK);
  var message = user.user_metadata.first_name + ' ' + user.user_metadata.last_name + ' <' + user.email + '> created an account';
  var channel = configuration.slackChannel;

  slack.success({
    text: message,
    channel: channel
  });
  cb();
};
