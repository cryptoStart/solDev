import {
  clusterApiUrl,
  Connection,
  Keypair,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import {
  getMint,
  getAccount,
  transferChecked,
  createTransferCheckedInstruction,
} from "@solana/spl-token";
// import * as bs58 from "bs58";
import bs58 from "bs58";

// Required by all functions other than than token transfer
const token_mint = "";
const token_mint_account = "";

// DAW6UfE737f4FvSxxfDbjWsXhXLbszaY1WczpTRveS8q
const feePayer = Keypair.fromSecretKey(
  bs58.decode(
    ""
  )
);

// connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

async function getTokenMintInfo(connection, token_mint) {
  const mint = new PublicKey(token_mint);
  let mintAccount = await getMint(connection, mint);
  console.log(mintAccount.mintAuthority.toBase58());
  console.log(mintAccount);
}
// getTokenMintInfo(connection, token_mint);

async function getTokenAccountInfo(connection, pubkey_str) {
  const tokenAccountPubkey = new PublicKey(pubkey_str);
  let tokenAccount = await getAccount(connection, tokenAccountPubkey);
  console.log(tokenAccount);
}
// getTokenAccountInfo(connection, token_mint_account);

async function getTokenAccountBalance(connection, pubkey_str) {
  const tokenAccountPubkey = new PublicKey(pubkey_str);
  let tokenAmount = await connection.getTokenAccountBalance(tokenAccountPubkey);
  console.log(tokenAmount);
}
// getTokenAccountBalance(connection, token_mint_account);

//  ======================================================================
//  Required for Token Transfer
let token_mint_pubkey = new PublicKey(
  ""
);
let token_mint_account_pubkey = new PublicKey(
  ""
);
let token_mint_account_pubkey_receiver = new PublicKey(
  ""
);

async function transferCustomTokenBuiltin(
  connection,
  feePayer,
  token_mint_account_pubkey,
  token_mint_account_pubkey_receiver,
  token_mint_pubkey,
  owner
) {
  let txhash = await transferChecked(
    connection, // connection
    feePayer, // payer
    token_mint_account_pubkey, // from (should be a token account)
    token_mint_pubkey, // mint
    token_mint_account_pubkey_receiver, // to (should be a token account)
    owner, // from's owner
    10e8, // amount, if your deciamls is 8, send 10^8 for 1 token
    8 // decimals
  );
  console.log(`txhash: ${txhash}`);
}
// transferCustomTokenBuiltin(
//   connection,
//   feePayer,
//   token_mint_account_pubkey,
//   token_mint_account_pubkey_receiver,
//   token_mint_pubkey,
//   feePayer
// );

// Second way for transfering custom token; compose by yourself
async function transferCustomTokenManual(
  connection,
  feePayer,
  token_mint_account_pubkey,
  token_mint_account_pubkey_receiver,
  token_mint_pubkey,
  owner
) {
  let tx = new Transaction().add(
    createTransferCheckedInstruction(
      token_mint_account_pubkey, // from (should be a token account)
      token_mint_pubkey, // mint
      token_mint_account_pubkey_receiver, // to (should be a token account)
      owner.publicKey, // from's owner
      1e8, // amount, if your deciamls is 8, send 10^8 for 1 token
      8 // decimals
    )
  );
  console.log(
    `txhash: ${await connection.sendTransaction(tx, [
      feePayer,
      owner /* fee payer + owner */,
    ])}`
  );
}
// transferCustomTokenManual(
//   connection,
//   feePayer,
//   token_mint_account_pubkey,
//   token_mint_account_pubkey_receiver,
//   token_mint_pubkey,
//   feePayer
// );
