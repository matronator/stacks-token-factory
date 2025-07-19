import { useForm } from "react-hook-form";
import ContractEditor from "@/components/editor/ContractEditor";
import { Button } from "../Button";
import { Separator } from "@/components/ui/separator";
import { formSchema } from "./formSchema";
import { z } from "zod";
import { LucideCircleCheck } from "lucide-react";
import { ContractResponse } from "@/lib/api-types";
import noImage from '../../assets/no-image.webp';
import { MiddleEllipsis } from "../MiddleEllipsis";

interface ContractPreviewModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    contractResponse?: ContractResponse;
    deployContract: () => Promise<void>;
    deployed?: boolean;
    txId?: string;
    loading?: boolean;
}

export function ContractPreviewModal({ modalOpen, setModalOpen, form, contractResponse, deployContract, deployed, txId, loading = false }: ContractPreviewModalProps) {
    const tokenUri = form.getValues('selfHostMetadata') ? form.getValues('tokenUri') : (contractResponse?.tokenUri ?? `Can't get token URI.`);

    if (!modalOpen) return null;
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-8 bg-black bg-opacity-75' onClick={(e) => {if (e.target === e.currentTarget) setModalOpen(false)}}>
            <div className='max-h-full p-8 overflow-y-auto rounded-lg shadow-lg bg-background'>
                <h2 className='text-2xl font-bold text-center'>Contract Preview</h2>
                <p className='text-lg font-thin text-center'>This is a preview of the contract you are about to deploy. Please review the details below.</p>
                <Separator className='my-4' />
                <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                    <div>
                        <h3 className='text-lg font-bold bg-clip-text text-transparent bg-gradient-to-t bg-cover from-orange-500 via-yellow-400 to-amber-500' style={{ backgroundSize: "100% 50%", backgroundPositionY: "center" }}>Token Details</h3>
                        <p><strong>Name:</strong> {contractResponse?.originalName ?? form.getValues('tokenName')}</p>
                        <p><strong>Symbol:</strong> {form.getValues('tokenSymbol').toUpperCase()}</p>
                        <p><strong>Supply:</strong> {form.getValues('tokenSupply')}</p>
                        <p><strong>Decimals:</strong> {form.getValues('tokenDecimals')}</p>
                        <p><strong>Token URI:</strong> <a href={tokenUri} className="text-sky-500 hover:underline" target="_blank" rel="nofollow noopener"><MiddleEllipsis text={tokenUri} maxLength={64} /></a></p>
                        {contractResponse?.tokenMetadata && (
                            <>
                                <h3 className='text-lg font-bold bg-clip-text text-transparent bg-gradient-to-t bg-cover from-orange-500 via-yellow-400 to-amber-500' style={{ backgroundSize: "100% 50%", backgroundPositionY: "center" }}>Hosted Metadata File</h3>
                                <p><strong>Name:</strong> {contractResponse?.tokenMetadata?.name}</p>
                                <p><strong>Description:</strong> {contractResponse?.tokenMetadata?.description}</p>
                                <p><strong>Image:</strong> <img width="128" className="inline" src={contractResponse?.tokenMetadata?.image ?? noImage} /></p>
                            </>
                        )}
                    </div>
                    <div>
                        <h3 className='text-lg font-bold bg-clip-text text-transparent bg-gradient-to-t bg-cover from-orange-500 via-yellow-400 to-amber-500' style={{ backgroundSize: "100% 50%", backgroundPositionY: "center" }}>Token Features</h3>
                        <p><strong>Hosting metadata file:</strong> {form.getValues('selfHostMetadata') ? 'No' : 'Yes'}</p>
                        <p><strong>Watermark:</strong> {form.getValues('removeWatermark') ? 'No' : 'Yes'}</p>
                        <p><strong>Mintable:</strong> {form.getValues('mintable') ? 'Yes' : 'No'}</p>
                        <p><strong>Burnable:</strong> {form.getValues('burnable') ? 'Yes' : 'No'}</p>
                        {form.getValues('mintable') && (
                            <>
                                <h4 className='font-bold text-md text-gradient-secondary'>Mint Options</h4>
                                <p><strong>Fixed Amount:</strong> {form.getValues('mintFixedAmount') ? 'Yes' : 'No'}</p>
                                <p><strong>Allow Mint to All:</strong> {form.getValues('allowMintToAll') ? 'Yes' : 'No'}</p>
                                <p><strong>Initial Amount:</strong> {form.getValues('initialAmount')}</p>
                            </>
                        )}
                        {form.getValues('burnable') && (
                            <>
                                <h4 className='font-bold text-md text-gradient-primary'>Burn Options</h4>
                                <p><strong>Allow Burn to All:</strong> {form.getValues('allowBurnToAll') ? 'Yes' : 'No'}</p>
                            </>
                        )}
                    </div>
                    <div className="col-span-2">
                        {deployed ? (
                            <div className='text-green-400 text-lg text-center p-4'>
                                <div className="flex items-center justify-center">
                                    <LucideCircleCheck size='2em' className="mr-2" /> Contract has been successfully deployed!
                                </div>
                                <div className='mt-4 text-white text-base font-normal'>
                                    Transaction: <a href={`https://explorer.hiro.so/txid/${txId}`} target='_blank' rel='noopener noreferrer' className='text-orange-500 hover:underline'>{txId}</a>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Separator className='my-4' />
                                <h3>Contract Clarity Code</h3>
                                <ContractEditor contractBody={contractResponse?.body ?? (loading ? 'Loading contract code...' : 'No contract code was loaded.')} />
                            </>
                        )}
                    </div>
                </div>
                <Separator className='my-4' />
                <div className='flex justify-between'>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button onClick={() => deployContract()} variant='secondary'>Deploy Contract</Button>
                </div>
            </div>
        </div>
    );
}
