import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'thrift',
  location: 'us-central1'
};

export const createUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser');
}
createUserRef.operationName = 'CreateUser';

export function createUser(dc) {
  return executeMutation(createUserRef(dc));
}

export const listTailorProfilesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListTailorProfiles');
}
listTailorProfilesRef.operationName = 'ListTailorProfiles';

export function listTailorProfiles(dc) {
  return executeQuery(listTailorProfilesRef(dc));
}

export const updatePortfolioItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePortfolioItem', inputVars);
}
updatePortfolioItemRef.operationName = 'UpdatePortfolioItem';

export function updatePortfolioItem(dcOrVars, vars) {
  return executeMutation(updatePortfolioItemRef(dcOrVars, vars));
}

export const getUserReviewsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserReviews', inputVars);
}
getUserReviewsRef.operationName = 'GetUserReviews';

export function getUserReviews(dcOrVars, vars) {
  return executeQuery(getUserReviewsRef(dcOrVars, vars));
}

