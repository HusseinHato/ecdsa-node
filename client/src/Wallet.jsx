import server from "./server";

import { secp256k1 } from '@noble/curves/secp256k1';
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const address = toHex(secp256k1.getPublicKey(privateKey));
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input placeholder="Type private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        <p>Public Key: {address.slice(0, 6)}...{address.slice(-4)}</p>
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
