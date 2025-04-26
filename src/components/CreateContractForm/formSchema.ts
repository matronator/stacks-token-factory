import { IssueData, z } from 'zod';

export const formSchema = z.object({
    tokenName: z.string().min(3).max(100),
    tokenSymbol: z.string().min(3).max(10),
    tokenSupply: z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
    tokenDecimals: z.coerce.number().int().min(0).max(18),
    tokenURI: z.union([z.literal(''), z.string().url()]),
    mintable: z.boolean().optional(),
    burnable: z.boolean().optional(),
    mintFixedAmount: z.boolean().optional(),
    mintAmount: z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
    initialAmount: z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
    allowMintToAll: z.boolean().optional(),
    burnAmount: z.coerce.number().int().min(0).max(Number.MAX_SAFE_INTEGER).optional(),
    allowBurnToAll: z.boolean().optional(),
}).superRefine((data, ctx) => {
    if (data.tokenSupply === 0) {
        if (!data.mintable) {
            ctx.addIssue({ path: ['tokenSupply'], message: 'You must specify a total supply greater than 0 if your token is not mintable.' } as IssueData);
        }
    }

    if (data.mintable) {
        if (!data.mintAmount) {
            ctx.addIssue({ path: ['mintAmount'], message: 'You must specify the amount to mint when your token is mintable.' } as IssueData);
        } else {
            if (data.tokenSupply > 0) {
                if (data.mintAmount > data.tokenSupply) {
                    ctx.addIssue({ path: ['mintAmount'], message: 'You cannot mint more tokens than the total supply.' } as IssueData);
                }
            }
        }

        if (data.initialAmount) {
            if (data.tokenSupply > 0) {
                if (data.initialAmount > data.tokenSupply) {
                    ctx.addIssue({ path: ['initialAmount'], message: 'You cannot mint more tokens than the total supply.' } as IssueData);
                }
            }
        }
    } else {
        data.mintAmount = undefined;
        data.allowMintToAll = undefined;
        data.mintFixedAmount = undefined;
        data.initialAmount = undefined;
    }

    if (data.burnable) {
        if (!data.burnAmount) {
            ctx.addIssue({ path: ['burnAmount'], message: 'You must specify the amount to burn when your token is burnable.' } as IssueData);
        } else {
            if (data.burnAmount > data.tokenSupply) {
                ctx.addIssue({ path: ['burnAmount'], message: 'You cannot burn more tokens than the total supply.' } as IssueData);
            }
        }
    } else {
        data.burnAmount = undefined;
        data.allowBurnToAll = undefined;
    }
});
