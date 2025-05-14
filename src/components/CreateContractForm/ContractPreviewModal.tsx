import { useForm } from "react-hook-form";
import ContractEditor from "../editor/ContractEditor";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { formSchema } from "./formSchema";
import { z } from "zod";

interface ContractPreviewModalProps {
    modalOpen: boolean;
    setModalOpen: (open: boolean) => void;
    form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
    contractContent: string;
    deployContract: () => Promise<void>;
}

export function ContractPreviewModal({ modalOpen, setModalOpen, form, contractContent, deployContract }: ContractPreviewModalProps) {
    if (!modalOpen) return null;
    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-8 bg-black bg-opacity-75' onClick={(e) => {if (e.target === e.currentTarget) setModalOpen(false)}}>
            <div className='max-h-full p-8 overflow-y-auto rounded-lg shadow-lg bg-background'>
                <h2 className='text-2xl font-bold text-center'>Contract Preview</h2>
                <p className='text-lg font-thin text-center'>This is a preview of the contract you are about to deploy. Please review the details below.</p>
                <Separator className='my-4' />
                <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
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
    );
}
