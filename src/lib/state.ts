import ls from 'localstorage-slim';
import { proxy } from 'valtio';
import { getLocalStorage, isConnected, request, StorageData } from '@stacks/connect';

export const store = proxy<{ loggedIn: boolean, userData?: StorageData|null, accounts?: Account[]|null }>({
    loggedIn: isConnected(),
    userData: (ls.get('userData') as StorageData) ?? isConnected() ? getLocalStorage() : undefined,
    accounts: (ls.get('accounts') as Account[]) ?? null,
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
    publicKey: string;
}

export interface Account {
    address: string;
    publicKey: string;
    gaiaHubUrl: string;
    gaiaAppKey: string;
}
