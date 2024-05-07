import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSession } from '../../user-session';
import { Button } from '../Button';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { formSchema } from './formSchema';

export function CreateContractForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenName: '',
            tokenSymbol: '',
            tokenSupply: 0,
            tokenDecimals: 18,
            tokenURI: '',
            mintable: false,
            burnable: false,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    if (!userSession.isUserSignedIn()) {
        return (
            <div className='flex flex-col items-center justify-center my-8'>
                <p className='text-base italic font-thin text-transparent max-w-fit bg-clip-text bg-gradient-to-br from-orange-400 via-yellow-300 to-red-500'>You must connect your Stacks wallet to start creating new tokens.</p>
                <ConnectWallet connectText="Connect wallet to get started" />
            </div>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create new token</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-4'>
                        <FormField control={form.control} name="tokenName" render={({ field }) => (
                            <FormItem className='mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Token name:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Token name" {...field} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    The name of your token.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="tokenSymbol" render={({ field }) => (
                            <FormItem className='mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Token symbol:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="TKN" {...field} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    The ticker symbol for your token.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="tokenSupply" render={({ field }) => (
                            <FormItem className='mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Total supply:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    Total supply of your token. Set to 0 for unlimited supply.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="tokenDecimals" render={({ field }) => (
                            <FormItem className='mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Token Decimals:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="0" {...field} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    Number of decimal places for your token. Must be between 0 and 18.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="tokenURI" render={({ field }) => (
                            <FormItem className='col-span-2 mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Token URI:</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://example.com/token.json" {...field} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    Optional URI for your token metadata (can also be IPFS URI).
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="mintable" render={({ field }) => (
                            <FormItem className='mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Mintable:</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    Mintable tokens can be created after the initial supply is minted.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="burnable" render={({ field }) => (
                            <FormItem className='mb-8'>
                                <div className='grid grid-cols-2 place-items-center'>
                                    <FormLabel>Burnable:</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    Burnable tokens can be destroyed.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button className='col-span-2 mb-4' type="submit" variant='secondary'>Preview Contract & Deploy</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
