import ls from 'localstorage-slim';
import { proxy } from 'valtio';
import { getLocalStorage, isConnected, StorageData } from '@stacks/connect';

export const store = proxy<{ loggedIn: boolean, userData?: StorageData|null }>({
    loggedIn: isConnected(),
    userData: (ls.get('userData') as StorageData) ?? isConnected() ? getLocalStorage() : undefined,
});

export interface UserData {
    identityAddress: string;
    addresses: {
        stx: Address[];
        btc: Address[];
    }
}

export interface Address {
    address: string;
}
