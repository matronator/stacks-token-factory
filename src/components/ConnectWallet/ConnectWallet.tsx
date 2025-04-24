import ls from 'localstorage-slim';
import { Badge } from '@/components/ui/badge';
import {
    NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { store } from '@/lib/state';
import { connect, disconnect, getLocalStorage, isConnected } from '@stacks/connect';
import stxIcon from '../../assets/STX.svg';
import { Button } from '../Button';

function authenticate() {
  connect({
    appDetails: {
      name: "Stacks Token Factory",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: async () => {
      const userData = await getLocalStorage();

      store.userData = userData;
      store.loggedIn = true;

      ls.set('userData', userData);

      window.location.reload();
    },
  });
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
              {getLocalStorage()?.addresses[0]}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-max">
            <div className="grid grid-cols-2 mb-4">
              <div><img src={stxIcon} alt="STX" /></div>
            </div>
            <ul className="relative grid grid-cols-1 pr-0 w-max whitespace-nowrap">
              <li className="grid grid-flow-col-dense mb-2 auto-cols-fr whitespace-nowrap"><Badge className="block w-full col-span-1 text-center">mainnet:</Badge><span className="col-span-6 pr-0 text-center">{getLocalStorage()?.addresses[0]}</span></li>
              <li className="grid grid-flow-col-dense mb-2 auto-cols-fr whitespace-nowrap"><Badge className="block w-full col-span-1 text-center" variant="secondary">testnet:</Badge><span className="col-span-6 pr-0 text-center">{getLocalStorage()?.addresses[0]}</span></li>
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
