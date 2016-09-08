const fs = require('fs');
const path = require('path');
const HipChatNotifierMaker = require('hipchat-notifier');

var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

exports.handler = function (event, context) {
  console.log(config);
  var jsonMessage = event.Records[0].Sns.Message;
  console.log(jsonMessage);
  var alarm = JSON.parse(jsonMessage);

  notifier = HipChatNotifierMaker.make(config['room_id'], config['auth_token'], 'AWS CloudWatch');

  var alarmState = alarm.NewStateValue === 'ALARM' ? 'failure' : 'success';

  var message = `<p><strong>${alarm.AlarmName}: ${alarm.NewStateValue}</strong></p><p>${alarm.NewStateReason}</p>`
  notifier[alarmState](message, function (error, response, body) {
    var requestState = error ? 'fail' : 'succeed';
    context[requestState](body);
  });
};
