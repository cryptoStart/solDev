// import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import spl_token from "@solana/spl-token";
import { web3, Wallet } from "@project-serum/anchor";
import solana from "@solana/web3.js";
import bs58 from "bs58";

async function transfer(tokenMintAddress, wallet, to, connection, amount) {
  const mintPublicKey = new web3.PublicKey(tokenMintAddress);
  const mintToken = new Token(
    connection,
    mintPublicKey,
    TOKEN_PROGRAM_ID,
    wallet.payer // the wallet owner will pay to transfer and to create recipients associated token account if it does not yet exist.
  );
  const fromTokenAccount = await mintToken.getOrCreateAssociatedAccountInfo(
    wallet.publicKey
  );
  const destPublicKey = new web3.PublicKey(to);
  // Get the derived address of the destination wallet which will hold the custom token
  const associatedDestinationTokenAddr = await Token.getAssociatedTokenAddress(
    mintToken.associatedProgramId,
    mintToken.programId,
    mintPublicKey,
    destPublicKey
  );
  const receiverAccount = await connection.getAccountInfo(
    associatedDestinationTokenAddr
  );
  const instructions = [];
  if (receiverAccount === null) {
    instructions.push(
      Token.createAssociatedTokenAccountInstruction(
        mintToken.associatedProgramId,
        mintToken.programId,
        mintPublicKey,
        associatedDestinationTokenAddr,
        destPublicKey,
        wallet.publicKey
      )
    );
  }
  instructions.push(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      fromTokenAccount.address,
      associatedDestinationTokenAddr,
      wallet.publicKey,
      [],
      amount
    )
  );
  const transaction = new web3.Transaction().add(...instructions);
  transaction.feePayer = wallet.publicKey;
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash()
  ).blockhash;
  const transactionSignature = await connection.sendRawTransaction(
    transaction.serialize(),
    { skipPreflight: true }
  );
  await connection.confirmTransaction(transactionSignature);
}

let secretKey = bs58.decode(
  ""
);
let sender_keypair = solana.Keypair.fromSecretKey(secretKey);
console.log(sender_keypair);

// transfer('jsTiyw9aP69zbGGTkDLHkn5gzjqrmcewTaaf1cXFQ6p', )
