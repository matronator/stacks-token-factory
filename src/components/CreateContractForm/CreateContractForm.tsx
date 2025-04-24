import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import ContractEditor from '@/components/editor/ContractEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { connectWalletToBackend, getContractContent } from '@/lib/api';
import { store } from '@/lib/state';
import { zodResolver } from '@hookform/resolvers/zod';
import { Account, DeployStatus } from '../../types';
import { Button } from '../Button';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { formSchema } from './formSchema';
import { isConnected } from '@stacks/connect';

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
            mintFixedAmount: false,
            mintAmount: 0,
            allowMintToAll: false,
            burnAmount: 0,
            allowBurnToAll: false,
            initialAmount: undefined,
        },
    });

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ contractContent, setContractContent ] = useState<string>('');

    const [deployCost, setDeployCost] = useState(10);
    const [ deployStatus, setDeployStatus ] = useState<DeployStatus>(DeployStatus.Pending);

    const watchMintable = form.watch('mintable');
    const watchBurnable = form.watch('burnable');
    const watchMintFixedAmount = form.watch('mintFixedAmount');

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setModalOpen(true);
        const contractCode = await getContractContent(values);
        setContractContent(contractCode);
    }

    async function deployContract() {
        const userData = store.userData;

        if (!userData) {
            setDeployStatus(DeployStatus.Error);
            return;
        }

        const account = {
            idAddress: userData.identityAddress,
            stxAddress: userData.addresses.stx[0].address,
            stxTestnetAddress: userData.addresses.stx[0].address,
            btcAddress: userData.adresses.btc[0].address,
        } as Account;

        const status = await connectWalletToBackend(account);
        if (status >= 400) {
            setDeployStatus(DeployStatus.Error);
            return;
        }
    }

    if (!isConnected()) {
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
                                        <Input type="number" min={0} placeholder="0" {...field} />
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
                                        <Input type="number" min={0} placeholder="0" {...field} />
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
                                    <FormLabel className='text-gradient-secondary'>Mintable:</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={
                                            (value) => {
                                                field.onChange(value);
                                                if (value) {
                                                    setDeployCost(deployCost + 5);
                                                } else {
                                                    setDeployCost(deployCost - 5);
                                                }
                                            }
                                        } />
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
                                    <FormLabel className='text-gradient-primary'>Burnable:</FormLabel>
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={
                                            (value) => {
                                                field.onChange(value);
                                                if (value) {
                                                    setDeployCost(deployCost + 5);
                                                } else {
                                                    setDeployCost(deployCost - 5);
                                                }
                                            }
                                        } />
                                    </FormControl>
                                </div>
                                <FormDescription>
                                    Burnable tokens can be destroyed.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        {watchMintable && (
                            <>
                                <Separator className='col-span-2' />
                                <h4 className='col-span-2 mx-auto mb-8 text-gradient-secondary max-w-fit'>Mint Options</h4>
                                <FormField control={form.control} name="mintAmount" render={({ field }) => (
                                    <FormItem className='mb-8'>
                                        <div className='grid grid-cols-2 place-items-center'>
                                            <FormLabel>{watchMintFixedAmount ? 'M' : 'Maximum m'}int amount:</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={0} placeholder="0" {...field} />
                                            </FormControl>
                                        </div>
                                        <FormDescription>
                                            The {watchMintFixedAmount ? '' : 'maximum'} amount of tokens to mint per contract call.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="mintFixedAmount" render={({ field }) => (
                                    <FormItem className='mb-8'>
                                        <div className='grid grid-cols-2 place-items-center'>
                                            <FormLabel>Fixed amount:</FormLabel>
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </div>
                                        <FormDescription>
                                            If checked, the amount of tokens minted will be the same every time.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="allowMintToAll" render={({ field }) => (
                                    <FormItem className='mb-8'>
                                        <div className='grid grid-cols-2 place-items-center'>
                                            <FormLabel>Anyone can mint:</FormLabel>
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </div>
                                        <FormDescription>
                                            If not checked, only the contract owner can mint tokens.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="initialAmount" render={({ field }) => (
                                    <FormItem className='mb-8'>
                                        <div className='grid grid-cols-2 place-items-center'>
                                            <FormLabel>Initial amount:</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={0} placeholder="0" {...field} />
                                            </FormControl>
                                        </div>
                                        <FormDescription>
                                            The initial amount of tokens to mint when the contract is deployed.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>
                        )}
                        {watchBurnable && (
                            <>
                                <Separator className='col-span-2' />
                                <h4 className='col-span-2 mx-auto mb-8 text-gradient-primary max-w-fit'>Burn Options</h4>
                                <FormField control={form.control} name="burnAmount" render={({ field }) => (
                                    <FormItem className='mb-8'>
                                        <div className='grid grid-cols-2 place-items-center'>
                                            <FormLabel>Burn amount:</FormLabel>
                                            <FormControl>
                                                <Input type="number" min={0} placeholder="0" {...field} />
                                            </FormControl>
                                        </div>
                                        <FormDescription>
                                            The maximum amount of tokens to burn per contract call.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField control={form.control} name="allowBurnToAll" render={({ field }) => (
                                    <FormItem className='mb-8'>
                                        <div className='grid grid-cols-2 place-items-center'>
                                            <FormLabel>Anyone can burn:</FormLabel>
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                        </div>
                                        <FormDescription>
                                            If not checked, only the contract owner can burn tokens.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </>
                        )}
                        <Separator className='col-span-2' />
                        <p className='col-span-2 font-thin text-md'>Cost to deploy the contract: <strong>{`${deployCost.toFixed(2)} STX`}</strong> <small className='italic text-yellow-400'>(not including fees)</small></p>
                        <Button className='col-span-2 mb-4' type="submit" variant='secondary'>Preview Contract & Deploy</Button>
                    </form>
                </Form>
                {modalOpen && (
                    <div className='fixed inset-0 z-50 flex items-center justify-center p-8 bg-black bg-opacity-75'>
                        <div className='max-h-full p-8 overflow-y-auto rounded-lg shadow-lg bg-background'>
                            <h2 className='text-2xl font-bold text-center'>Contract Preview</h2>
                            <p className='text-lg font-thin text-center'>This is a preview of the contract you are about to deploy. Please review the details below.</p>
                            <Separator className='my-4' />
                            <div className='grid grid-cols-2 gap-4'>
                                <div>
                                    <h3 className='text-lg font-bold'>Token Details</h3>
                                    <p><strong>Name:</strong> {form.getValues('tokenName')}</p>
                                    <p><strong>Symbol:</strong> {form.getValues('tokenSymbol')}</p>
                                    <p><strong>Supply:</strong> {form.getValues('tokenSupply')}</p>
                                    <p><strong>Decimals:</strong> {form.getValues('tokenDecimals')}</p>
                                    <p><strong>URI:</strong> {form.getValues('tokenURI')}</p>
                                </div>
                                <div>
                                    <h3 className='text-lg font-bold'>Token Features</h3>
                                    <p><strong>Mintable:</strong> {form.getValues('mintable') ? 'Yes' : 'No'}</p>
                                    <p><strong>Burnable:</strong> {form.getValues('burnable') ? 'Yes' : 'No'}</p>
                                    {form.getValues('mintable') && (
                                        <>
                                            <h4 className='font-bold text-md'>Mint Options</h4>
                                            <p><strong>Fixed Amount:</strong> {form.getValues('mintFixedAmount') ? 'Yes' : 'No'}</p>
                                            <p><strong>Allow Mint to All:</strong> {form.getValues('allowMintToAll') ? 'Yes' : 'No'}</p>
                                            <p><strong>Initial Amount:</strong> {form.getValues('initialAmount')}</p>
                                        </>
                                    )}
                                    {form.getValues('burnable') && (
                                        <>
                                            <h4 className='font-bold text-md'>Burn Options</h4>
                                            <p><strong>Allow Burn to All:</strong> {form.getValues('allowBurnToAll') ? 'Yes' : 'No'}</p>
                                        </>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    <Separator className='my-4' />
                                    <h3>Contract Clarity Code</h3>
                                    <ContractEditor contractBody={contractContent} />
                                    <pre id="" className='p-4 overflow-x-auto font-mono text-sm rounded-lg bg-slate-900'>
                                    </pre>
                                </div>
                            </div>
                            <Separator className='my-4' />
                            <div className='flex justify-between'>
                                <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                                <Button onClick={() => deployContract()} variant='secondary'>Deploy Contract</Button>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
