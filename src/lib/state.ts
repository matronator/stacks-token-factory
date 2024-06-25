import ls from 'localstorage-slim';
import { proxy } from 'valtio';
import { userSession } from '@/user-session';
import { UserData } from '@stacks/connect';

export const store = proxy<{ loggedIn: boolean, userData?: UserData }>({
    loggedIn: userSession.isUserSignedIn(),
    userData: (ls.get('userData') as UserData) ?? userSession.isUserSignedIn() ? userSession.loadUserData() : undefined,
});
