import { clusterApiUrl, Connection, Keypair, PublicKey } from "@solana/web3.js";
import { createMint, createAccount, mintToChecked } from "@solana/spl-token";
// import * as bs58 from "bs58";
import bs58 from "bs58";

// connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
// 28s2ykn7V3w7APgEHNw5RFeyuUPDfbQaSzhNt7zje76L
const feePayer = Keypair.fromSecretKey(
  bs58.decode(
    ""
  )
);
// 49duzaQH9o7Li53EAsgS5apaYEtaCYYAqN7kLs1HghBx
const alice = Keypair.fromSecretKey(
  bs58.decode(
    ""
  )
);

// Token public key (the mint not the account)
var mintPubkey = new PublicKey("");

// Token account public key (the actual account where it holds the balance)
const tokenAccountPubkey = new PublicKey(
  ""
);

//  First method to create a token (using built-in function)
async function createCustomToken(connection, feePayer, alice) {
  let mintPubkey = await createMint(
    connection, // conneciton
    feePayer, // fee payer
    alice.publicKey, // mint authority
    alice.publicKey, // freeze authority (you can use `null` to disable it. when you disable it, you can't turn it on again)
    8 // decimals
  );
  console.log(`mint: ${mintPubkey.toBase58()}`);
}
// createCustomToken(connection, feePayer, feePayer);

async function createCustomTokenAccount(
  connection,
  feePayer,
  mintPubkey,
  owner
) {
  const tokenAccount = Keypair.generate();
  let tokenAccountPubkey = await createAccount(
    connection, // connection
    feePayer, // fee payer
    mintPubkey, // mint
    owner.publicKey, // owner
    tokenAccount // token account (if you don't pass it, it will use ATA for you)
  );
  console.log(`token account: ${tokenAccountPubkey.toBase58()}`);
}
// createCustomTokenAccount(connection, feePayer, mintPubkey, feePayer);

async function mintTokenSupply(
  connection,
  feePayer,
  mintPubkey,
  tokenAccountPubkey,
  alice
) {
  let txhash = await mintToChecked(
    connection, // connection
    feePayer, // fee payer
    mintPubkey, // mint
    tokenAccountPubkey, // receiver (sholud be a token account)
    alice, // mint authority
    5e8, // amount. if your decimals is 8, you mint 10^8 for 1 token.
    8 // decimals
  );
  console.log(`txhash: ${txhash}`);
}
mintTokenSupply(connection, feePayer, mintPubkey, tokenAccountPubkey, feePayer);

// mint: HQ6BsouEQr2nhMj6gKPj3u2v8oAtx7rbSZUZVr6c3KYk
// token account: FduQ4sdFx4ei6wxzNNuA3SR3CNPpPLRDsAXJSdgqaqQ5
