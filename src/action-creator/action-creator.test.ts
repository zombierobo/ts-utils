import { createAction, ActionsUnion } from './index';

describe('Action creation', () => {
  test('Define redux actions and action creators in a compact way', () => {
    const FETCH_USERS = 'FETCH_USERS';
    const FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS';
    const FETCH_USER_BY_ID = 'FETCH_USERS_BY_ID';
    const Actions = {
      fetchUsers: () => createAction(FETCH_USERS),
      fetchUsersSuccess: (users: Array<{ name: string }>) =>
        createAction(FETCH_USERS_SUCCESS, users),
      fetchUserById: (userId: string) => createAction(FETCH_USER_BY_ID, userId)
    };
    type Actions = ActionsUnion<typeof Actions>;

    expect(Actions.fetchUsers().type === 'FETCH_USERS').toBeTruthy();

    const users = [{ name: 'Bob' }, { name: 'Tom' }];
    expect(
      Actions.fetchUsersSuccess(users).type === 'FETCH_USERS_SUCCESS'
    ).toBeTruthy();
    expect(Actions.fetchUsersSuccess(users).payload === users).toBeTruthy();

    expect(
      Actions.fetchUserById('Ram').type === 'FETCH_USERS_BY_ID'
    ).toBeTruthy();
    expect(Actions.fetchUserById('Ram').payload === 'Ram').toBeTruthy();
  });
});
