import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import {
  EtherspotBatches,
  EtherspotBatch,
  EtherspotTransaction,
  useEtherspotUi,
  useEtherspotAddresses,
  EtherspotContractTransaction,
  useEtherspotTransactions,
} from "@etherspot/transaction-kit";
const abi = require("./constants/NFTAbi.json");

function App() {
  const { estimate, send } = useEtherspotTransactions();
  const etherspotAddresses = useEtherspotAddresses();

  const [address, setAddress] = useState("0x271Ae6E03257264F0F7cb03506b12A027Ec53B31");
  const [amount, setAmount] = useState("0.001");

  return (
    <EtherspotBatches>
      <EtherspotBatch>
        <EtherspotContractTransaction
          contractAddress={"0x9DC78b651F640244211c792a703fceD2c41F16f8"}
          abi={abi}
          methodName={"createEvent"}
          params={["X", "https://ipfs.io/ipfs/bafybeicankr7uxlxbll6b3ohwi2dfnjyluq6w4epuohquebub47gcpqp5u/8953.jpg"]}
          value={"0"}
        />
      </EtherspotBatch>
    </EtherspotBatches>
  );
}

export default App;
