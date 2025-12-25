#!/usr/bin/env node
const { program } = require('commander');
const { ethers } = require('ethers');
const fs = require('fs');

const FEE = '0.0001';
const TREASURY = '0xBE4Bd478dB758AA9b2aA8181e764d854940c16C7'; // FinalBoss

// Read key from stdin (CI-safe)
async function readStdin() {
  return new Promise((resolve, reject) => {
    let data = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (c) => (data += c));
    process.stdin.on('end', () => resolve(data.trim()));
    process.stdin.on('error', reject);
  });
}

program.name('receipt-cli-eth').description('Sign receipts. Free. No middleman.').version('1.0.4');

program.command('sign <message>').description('Sign a message, create receipt')
  .option('-k, --key <key>', 'Private key (DISCOURAGED - prefer RECEIPT_KEY env)')
  .option('--key-stdin', 'Read key from stdin (CI-safe)')
  .option('--key-file <path>', 'Read key from file')
  .option('-o, --out <file>', 'Output file', 'receipt.json')
  .option('--pay', 'Optional: send 0.0001 ETH tip to support development')
  .option('--rpc <url>', 'RPC endpoint', 'https://mainnet.infura.io/v3/YOUR_KEY')
  .action(async (message, opts) => {
    // Key resolution: --key-file > --key-stdin > --key > RECEIPT_KEY
    let key;
    if (opts.keyFile) {
      key = fs.readFileSync(opts.keyFile, 'utf8').trim();
    } else if (opts.keyStdin) {
      key = await readStdin();
    } else {
      key = opts.key || process.env.RECEIPT_KEY;
    }

    if (!key) {
      console.error('Missing key. Recommended: set RECEIPT_KEY env var');
      console.error('Alternatives: --key-file <path> | --key-stdin | --key <hex>');
      process.exit(1);
    }

    const wallet = new ethers.Wallet(key);
    const timestamp = new Date().toISOString();
    const payload = JSON.stringify({ message, timestamp, signer: wallet.address });
    const signature = await wallet.signMessage(payload);

    let txHash = null;
    if (opts.pay) {
      const provider = new ethers.providers.JsonRpcProvider(opts.rpc);
      const connectedWallet = wallet.connect(provider);
      console.log(`Sending ${FEE} ETH tip...`);
      const tx = await connectedWallet.sendTransaction({ to: TREASURY, value: ethers.utils.parseEther(FEE) });
      txHash = tx.hash;
      console.log(`Thanks! Tx: ${txHash}`);
    }

    const receipt = { message, timestamp, signer: wallet.address, signature, payment: txHash };
    fs.writeFileSync(opts.out, JSON.stringify(receipt, null, 2));
    console.log(`✓ Receipt saved: ${opts.out}`);
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
