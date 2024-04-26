import { showConnect } from "@stacks/connect";
import { NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent } from '@/components/ui/navigation-menu';
import { userSession } from "../user-session";

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

const ConnectWallet = () => {
  if (userSession.isUserSignedIn()) {
    return (
      <>
        <NavigationMenuItem>
          <button className="Connect btn" onClick={disconnect}>
            Disconnect Wallet
          </button>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <div className="truncate max-w-24">
              {userSession.loadUserData().profile.stxAddress.mainnet}
            </div>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul>
              <li>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</li>
              <li>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </>
    );
  }

  return (
    <button className="Connect btn" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
