import ls from 'localstorage-slim';
import { z } from 'zod';
import { Account } from '@/types';
import { formSchema } from '../components/CreateContractForm/formSchema';
import { camelCaseToSnakeCase } from './utils';
import { getLocalStorage } from '@stacks/connect';
import { store } from './state';

export const API_URL = import.meta.env.VITE_API_URL;

export async function getContractContent(values: z.infer<typeof formSchema>): Promise<string> {
    const body = {
        arguments: {
            name: values.tokenName.replace(/ /g, '-'),
            editableUri: true,
            userWallet: getLocalStorage()?.addresses.stx[0].address,
            ...values,
        }
    }
    const payload = JSON.stringify(body);

    if (ls.get('tokenFormValues') === payload) {
        const code: string = ls.get('contractCode') ?? '';
        if (code !== '') {
            return code;
        }
    }

    ls.set('tokenFormValues', payload);

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

export async function connectWalletToBackend(account: Account) {
    const body = normalizeProperties(account);
    const payload = JSON.stringify(body);

    const res = await fetch(API_URL + '/connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: payload,
    });

    const status = await res.status;

    return status;
}

export function normalizeProperties(obj: any): any {
    if (Array.isArray(obj)) {
        return obj.map(item => normalizeProperties(item));
    } else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).reduce((acc, key) => {
            const snakeCaseKey = camelCaseToSnakeCase(key);
            acc[snakeCaseKey] = normalizeProperties(obj[key]);
            return acc;
        }, {} as any);
    } else {
        return obj;
    }
}
