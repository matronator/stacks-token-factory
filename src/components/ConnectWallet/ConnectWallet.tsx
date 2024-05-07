import { Badge } from '@/components/ui/badge';
import {
    NavigationMenuContent, NavigationMenuItem, NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { showConnect } from '@stacks/connect';
import stxIcon from '../../assets/STX.svg';
import { userSession } from '../../user-session';
import { Button } from '../Button';

function authenticate() {
  showConnect({
    appDetails: {
      name: "Stacks Token Factory",
      icon: window.location.origin + "/logo512.png",
    },
    redirectTo: "/",
    onFinish: () => {
      window.location.reload();
    },
    userSession,
  });
}

function disconnect() {
  userSession.signUserOut("/");
}

interface ConnectWalletProps {
  connectText?: string;
  disconnectText?: string;
}

const ConnectWallet = (props: ConnectWalletProps) => {
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <NavigationMenuItem>
          <Button variant="primary" className="Connect" onClick={disconnect}>
            {props.disconnectText ?? "Disconnect Wallet"}
          </Button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="truncate max-w-24">
              {userSession.loadUserData().profile.stxAddress.mainnet}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-max">
            <div className="grid grid-cols-2 mb-4">
              <div><img src={stxIcon} alt="STX" /></div>
            </div>
            <ul className="relative grid grid-cols-1 pr-0 w-max whitespace-nowrap">
              <li className="grid grid-flow-col-dense mb-2 auto-cols-fr whitespace-nowrap"><Badge className="block w-full col-span-1 text-center">mainnet:</Badge><span className="col-span-6 pr-0 text-center">{userSession.loadUserData().profile.stxAddress.mainnet}</span></li>
              <li className="grid grid-flow-col-dense mb-2 auto-cols-fr whitespace-nowrap"><Badge className="block w-full col-span-1 text-center" variant="secondary">testnet:</Badge><span className="col-span-6 pr-0 text-center">{userSession.loadUserData().profile.stxAddress.testnet}</span></li>
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
