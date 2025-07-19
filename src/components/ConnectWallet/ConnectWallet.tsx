import ls from 'localstorage-slim';
import {
    NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { store } from '@/lib/state';
import { connect, disconnect, getLocalStorage, isConnected, request } from '@stacks/connect';
import stxIcon from '../../assets/STX.svg';
import btcIcon from '../../assets/BTC.svg';
import { Button } from '../Button';
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard';
import { useEffect, useState } from 'react';
import { getBtcBalance, getStxBalance } from '@/lib/api';

async function authenticate() {
  const res = await connect();

  if (res?.addresses[0]?.address !== null) {
    const userData = getLocalStorage();
    store.userData = userData;
    store.loggedIn = true;
    ls.set('userData', userData);
    window.location.reload();
  }

  const response = await request('stx_getAccounts');
  if (response && response.accounts) {
    store.accounts = response.accounts;
    ls.set('accounts', response.accounts);
  }
}

function disconnectWallet() {
  store.loggedIn = false;
  store.userData = undefined;
  store.accounts = null;

  ls.remove('userData');
  ls.remove('accounts');

  disconnect();
  window.location.reload();
}

interface ConnectWalletProps {
  connectText?: string;
  disconnectText?: string;
}

const ConnectWallet = (props: ConnectWalletProps) => {
  const [stxBalance, setStxBalance] = useState<number>(0);
  const [btcBalance, setBtcBalance] = useState<number>(0);

  useEffect(() => {
    const fetchBalances = async () => {
      if (store.userData?.addresses?.stx[0]?.address) {
        try {
          const balance = await getStxBalance(store.userData.addresses.stx[0].address);
          setStxBalance(Number(balance.balance) / 1000000);
        } catch (error) {
          console.error('Error fetching STX balance:', error);
        }
      }
      if (store.userData?.addresses?.btc[0]?.address) {
        try {
          const btcBalance = await getBtcBalance(store.userData.addresses.btc[0].address);
          setBtcBalance(btcBalance / 100000000);
        } catch (error) {
          console.error('Error fetching BTC balance:', error);
        }
      }
    };
    if (isConnected()) {
      fetchBalances();
    }
  }, [store.userData?.addresses]);

  if (isConnected()) {
    return (
      <>
        <NavigationMenuItem>
          <Button variant="primary" className="Connect" onClick={disconnectWallet}>
            {props.disconnectText ?? "Disconnect Wallet"}
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="truncate max-w-24">
              {store.userData?.addresses?.stx[0]?.address}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-max">
            <div className="text-sm font-bold mb-2">Connected Wallets</div>
            <ul className="relative grid grid-cols-1 pr-0 w-max whitespace-nowrap">
              <li className='grid grid-flow-col-dense mb-2 auto-cols-fr border-[1px] border-white border-opacity-30'>
                <span>{stxBalance.toFixed(6)}</span>
                <span className='border-r-[1px] border-white border-opacity-30'>STX</span>
                <span>{btcBalance.toFixed(8)}</span>
                <span>BTC</span>
              </li>
              <li className="grid grid-flow-col-dense mb-2 auto-cols-fr whitespace-nowrap">
                <img src={stxIcon} alt="STX" />
                <CopyToClipboard text={store.userData?.addresses?.stx[0]?.address ?? 'No address'}>
                  <span className="col-span-6 pr-0 text-center">{store.userData?.addresses?.stx[0]?.address}</span>
                </CopyToClipboard>
              </li>
              <li className="grid grid-flow-col-dense mb-2 auto-cols-fr whitespace-nowrap">
                <img src={btcIcon} alt="BTC" />
                <CopyToClipboard text={store.userData?.addresses?.btc[0]?.address ?? 'No address'}>
                  <span className="col-span-6 pr-0 text-center">{store.userData?.addresses?.btc[0]?.address}</span>
                </CopyToClipboard>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </>
    );
  }

  return (
    <Button className="Connect" variant="primary" onClick={authenticate}>
      {props.connectText ?? "Connect Wallet"}
    </Button>
  );
};

export default ConnectWallet;
