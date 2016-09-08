var HipChat = require('hipchat-message');

var hipchatAuthToken = 'aXWAcvmSmQjMDpEEFCGJKln3y2qX6UNkSARAXXPa';
var hipchatRoomId = '1311730';

exports.handler = function (event, context) {
  var jsonMessage = event.Records[0].Sns.Message;
  console.log(jsonMessage);
  var alarm = JSON.parse(jsonMessage);

  var hipchat = new HipChat({
      'auth_token': hipchatAuthToken,
      'room_id'   : hipchatRoomId,
      'from'      : 'AWS CloudWatch',
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
