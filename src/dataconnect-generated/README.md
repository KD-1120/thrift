# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListTailorProfiles*](#listtailorprofiles)
  - [*GetUserReviews*](#getuserreviews)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdatePortfolioItem*](#updateportfolioitem)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListTailorProfiles
You can execute the `ListTailorProfiles` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listTailorProfiles(): QueryPromise<ListTailorProfilesData, undefined>;

interface ListTailorProfilesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListTailorProfilesData, undefined>;
}
export const listTailorProfilesRef: ListTailorProfilesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listTailorProfiles(dc: DataConnect): QueryPromise<ListTailorProfilesData, undefined>;

interface ListTailorProfilesRef {
  ...
  (dc: DataConnect): QueryRef<ListTailorProfilesData, undefined>;
}
export const listTailorProfilesRef: ListTailorProfilesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listTailorProfilesRef:
```typescript
const name = listTailorProfilesRef.operationName;
console.log(name);
```

### Variables
The `ListTailorProfiles` query has no variables.
### Return Type
Recall that executing the `ListTailorProfiles` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListTailorProfilesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListTailorProfilesData {
  tailorProfiles: ({
    id: UUIDString;
    specialty: string;
    averageRating: number;
  } & TailorProfile_Key)[];
}
```
### Using `ListTailorProfiles`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listTailorProfiles } from '@dataconnect/generated';


// Call the `listTailorProfiles()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listTailorProfiles();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listTailorProfiles(dataConnect);

console.log(data.tailorProfiles);

// Or, you can use the `Promise` API.
listTailorProfiles().then((response) => {
  const data = response.data;
  console.log(data.tailorProfiles);
});
```

### Using `ListTailorProfiles`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listTailorProfilesRef } from '@dataconnect/generated';


// Call the `listTailorProfilesRef()` function to get a reference to the query.
const ref = listTailorProfilesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listTailorProfilesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.tailorProfiles);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.tailorProfiles);
});
```

## GetUserReviews
You can execute the `GetUserReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getUserReviews(vars: GetUserReviewsVariables): QueryPromise<GetUserReviewsData, GetUserReviewsVariables>;

interface GetUserReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserReviewsVariables): QueryRef<GetUserReviewsData, GetUserReviewsVariables>;
}
export const getUserReviewsRef: GetUserReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserReviews(dc: DataConnect, vars: GetUserReviewsVariables): QueryPromise<GetUserReviewsData, GetUserReviewsVariables>;

interface GetUserReviewsRef {
  ...
  (dc: DataConnect, vars: GetUserReviewsVariables): QueryRef<GetUserReviewsData, GetUserReviewsVariables>;
}
export const getUserReviewsRef: GetUserReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserReviewsRef:
```typescript
const name = getUserReviewsRef.operationName;
console.log(name);
```

### Variables
The `GetUserReviews` query requires an argument of type `GetUserReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserReviewsVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `GetUserReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserReviewsData {
  reviews: ({
    id: UUIDString;
    rating: number;
    reviewText: string;
    reviewDate: TimestampString;
  } & Review_Key)[];
}
```
### Using `GetUserReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserReviews, GetUserReviewsVariables } from '@dataconnect/generated';

// The `GetUserReviews` query requires an argument of type `GetUserReviewsVariables`:
const getUserReviewsVars: GetUserReviewsVariables = {
  userId: ..., 
};

// Call the `getUserReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserReviews(getUserReviewsVars);
// Variables can be defined inline as well.
const { data } = await getUserReviews({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserReviews(dataConnect, getUserReviewsVars);

console.log(data.reviews);

// Or, you can use the `Promise` API.
getUserReviews(getUserReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

### Using `GetUserReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserReviewsRef, GetUserReviewsVariables } from '@dataconnect/generated';

// The `GetUserReviews` query requires an argument of type `GetUserReviewsVariables`:
const getUserReviewsVars: GetUserReviewsVariables = {
  userId: ..., 
};

// Call the `getUserReviewsRef()` function to get a reference to the query.
const ref = getUserReviewsRef(getUserReviewsVars);
// Variables can be defined inline as well.
const ref = getUserReviewsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserReviewsRef(dataConnect, getUserReviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdatePortfolioItem
You can execute the `UpdatePortfolioItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePortfolioItem(vars: UpdatePortfolioItemVariables): MutationPromise<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;

interface UpdatePortfolioItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePortfolioItemVariables): MutationRef<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;
}
export const updatePortfolioItemRef: UpdatePortfolioItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePortfolioItem(dc: DataConnect, vars: UpdatePortfolioItemVariables): MutationPromise<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;

interface UpdatePortfolioItemRef {
  ...
  (dc: DataConnect, vars: UpdatePortfolioItemVariables): MutationRef<UpdatePortfolioItemData, UpdatePortfolioItemVariables>;
}
export const updatePortfolioItemRef: UpdatePortfolioItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePortfolioItemRef:
```typescript
const name = updatePortfolioItemRef.operationName;
console.log(name);
```

### Variables
The `UpdatePortfolioItem` mutation requires an argument of type `UpdatePortfolioItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePortfolioItemVariables {
  id: UUIDString;
  description?: string | null;
}
```
### Return Type
Recall that executing the `UpdatePortfolioItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePortfolioItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePortfolioItemData {
  portfolioItem_update?: PortfolioItem_Key | null;
}
```
### Using `UpdatePortfolioItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePortfolioItem, UpdatePortfolioItemVariables } from '@dataconnect/generated';

// The `UpdatePortfolioItem` mutation requires an argument of type `UpdatePortfolioItemVariables`:
const updatePortfolioItemVars: UpdatePortfolioItemVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updatePortfolioItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePortfolioItem(updatePortfolioItemVars);
// Variables can be defined inline as well.
const { data } = await updatePortfolioItem({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePortfolioItem(dataConnect, updatePortfolioItemVars);

console.log(data.portfolioItem_update);

// Or, you can use the `Promise` API.
updatePortfolioItem(updatePortfolioItemVars).then((response) => {
  const data = response.data;
  console.log(data.portfolioItem_update);
});
```

### Using `UpdatePortfolioItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePortfolioItemRef, UpdatePortfolioItemVariables } from '@dataconnect/generated';

// The `UpdatePortfolioItem` mutation requires an argument of type `UpdatePortfolioItemVariables`:
const updatePortfolioItemVars: UpdatePortfolioItemVariables = {
  id: ..., 
  description: ..., // optional
};

// Call the `updatePortfolioItemRef()` function to get a reference to the mutation.
const ref = updatePortfolioItemRef(updatePortfolioItemVars);
// Variables can be defined inline as well.
const ref = updatePortfolioItemRef({ id: ..., description: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePortfolioItemRef(dataConnect, updatePortfolioItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.portfolioItem_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.portfolioItem_update);
});
```

