import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getContractContent, getDepositAddress } from '@/lib/api';
import { store } from '@/lib/state';
import { zodResolver } from '@hookform/resolvers/zod';
import { DeployStatus } from '../../types';
import { Button } from '../Button';
import ConnectWallet from '../ConnectWallet/ConnectWallet';
import { formSchema } from './formSchema';
import { getSelectedProviderId, isConnected, request } from '@stacks/connect';
import { ContractPreviewModal } from './ContractPreviewModal';
import { ContractFormItem } from './ContractFormItem';
import { Pc } from '@stacks/transactions';
import { AlertTriangleIcon, ExternalLinkIcon } from 'lucide-react';
import { Textarea } from '../ui/textarea';
import noImage from '../../assets/no-image.webp';
import { ContractResponse } from '@/lib/api-types';

interface CreateContractFormProps {
    limitedGfx?: boolean;
}

export function CreateContractForm({ limitedGfx }: CreateContractFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            tokenName: '',
            tokenSymbol: '',
            tokenSupply: 0,
            tokenDecimals: 18,
            removeWatermark: false,
            mintable: false,
            burnable: false,
            mintFixedAmount: true,
            mintAmount: 0,
            allowMintToAll: true,
            burnAmount: 0,
            allowBurnToAll: false,
            initialAmount: 0,
            selfHostMetadata: true,
            tokenUri: '',
            tokenMetadata: undefined,
        },
    });

    const [ modalOpen, setModalOpen ] = useState(false);
    const [ contractContent, setContractContent ] = useState<string>('');
    const [ contractName, setContractName ] = useState<string>('');
    const [ contractResponse, setContractResponse ] = useState<ContractResponse>();
    const [ responseLoading, setResponseLoading ] = useState<boolean>(false);

    const [ deployStatus, setDeployStatus ] = useState<DeployStatus>(DeployStatus.Pending);

    const [ txId, setTxId ] = useState<string|undefined>(undefined);

    const [ tokenImage, setTokenImage ] = useState<string>('');

    const watchMintable = form.watch('mintable');
    const watchBurnable = form.watch('burnable');
    const watchMintFixedAmount = form.watch('mintFixedAmount');
    const watchAllowMintToAll = form.watch('allowMintToAll');
    const watchRemoveWatermark = form.watch('removeWatermark');
    const watchSelfHostMetadata = form.watch('selfHostMetadata');

    function calculateDeployCost() {
        let cost = 10;

        if (!watchSelfHostMetadata) {
            cost += 5;
        }

        if (watchMintable) {
            cost += 5;

            if (!watchMintFixedAmount) {
                cost += 3;
            }
            if (!watchAllowMintToAll) {
                cost += 2;
            }
        }

        if (watchBurnable) {
            cost += 5;
        }

        if (watchRemoveWatermark) {
            cost += 5;
        }

        return cost;
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setModalOpen(true);
        setResponseLoading(true);
        const res = await getContractContent(values, calculateDeployCost()).then((val) => {
            setResponseLoading(false);
            return val;
        });
        setContractResponse(res);
        setContractContent(res.body);
        setContractName(res.name);
    }

    async function deployContract() {
        const userData = store.userData;

        const deployBody = contractContent;
        const deployCost = calculateDeployCost();
        const depositAddress = await getDepositAddress();

        if (!userData) {
            setDeployStatus(DeployStatus.Error);
            return;
        }

        // const account = {
        //     idAddress: userData.addresses.stx[0].address,
        //     stxAddress: userData.addresses.stx[0].address,
        //     stxTestnetAddress: userData.addresses.stx[0].address,
        //     btcAddress: userData.addresses.btc[0].address,
        // } as Account;

        // const status = await connectWalletToBackend(account);
        // if (status >= 400) {
        //     setDeployStatus(DeployStatus.Error);
        //     return;
        // }

        // const deployTx = makeUnsignedContractDeploy({
        //     contractName: contractName,
        //     codeBody: deployBody,
        //     numSignatures: 1,
        //     publicKey: store.accounts?.[0].publicKey,
        //     publicKeys: [store.accounts?.[0].publicKey || ''],
        // });

        // broadcastTransaction({
        //     transaction: (await deployTx).serialize(),
        // });

        // console.log(contractContent);

        const provider = getSelectedProviderId();
        if (provider && provider.toLowerCase().includes('xverse')) {
            // const deployResponse = await makeContractDeployToken({
            //     contractName: contractName,
            //     codeBody: contractContent,
            //     postConditionMode: PostConditionMode.Allow,
            // });

        } else {
            const pc = Pc.principal(userData.addresses.stx[0].address).willSendEq(deployCost * 1000000).ustx();
            const deployResponse = await request('stx_deployContract', {
                name: contractName,
                clarityCode: contractContent,
                postConditions: [pc],
                postConditionMode: 'deny',
                clarityVersion: 3,
            });
            setDeployStatus(DeployStatus.Success);
            setTxId(deployResponse.txid);
        }
    }

    if (!isConnected()) {
        return (
            <div className='flex flex-col items-center justify-center my-8'>
                <p className='text-base italic font-thin text-transparent max-w-fit bg-clip-text bg-gradient-to-br from-orange-400 via-yellow-300 to-red-500'>You must connect your Stacks wallet to start creating new tokens.</p>
                <ConnectWallet connectText="Connect wallet to get started" />
                <div className={`${limitedGfx ? '' : 'backlight'} wallet-alert-outter mt-8`}>
                    <div className={`${limitedGfx ? '' : 'glass-border glass-border-short'} wallet-alert`}>
                        {!limitedGfx && (
                            <>
                                <span className="shine"></span>
                                <span className="shine shine-bottom"></span>
                                <span className="glow glow-top"></span>
                                <span className="glow glow-bottom"></span>
                                <span className="glow glow-bright glow-top"></span>
                                <span className="glow glow-bright glow-bottom"></span>
                            </>
                        )}
                        <div className={`p-2 rounded-lg border border-red-500 border-solid grid grid-cols-12 text-left ${limitedGfx ? 'bg-gray-800/70' : ''}`}>
                            <div className='col-span-2 flex items-center justify-center'>
                                <AlertTriangleIcon size={`2.5rem`} className='text-red-500' />
                            </div>
                            <div className='col-span-10'>
                                <p className='text-lg font-bold text-transparent max-w-fit bg-clip-text bg-gradient-to-br from-orange-500 via-red-500 to-rose-700'>We strongly recommend that you connect with <a href="https://leather.io/wallet" target='_blank' rel='noopener noreferrer' className='text-sky-500 no-underline hover:underline hover:text-sky-400 transition-all inline-flex justify-center items-center'>Leather<ExternalLinkIcon size={`1rem`} className='ml-1' /></a> wallet to use this dApp.</p>
                                <p className='text-red-400'>Currently deploying contracts doesn't work with Xverse wallet, due to a <a href="https://github.com/hirosystems/connect/issues/456"  target='_blank' rel='noopener noreferrer' className='text-sky-500 no-underline hover:underline hover:text-sky-400 transition-all inline-flex justify-center items-center'>bug<ExternalLinkIcon size={`1rem`} className='ml-1' /></a>. Other wallets might work, but only Leather is tested and guaranteed to work.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='backlight'>
            <Card className='glass-border'>
                <span className="shine shine-top"></span>
                <span className="shine shine-bottom"></span>
                <span className="glow glow-top"></span>
                <span className="glow glow-bottom"></span>
                <span className="glow glow-bright glow-top"></span>
                <span className="glow glow-bright glow-bottom"></span>
                <CardHeader>
                    <CardTitle>Create new token</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='grid grid-cols-2 gap-4'>
                            <FormField control={form.control} name="tokenName" render={({ field }) => (
                                <ContractFormItem label='Name' autoCols description='The name of your token.' control={ <Input placeholder="Token name" {...field} /> } />
                            )} />
                            <FormField control={form.control} name="tokenSymbol" render={({ field }) => (
                                <ContractFormItem label='Symbol' description='The ticker symbol for your token.' control={ <Input placeholder="TKN" {...field} /> } />
                            )} />
                            <FormField control={form.control} name="tokenSupply" render={({ field }) => (
                                <ContractFormItem label='Total supply' autoCols description={`Total supply of your token.${watchMintable ? ' Set to 0 for unlimited supply.' : ''}`} control={ <Input type="number" min={0} placeholder="0" {...field} /> } />
                            )} />
                            <FormField control={form.control} name="tokenDecimals" render={({ field }) => (
                                <ContractFormItem label='Decimals' description='Number of decimal places for your token. Must be between 0 and 18.' control={ <Input type="number" min={0} placeholder="0" {...field} /> } />
                            )} />
                            <FormField control={form.control} name="selfHostMetadata" render={({ field }) => (
                                <ContractFormItem className='mb-8 col-span-2' costApplies={!watchSelfHostMetadata} additionalCost={5} label='Self-host token metadata' description='You will host the token metadata file yourself and provide only the token URI pointing to the JSON file.' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} /> } />
                            )} />
                            {watchSelfHostMetadata ? (
                                <FormField control={form.control} name="tokenUri" render={({ field }) => (
                                    <ContractFormItem className='mb-8 col-span-2' label='Token URI' description='URL pointing to the token metadata JSON file.' control={ <Input type="url" placeholder="https://example.com/coin.json" {...field} /> } />
                                )} />
                            ) : (
                                <div className='col-span-2 grid grid-cols-subgrid token-metadata-container'>
                                    <div>
                                        <FormField control={form.control} name="tokenMetadata.image" render={({ field }) => (
                                            <ContractFormItem className='mb-8' autoCols label='Image URL' description='URL pointing to an image for your token metadata.' control={ <Input type="url" placeholder="https://example.com/coin.png" onInput={(e) => { setTokenImage(e.currentTarget.value); }} {...field} /> } />
                                        )} />
                                        <FormField control={form.control} name="tokenMetadata.description" render={({ field }) => (
                                            <ContractFormItem className='mb-8' autoCols label='Description' description='Short description of your token.' control={ <Textarea placeholder="Short description for the JSON metadata file..." className='resize-none placeholder:font-light placeholder:italic' {...field} /> } />
                                        )} />
                                    </div>
                                    <div>
                                        <img src={tokenImage} onError={() => { setTokenImage(noImage); }} />
                                    </div>
                                </div>
                            )}
                            <FormField control={form.control} name="mintable" render={({ field }) => (
                                <ContractFormItem className='mb-8' additionalCost={5} costApplies={watchMintable} label='Mintable' description='If checked, the token can be minted after the initial supply is minted.' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} /> } labelClassName='text-gradient-secondary' />
                            )} />
                            <FormField disabled control={form.control} name="burnable" render={({ field }) => (
                                <ContractFormItem disabled className='mb-8' label='Burnable' description='If checked, the token can be burned. (AVAILABLE SOON)' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled /> } labelClassName='text-gradient-primary' />
                            )} />
                            <FormField control={form.control} name="removeWatermark" render={({ field }) => (
                                <ContractFormItem className='col-span-2 mb-8' additionalCost={5} costApplies={watchRemoveWatermark} label='Remove watermark' description='Check this to remove "TokenFactory" watermark from token name and contract code comments.' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} /> } />
                            )} />
                            {watchMintable && (
                                <>
                                    <Separator className='col-span-2' />
                                    <h4 className='col-span-2 mx-auto mb-8 text-gradient-secondary max-w-fit'>Mint Options</h4>
                                    <FormField control={form.control} name="mintAmount" render={({ field }) => (
                                        <ContractFormItem label={`${watchMintFixedAmount ? 'M' : 'Maximum m'}int amount`} description={`The ${watchMintFixedAmount ? '' : 'maximum'} amount of tokens to mint per function call.${watchMintFixedAmount ? '' : ' Set to 0 for unlimited amount.'}`} control={ <Input type="number" min={0} placeholder="0" {...field} /> } />
                                    )} />
                                    <FormField control={form.control} name="mintFixedAmount" render={({ field }) => (
                                        <ContractFormItem label='Fixed amount' autoCols additionalCost={3} costApplies={!watchMintFixedAmount} description='If checked, the amount of tokens minted will be the same every time.' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} /> } />
                                    )} />
                                    <FormField control={form.control} name="allowMintToAll" render={({ field }) => (
                                        <ContractFormItem label='Anyone can mint' autoCols additionalCost={2} costApplies={!watchAllowMintToAll} description='If not checked, only the contract owner can mint tokens.' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} /> } />
                                    )} />
                                    <FormField control={form.control} name="initialAmount" render={({ field }) => (
                                        <ContractFormItem label='Initial amount' description='The initial amount of tokens to mint when the contract is deployed.' control={ <Input type="number" min={0} placeholder="0" {...field} /> } />
                                    )} />
                                </>
                            )}
                            {watchBurnable && (
                                <>
                                    <Separator className='col-span-2' />
                                    <h4 className='col-span-2 mx-auto mb-8 text-gradient-primary max-w-fit'>Burn Options</h4>
                                    <FormField control={form.control} name="burnAmount" render={({ field }) => (
                                        <ContractFormItem label='Burn amount' description='The maximum amount of tokens to burn per contract call.' control={ <Input type="number" min={0} placeholder="0" {...field} /> } />
                                    )} />
                                    <FormField control={form.control} name="allowBurnToAll" render={({ field }) => (
                                        <ContractFormItem label='Anyone can burn' description='If not checked, only the contract owner can burn tokens.' control={ <Checkbox checked={field.value} onCheckedChange={field.onChange} /> } />
                                    )} />
                                </>
                            )}
                            <Separator className='col-span-2' />
                            <p className='col-span-2 font-thin text-md'>Cost to deploy the contract: <strong>{`${calculateDeployCost().toFixed(2)} STX`}</strong> <small className='italic text-yellow-400'>(not including fees)</small></p>
                            <Button className='col-span-2 mb-4' type="submit" variant='secondary'>Preview Contract & Deploy</Button>
                        </form>
                    </Form>
                    <ContractPreviewModal
                        modalOpen={modalOpen}
                        setModalOpen={setModalOpen}
                        form={form}
                        contractResponse={contractResponse}
                        deployContract={deployContract}
                        deployed={deployStatus === DeployStatus.Success}
                        txId={txId}
                        loading={responseLoading}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
