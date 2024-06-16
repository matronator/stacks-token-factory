import ls from 'localstorage-slim';
import { z } from 'zod';
import { userSession } from '../user-session';
import { formSchema } from './formSchema';

export const API_URL = import.meta.env.VITE_API_URL;

export async function getContractContent(values: z.infer<typeof formSchema>): Promise<string> {
    const body = {
        arguments: {
            name: values.tokenName.replace(/ /g, '-'),
            editableUri: true,
            userWallet: userSession.loadUserData().profile.stxAddress.mainnet,
            ...values,
        }
    }
    const payload = JSON.stringify(body);

    if (ls.get('values') === payload) {
        const code: string = ls.get('contractCode') ?? '';
        if (code !== '') {
            return code;
        }
    }

    ls.set('values', payload);

    const res = await fetch(API_URL + '/generate/contract/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload,
    });

    const data = await res.text();

    ls.set('contractCode', data);

    return data;
}
