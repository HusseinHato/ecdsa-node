import express from "express";
import cors from "cors";
import { secp256k1 } from '@noble/curves/secp256k1';
import { bytesToHex } from '@noble/curves/abstract/utils';
import { sha256 } from '@noble/hashes/sha256';



const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "033238e408b1f2c3b8a5ebf485bbf08aaeec5cda54791dbcd61f2acab75bf76ef4": 120,
  "02318835280682823ddb38a29f2e5929fb8955e83c8735bebfda435ef43d43d284": 60,
  "021ca6a5a9e2294c7219f370f82fa8da35a3b0bd14ac96d1916dcf67c863b7b6f8": 90,
};

app.get("/", (req, res) => {
  res.send({ message: "Hello World" });
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { signature, recipient, amount, recoveryId } = req.body;

  let sig = secp256k1.Signature.fromDER(signature); // or .fromDER(sigDERHex)
  sig = sig.addRecoveryBit(recoveryId); // bit is not serialized into compact / der format
  const publicKey = sig.recoverPublicKey(sha256(`${amount}`)).toHex()

  setInitialBalance(publicKey);
  setInitialBalance(recipient);

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
