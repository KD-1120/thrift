const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'thrift',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dc) {
  return executeMutation(createUserRef(dc));
};

const listTailorProfilesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTailorProfiles');
}
listTailorProfilesRef.operationName = 'ListTailorProfiles';
exports.listTailorProfilesRef = listTailorProfilesRef;

exports.listTailorProfiles = function listTailorProfiles(dc) {
  return executeQuery(listTailorProfilesRef(dc));
};

const updatePortfolioItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePortfolioItem', inputVars);
}
updatePortfolioItemRef.operationName = 'UpdatePortfolioItem';
exports.updatePortfolioItemRef = updatePortfolioItemRef;

exports.updatePortfolioItem = function updatePortfolioItem(dcOrVars, vars) {
  return executeMutation(updatePortfolioItemRef(dcOrVars, vars));
};

const getUserReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserReviews', inputVars);
}
getUserReviewsRef.operationName = 'GetUserReviews';
exports.getUserReviewsRef = getUserReviewsRef;

exports.getUserReviews = function getUserReviews(dcOrVars, vars) {
  return executeQuery(getUserReviewsRef(dcOrVars, vars));
};
