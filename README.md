# AWS Lambda Function: CloudWatch to HipChat
## Get Started
- Clone repo
- Run `npm install`

## Deploy
- Set up `config.json`
  - Set `room_id` to the id of your hipchat room
  - Set `auth_token` to your hipchat api token
- Set up `deploy-config.json` (see deploy config docs [here](https://github.com/colinmathews/deploy-lambda#api))
  - Make sure you add this line to include your hipchat config in the deployment: `"extraPathsToInclude": ["config.json"]`
  - Note: you will need to set up an S3 bucket for storing your deployed code archives
- Run `npm run deploy`

## Configure CloudWatch
- In the AWS console, configure your desired notifications for an SNS topic
- In the SNS control panel, subscribe your newly deployed lambda function to the SNS topic you just configured
- Sit back and watch your cloudwatch notifications roll in 😎
