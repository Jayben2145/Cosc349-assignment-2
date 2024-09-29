const AWS = require('aws-sdk');

const cognito = new AWS.CognitoIdentityServiceProvider({
  region: 'your-region', // e.g. us-east-1
});

module.exports = cognito;
