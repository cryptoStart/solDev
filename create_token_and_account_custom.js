import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  SystemProgram,
  PublicKey,
} from "@solana/web3.js";
import {
  createInitializeMintInstruction,
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  getMinimumBalanceForRentExemptMint,
  ACCOUNT_SIZE,
  getMinimumBalanceForRentExemptAccount,
  createInitializeAccountInstruction,
  createMintToCheckedInstruction,
} from "@solana/spl-token";
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
  const mint = Keypair.generate();
  console.log(`mint: ${mint.publicKey.toBase58()}`);

  let tx = new Transaction().add(
    // create mint account
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: mint.publicKey,
      space: MINT_SIZE,
      lamports: await getMinimumBalanceForRentExemptMint(connection),
      programId: TOKEN_PROGRAM_ID,
    }),

    // init mint account
    createInitializeMintInstruction(
      mint.publicKey, // mint pubkey
      8, // decimals
      alice.publicKey, // mint authority
      alice.publicKey
    )
  );
  console.log(
    `txhash: ${await connection.sendTransaction(tx, [feePayer, mint])}`
  );
}
// createCustomToken(connection, feePayer, feePayer);

async function createCustomTokenAccount(
  connection,
  feePayer,
  mintPubkey,
  owner
) {
  const tokenAccount = Keypair.generate();
  console.log(`token account: ${tokenAccount.publicKey.toBase58()}`);

  let tx = new Transaction().add(
    // create token account
    SystemProgram.createAccount({
      fromPubkey: feePayer.publicKey,
      newAccountPubkey: tokenAccount.publicKey,
      space: ACCOUNT_SIZE,
      lamports: await getMinimumBalanceForRentExemptAccount(connection),
      programId: TOKEN_PROGRAM_ID,
    }),
    // init mint account
    createInitializeAccountInstruction(
      tokenAccount.publicKey, // token account
      mintPubkey, // mint
      owner.publicKey // owner of token account
    )
  );
  console.log(
    `txhash: ${await connection.sendTransaction(tx, [feePayer, tokenAccount])}`
  );
}
// createCustomTokenAccount(connection, feePayer, mintPubkey, feePayer);

async function mintTokenSupply(
  connection,
  feePayer,
  mintPubkey,
  tokenAccountPubkey,
  owner
) {
  let tx = new Transaction().add(
    createMintToCheckedInstruction(
      mintPubkey, // mint
      tokenAccountPubkey, // receiver (sholud be a token account)
      owner.publicKey, // mint authority
      101e8, // amount. if your decimals is 8, you mint 10^8 for 1 token.
      8 // decimals
      // [signer1, signer2 ...], // only multisig account will use
    )
  );
  console.log(
    `txhash: ${await connection.sendTransaction(tx, [
      feePayer,
      owner /* fee payer + mint authority */,
    ])}`
  );
}
mintTokenSupply(connection, feePayer, mintPubkey, tokenAccountPubkey, feePayer);

// mint: FWxwvnhkL14jNST9yvGmSKJwzn1EVGgmm3WMPyP4ui8m
// token account: D3kSmrg42o3ufJBJ1muEUkCfjHkgqEyX561dZGyYxPAJ
