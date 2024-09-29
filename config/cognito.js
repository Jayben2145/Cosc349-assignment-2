const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-1', // e.g. us-east-1
});

module.exports = cognito;
