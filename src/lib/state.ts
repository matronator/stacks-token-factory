import ls from 'localstorage-slim';
import { proxy } from 'valtio';
import { getLocalStorage, getUserData, isConnected, LocalStorageStore } from '@stacks/connect';

export const store = proxy<{ loggedIn: boolean, userData?: LocalStorageStore }>({
    loggedIn: isConnected(),
    userData: (ls.get('userData') as any) ?? isConnected() ? getLocalStorage() : undefined,
});
