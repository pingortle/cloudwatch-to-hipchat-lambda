const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const HipChatNotifierMaker = require('hipchat-notifier');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));
const messageTemplateSource = fs.readFileSync(path.join(__dirname, 'message.html.handlebars'), 'utf8');
const messageTemplate = Handlebars.compile(messageTemplateSource);
const notifier = HipChatNotifierMaker.make(config['room_id'], config['auth_token'], 'AWS CloudWatch');

exports.handler = function (event, context) {
  var jsonMessage = event.Records[0].Sns.Message;
  console.log(jsonMessage);

  var alarm = JSON.parse(jsonMessage);

  var alarmState = alarm.NewStateValue === 'ALARM' ? 'failure' : 'success';

  var message = messageTemplate(alarm);

  notifier[alarmState](message, function (error, response, body) {
    var requestState = error ? 'fail' : 'succeed';
    context[requestState](body);
  });
};
