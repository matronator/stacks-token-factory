import ls from 'localstorage-slim';
import { z } from 'zod';
import { Account } from '@/types';
import { formSchema } from '../components/CreateContractForm/formSchema';
import { camelCaseToSnakeCase } from './utils';
import { getLocalStorage } from '@stacks/connect';
import { store } from './state';
import { ContractResponse, StxBalance } from './api-types';

export const API_URL = import.meta.env.VITE_API_URL;
export const BLOCKCHAIN_API_URL = `https://blockchain.info/q`;
export const STX_API_URL = 'https://api.hiro.so/extended/v2';

export async function getBtcBalance(address: string): Promise<number> {
    const res = await fetch(`${BLOCKCHAIN_API_URL}/addressbalance/${address}`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch balance for address ${address}: ${res.statusText}`);
    }

    const data = await res.text();
    return parseFloat(data);
}

export async function getStxBalance(address: string): Promise<StxBalance> {
    const res = await fetch(`${STX_API_URL}/addresses/${address}/balances/stx?include_mempool=false`, {
        method: 'GET',
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch balance for address ${address}: ${res.statusText}`);
    }

    const data = await res.json();

    return data as StxBalance;
}

export async function getContractContent(values: z.infer<typeof formSchema>, deployCost: number = 10): Promise<ContractResponse> {
    const body = {
        chain: import.meta.env.VITE_STX_CHAIN,
        arguments: {
            name: values.tokenName,
            editableUri: true,
            userWallet: getLocalStorage()?.addresses.stx[0].address,
            deployCost: deployCost * 1000000, // Convert to micro-STX
            ...values,
        }
    }
    const payload = JSON.stringify(body);

    if (ls.get('tokenFormValues') === payload) {
        const code: ContractResponse|null = ls.get('contractResponse') ?? null;
        if (code !== null) {
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

    const data = await res.json();

    ls.set('contractResponse', data);

    return data;
}

export async function getDepositAddress(): Promise<string> {
    const res = await fetch(`${API_URL}/deposit-address`, {
        method: 'GET',
    });

    if (!res.ok) {
        console.warn(`Failed fetching deposit address: ${res.statusText}\nUsed backup address.`);
        // return 'SP39DTEJFPPWA3295HEE5NXYGMM7GJ8MA0TQX379';
        return 'ST2FCRYHEYX9EPHX7QE7HH7RQ2S2XXA9WX1FVV26P';
    }

    return await res.text();
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
