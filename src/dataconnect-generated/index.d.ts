import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateUserData {
  user_insert: User_Key;
}

export interface GetUserReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    reviewText: string;
    reviewDate: TimestampString;
  } & Review_Key)[];
}

export interface GetUserReviewsVariables {
  userId: UUIDString;
}

export interface ListTailorProfilesData {
  tailorProfiles: ({
    id: UUIDString;
    specialty: string;
    averageRating: number;
  } & TailorProfile_Key)[];
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface PortfolioItem_Key {
  id: UUIDString;
  __typename?: 'PortfolioItem_Key';
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Style_Key {
  id: UUIDString;
  __typename?: 'Style_Key';
}

export interface TailorProfile_Key {
  id: UUIDString;
  __typename?: 'TailorProfile_Key';
}

export interface UpdatePortfolioItemData {
  portfolioItem_update?: PortfolioItem_Key | null;
}

export interface UpdatePortfolioItemVariables {
  id: UUIDString;
  description?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface ListTailorProfilesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTailorProfilesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListTailorProfilesData, undefined>;
  operationName: string;
}
export const listTailorProfilesRef: ListTailorProfilesRef;

export function listTailorProfiles(): QueryPromise<ListTailorProfilesData, undefined>;
export function listTailorProfiles(dc: DataConnect): QueryPromise<ListTailorProfilesData, undefined>;

interface UpdatePortfolioItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePortfolioItemVariables): MutationRef<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePortfolioItemVariables): MutationRef<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;
  operationName: string;
}
export const updatePortfolioItemRef: UpdatePortfolioItemRef;

export function updatePortfolioItem(vars: UpdatePortfolioItemVariables): MutationPromise<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;
export function updatePortfolioItem(dc: DataConnect, vars: UpdatePortfolioItemVariables): MutationPromise<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;

interface GetUserReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserReviewsVariables): QueryRef<GetUserReviewsData, GetUserReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserReviewsVariables): QueryRef<GetUserReviewsData, GetUserReviewsVariables>;
  operationName: string;
}
export const getUserReviewsRef: GetUserReviewsRef;

export function getUserReviews(vars: GetUserReviewsVariables): QueryPromise<GetUserReviewsData, GetUserReviewsVariables>;
export function getUserReviews(dc: DataConnect, vars: GetUserReviewsVariables): QueryPromise<GetUserReviewsData, GetUserReviewsVariables>;

