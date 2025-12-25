# receipt-cli-eth

**Sign receipts. Free. No middleman.**

```bash
npx receipt-cli-eth sign "Abraham built this" --key YOUR_KEY
npx receipt-cli-eth verify receipt.json
```

## What is this?

Cryptographic receipts. That's it.
- You sign a message
- You get a verifiable receipt
- Anyone can verify it
- **Free.**

## Install

```bash
npm install -g receipt-cli-eth
```

## Usage

### Sign a message
```bash
receipt-cli sign "Your message here" --key YOUR_PRIVATE_KEY
```

### Verify a receipt
```bash
receipt-cli verify receipt.json
```

### Options
- `--key, -k`: Your Ethereum private key (or set RECEIPT_KEY env)
- `--out, -o`: Output file (default: receipt.json)
- `--pay`: Optional tip (0.0001 ETH) to support development

## Receipt format

```json
{
  "message": "Abraham built this",
  "timestamp": "2024-12-25T00:00:00.000Z",
  "signer": "0x...",
  "signature": "0x..."
}
```

## License

MIT

---

Built by [FinalBoss](https://finalbosstech.com)
