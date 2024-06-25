export enum DeployStatus {
    Pending = 'pending',
    Error = 'error',
    Success = 'success',
}

export interface Account {
    idAddress: string;
    stxAddress: string;
    stxTestnetAddress: string;
    btcAddress: string;
}
