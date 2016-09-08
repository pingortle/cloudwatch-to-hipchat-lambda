var fs = require('fs');
var HipChat = require('hipchat-message');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

exports.handler = function (event, context) {
  var jsonMessage = event.Records[0].Sns.Message;
  console.log(jsonMessage);
  var alarm = JSON.parse(jsonMessage);

  var hipchat = new HipChat({
      'auth_token': config['auth_token'],
      'room_id'   : config['room_id'],
      'from'      : config['from'] || 'AWS CloudWatch',
      title       : `<strong>${alarm.AlarmName}: ${alarm.NewStateValue}</strong>`,
      format      : 'html',
  }, function () {
      console.log('call completed');
  });

  var alarmState = alarm.NewStateValue === 'ALARM' ? 'error' : 'success';
  hipchat[alarmState](alarm.NewStateReason, true, function (error, responseCode, body) {
    var requestState = error ? 'fail' : 'succeed';
    context[requestState](body);
  });
};
