import { CreateUserData, ListTailorProfilesData, UpdatePortfolioItemData, UpdatePortfolioItemVariables, GetUserReviewsData, GetUserReviewsVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateUser(options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;
export function useCreateUser(dc: DataConnect, options?: useDataConnectMutationOptions<CreateUserData, FirebaseError, void>): UseDataConnectMutationResult<CreateUserData, undefined>;

export function useListTailorProfiles(options?: useDataConnectQueryOptions<ListTailorProfilesData>): UseDataConnectQueryResult<ListTailorProfilesData, undefined>;
export function useListTailorProfiles(dc: DataConnect, options?: useDataConnectQueryOptions<ListTailorProfilesData>): UseDataConnectQueryResult<ListTailorProfilesData, undefined>;

export function useUpdatePortfolioItem(options?: useDataConnectMutationOptions<UpdatePortfolioItemData, FirebaseError, UpdatePortfolioItemVariables>): UseDataConnectMutationResult<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;
export function useUpdatePortfolioItem(dc: DataConnect, options?: useDataConnectMutationOptions<UpdatePortfolioItemData, FirebaseError, UpdatePortfolioItemVariables>): UseDataConnectMutationResult<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;

export function useGetUserReviews(vars: GetUserReviewsVariables, options?: useDataConnectQueryOptions<GetUserReviewsData>): UseDataConnectQueryResult<GetUserReviewsData, GetUserReviewsVariables>;
export function useGetUserReviews(dc: DataConnect, vars: GetUserReviewsVariables, options?: useDataConnectQueryOptions<GetUserReviewsData>): UseDataConnectQueryResult<GetUserReviewsData, GetUserReviewsVariables>;
