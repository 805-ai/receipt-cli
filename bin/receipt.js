#!/usr/bin/env node
const { program } = require('commander');
const { ethers } = require('ethers');
const fs = require('fs');

const FEE = '0.0001';
const TREASURY = '0x742d35Cc6634C0532925a3b844Bc9e7595f5bD21'; // YOUR WALLET

program.name('receipt-cli').description('Sign receipts. Pay 0.0001 ETH. No middleman.').version('1.0.0');

program.command('sign <message>').description('Sign a message, create receipt, pay fee')
  .option('-k, --key <key>', 'Private key (or set RECEIPT_KEY env)')
  .option('-o, --out <file>', 'Output file', 'receipt.json')
  .option('--rpc <url>', 'RPC endpoint', 'https://mainnet.infura.io/v3/YOUR_KEY')
  .option('--no-pay', 'Skip payment (testnet mode)')
  .action(async (message, opts) => {
    const key = opts.key || process.env.RECEIPT_KEY;
    if (!key) { console.error('No key. Use --key or set RECEIPT_KEY'); process.exit(1); }

    const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
    const wallet = new ethers.Wallet(key, provider);
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({ message, timestamp, signer: wallet.address });
    const signature = await wallet.signMessage(payload);

    let txHash = null;
    if (opts.pay !== false) {
      console.log(`Paying ${FEE} ETH...`);
      const tx = await wallet.sendTransaction({ to: TREASURY, value: ethers.utils.parseEther(FEE) });
      txHash = tx.hash;
      console.log(`Paid: ${txHash}`);
    }

    const receipt = { message, timestamp, signer: wallet.address, signature, payment: txHash };
    fs.writeFileSync(opts.out, JSON.stringify(receipt, null, 2));
    console.log(`Receipt saved: ${opts.out}`);
  });

program.command('verify <file>').description('Verify a receipt signature')
  .action(async (file) => {
    const receipt = JSON.parse(fs.readFileSync(file, 'utf8'));
    const payload = JSON.stringify({ message: receipt.message, timestamp: receipt.timestamp, signer: receipt.signer });
    const recovered = ethers.utils.verifyMessage(payload, receipt.signature);

    if (recovered.toLowerCase() === receipt.signer.toLowerCase()) {
      console.log('✓ VALID');
      console.log(`  Signer: ${receipt.signer}`);
      console.log(`  Message: ${receipt.message}`);
      console.log(`  Time: ${receipt.timestamp}`);
      if (receipt.payment) console.log(`  Payment: ${receipt.payment}`);
    } else {
      console.log('✗ INVALID - signature mismatch');
      process.exit(1);
    }
  });

program.parse();
