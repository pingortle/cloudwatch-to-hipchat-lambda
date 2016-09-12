exports.elbAlarmMessageData = {
  'AlarmName': 'awselb-Unhealthy-Hosts',
  'AlarmDescription': 'Created from EC2 Console',
  'AWSAccountId': '293228007553',
  'NewStateValue': 'ALARM',
  'NewStateReason': 'Threshold Crossed: 1 datapoint (6.0) was greater than or equal to the threshold (1.0).',
  'StateChangeTime': '2016-09-10T03:25:51.212+0000',
  'Region': 'US West - Oregon',
  'OldStateValue': 'OK',
  'Trigger': {
    'MetricName': 'UnHealthyHostCount',
    'Namespace': 'AWS/ELB',
    'Statistic': 'SUM',
    'Unit': null,
    'Dimensions': [
      {
        'name': 'LoadBalancerName',
        'value': 'production'
      }
    ],
    'Period': 300,
    'EvaluationPeriods': 1,
    'ComparisonOperator': 'GreaterThanOrEqualToThreshold',
    'Threshold': 1
  }
};

exports.elbOkMessageData = {
  'AlarmName': 'awselb-Unhealthy-Hosts',
  'AlarmDescription': 'Created from EC2 Console',
  'AWSAccountId': '293228007553',
  'NewStateValue': 'OK',
  'NewStateReason': 'Threshold Crossed: 1 datapoint (6.0) was greater than or equal to the threshold (1.0).',
  'StateChangeTime': '2016-09-10T03:25:51.212+0000',
  'Region': 'US West - Oregon',
  'OldStateValue': 'ALARM',
  'Trigger': {
    'MetricName': 'UnHealthyHostCount',
    'Namespace': 'AWS/ELB',
    'Statistic': 'SUM',
    'Unit': null,
    'Dimensions': [
      {
        'name': 'LoadBalancerName',
        'value': 'production'
      }
    ],
    'Period': 300,
    'EvaluationPeriods': 1,
    'ComparisonOperator': 'GreaterThanOrEqualToThreshold',
    'Threshold': 1
  }
};

exports.snsElbAlarmEvent = generateSnsElbEvent(exports.elbAlarmMessageData);
exports.snsElbOkEvent = generateSnsElbEvent(exports.elbOkMessageData);

function generateSnsElbEvent(messageData) {
  return {
    'Records': [
      {
        'EventVersion': '1.0',
        'EventSubscriptionArn': 'arn:aws:sns:EXAMPLE',
        'EventSource': 'aws:sns',
        'Sns': {
          'SignatureVersion': '1',
          'Timestamp': '1970-01-01T00:00:00.000Z',
          'Signature': 'EXAMPLE',
          'SigningCertUrl': 'EXAMPLE',
          'MessageId': '95df01b4-ee98-5cb9-9903-4c221d41eb5e',
          'Message': JSON.stringify(messageData),
          'MessageAttributes': {
            'Test': {
              'Type': 'String',
              'Value': 'TestString'
            },
            'TestBinary': {
              'Type': 'Binary',
              'Value': 'TestBinary'
            }
          },
          'Type': 'Notification',
          'UnsubscribeUrl': 'EXAMPLE',
          'TopicArn': 'arn:aws:sns:EXAMPLE',
          'Subject': 'TestInvoke'
        }
      }
    ]
  };
}
