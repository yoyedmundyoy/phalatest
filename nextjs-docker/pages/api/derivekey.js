// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {TappdClient} from '@phala/dstack-sdk'
import { privateKeyToAccount } from 'viem/accounts'
import {keccak256} from "viem";
import 'dotenv/config'

export const dynamic = 'force-dynamic'

const endpoint = process.env.DSTACK_SIMULATOR_ENDPOINT || 'http://localhost:8090'

export default async function derivekey(req, res) {
    // Get the Tappd client
    const client = new TappdClient(endpoint)
    const randomNumString = Math.random().toString();
    // Call the deriveKey function and pass in the root of trust to derive a key
    const randomDeriveKey = await client.deriveKey('/', randomNumString);
    // Hash the derivedKey uint8Array value
    const keccakPrivateKey = keccak256(randomDeriveKey.asUint8Array());
    // Get the private key account from the derived key hash
    const account = privateKeyToAccount(keccakPrivateKey);
    // Return derived key pair
    res.status(200).json({account: account.address, privateKey: keccakPrivateKey});
}