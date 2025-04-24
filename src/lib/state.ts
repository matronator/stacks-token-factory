import ls from 'localstorage-slim';
import { proxy } from 'valtio';
import { getUserData, isConnected, LocalStorageStore, UserData } from '@stacks/connect';

export const store = proxy<{ loggedIn: boolean, userData?: LocalStorageStore }>({
    loggedIn: isConnected(),
    userData: (ls.get('userData') as UserData) ?? isConnected() ? getUserData() : undefined,
});
