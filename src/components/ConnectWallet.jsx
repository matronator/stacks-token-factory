import { showConnect } from "@stacks/connect";

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
      <div>
        <button className="Connect btn" onClick={disconnect}>
          Disconnect Wallet
        </button>
        <p>mainnet: {userSession.loadUserData().profile.stxAddress.mainnet}</p>
        <p>testnet: {userSession.loadUserData().profile.stxAddress.testnet}</p>
      </div>
    );
  }

  return (
    <button className="Connect btn" onClick={authenticate}>
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;
