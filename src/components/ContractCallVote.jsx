import { isConnected, useConnect } from "@stacks/connect-react";
import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";
import {
  AnchorMode,
  PostConditionMode,
  stringUtf8CV,
} from "@stacks/transactions";

const ContractCallVote = () => {
  const { doContractCall } = useConnect();

  function vote(pick) {
    doContractCall({
      network: STACKS_MAINNET,
      anchorMode: AnchorMode.Any,
      contractAddress: "ST39MJ145BR6S8C315AG2BD61SJ16E208P1FDK3AK",
      contractName: "example-fruit-vote-contract",
      functionName: "vote",
      functionArgs: [stringUtf8CV(pick)],
      postConditionMode: PostConditionMode.Deny,
      postConditions: [],
      onFinish: (data) => {
        console.log("onFinish:", data);
        window
          .open(
            `https://explorer.hiro.so/txid/${data.txId}?chain=testnet`,
            "_blank"
          )
          .focus();
      },
      onCancel: () => {
        console.log("onCancel:", "Transaction was canceled");
      },
    });
  }

  if (isConnected()) {
    return null;
  }

  return (
    <div>
      <p>Vote via Smart Contract</p>
      <button className="Vote" onClick={() => vote("🍊")}>
        Vote for 🍊
      </button>
      <button className="Vote" onClick={() => vote("🍎")}>
        Vote for 🍎
      </button>
    </div>
  );
};

export default ContractCallVote;
