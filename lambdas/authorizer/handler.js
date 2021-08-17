const jwt = require('jsonwebtoken');

module.exports.generico = (event, context, callback) => {
  
  const tokenID = (event.headers && (event.headers['X-Amz-Security-Token'] || event.headers['x-amz-security-token'])) || event.authorizationToken;

  if (!tokenID) {
    console.log('No existe authorizator en el header.');
    return callback(generatePolicy(null, 'Deny', event.methodArn), null);
  }

  jwt.verify(tokenID, process.env.SEED_TOKEN, (error, decoded) => {

    if (error) {
      console.log(error.message);
      return callback(generatePolicy(tokenID, 'Deny', event.methodArn), null);
    }

    return callback(null, generatePolicy(decoded, 'Allow', event.methodArn));

  });

};

const generatePolicy = (principalId, effect, resource) => {

  const authResponse = {};
  authResponse.principalId = principalId;

  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;

}