import { z } from 'zod';

export const formSchema = z.object({
    tokenName: z.string().min(3).max(100),
    tokenSymbol: z.string().min(3).max(10),
    tokenSupply: z.number().int().min(0).max(1000000000),
    tokenDecimals: z.number().int().min(0).max(18),
    tokenURI: z.union([z.literal(''), z.string().url()]),
    mintable: z.boolean().optional(),
    burnable: z.boolean().optional(),
});
