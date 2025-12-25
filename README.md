# receipt-cli

**Sign receipts. 0.0001 ETH. No KYC. Self-custody.**

```bash
npx @finalboss/receipt-cli sign "Abraham built this" --key YOUR_KEY --out receipt.json
npx @finalboss/receipt-cli verify receipt.json
```

## What is this?

Every sign costs 0.0001 ETH. That's it.
- You sign a message
- You pay the fee
- You get a cryptographic receipt
- Anyone can verify it

## Install

```bash
npm install -g @finalboss/receipt-cli
```

## Usage

### Sign a message
```bash
receipt-cli sign "Your message here" --key YOUR_PRIVATE_KEY --out receipt.json
```

Or use an environment variable:
```bash
export RECEIPT_KEY=YOUR_PRIVATE_KEY
receipt-cli sign "Your message here"
```

### Verify a receipt
```bash
receipt-cli verify receipt.json
```

### Options
- `--key, -k`: Your Ethereum private key
- `--out, -o`: Output file (default: receipt.json)
- `--rpc`: RPC endpoint (default: Infura mainnet)
- `--no-pay`: Skip payment (testnet mode)

## How it works

1. Your message + timestamp + signer address = payload
2. Payload is signed with your Ethereum key
3. 0.0001 ETH is sent to the treasury
4. Transaction hash is recorded in the receipt
5. Anyone can verify the signature mathematically

## Receipt format

```json
{
  "message": "Abraham built this",
  "timestamp": "2024-12-24T00:00:00.000Z",
  "signer": "0x...",
  "signature": "0x...",
  "payment": "0x..."
}
```

## License

MIT

---

Built by [FinalBoss](https://finalbosstech.com)
