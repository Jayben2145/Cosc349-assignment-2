const AWS = require('aws-sdk');
const CognitoIdentityServiceProvider = AWS.CognitoIdentityServiceProvider;

const cognito = new CognitoIdentityServiceProvider({
  region: 'us-east-1', // e.g., 'us-west-2'
  accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

module.exports = cognito;
