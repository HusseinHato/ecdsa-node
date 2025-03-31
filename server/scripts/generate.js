const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { secp256k1 } = require("@noble/curves/secp256k1");

const privateKey = secp.utils.randomPrivateKey();

console.log('private key: ', toHex(privateKey));

const publicKey = secp256k1.getPublicKey(privateKey);

console.log('public key', toHex(publicKey));

