import ls from 'localstorage-slim';
import {
    NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { store } from '@/lib/state';
import { connect, disconnect, getLocalStorage, isConnected } from '@stacks/connect';
import stxIcon from '../../assets/STX.svg';
import btcIcon from '../../assets/BTC.svg';
import { Button } from '../Button';
import { CopyToClipboard } from '@/components/ui/copy-to-clipboard';

async function authenticate() {
  const res = await connect({
    // appDetails: {
    //   name: "Stacks Token Factory",
    //   icon: window.location.origin + "/logo512.png",
    // },
    // redirectTo: "/",
    // onFinish: async () => {
    //   const userData = await getLocalStorage();

    //   store.userData = userData;
    //   store.loggedIn = true;

    //   ls.set('userData', userData);

    //   window.location.reload();
    // },
  });

  if (res?.addresses[0]?.address !== null) {
    const userData = getLocalStorage();
    store.userData = userData;
    store.loggedIn = true;
    ls.set('userData', userData);
    window.location.reload();
  }
}

function disconnectWallet() {
  store.loggedIn = false;
  store.userData = undefined;

  ls.remove('userData');

  disconnect();
  window.location.reload();
}

interface ConnectWalletProps {
  connectText?: string;
  disconnectText?: string;
}

const ConnectWallet = (props: ConnectWalletProps) => {
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
