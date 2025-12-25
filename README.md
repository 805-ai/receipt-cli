# receipt-cli-eth

**Sign receipts. Free. No middleman.**

```bash
npx receipt-cli-eth sign "Final Boss built this" --out receipt.json
npx receipt-cli-eth verify receipt.json
```

## Key Handling (IMPORTANT)

Do **NOT** pass private keys on the command line unless you understand the risks:
- Shell history
- CI logs  
- Process list

### Recommended: Environment Variable

**macOS/Linux:**
```bash
export RECEIPT_KEY="0xYOUR_PRIVATE_KEY"
npx receipt-cli-eth sign "Final Boss built this" --out receipt.json
```

**Windows PowerShell:**
```powershell
$env:RECEIPT_KEY="0xYOUR_PRIVATE_KEY"
npx receipt-cli-eth sign "Final Boss built this" --out receipt.json
```

### CI-safe: stdin
```bash
printf "%s" "$RECEIPT_KEY" | npx receipt-cli-eth sign "message" --key-stdin --out receipt.json
```

### File-based
```bash
npx receipt-cli-eth sign "message" --key-file ~/.receipt/key --out receipt.json
```

### Legacy (discouraged)
```bash
npx receipt-cli-eth sign "message" --key 0xYOUR_PRIVATE_KEY --out receipt.json
```

## Install

```bash
npm install -g receipt-cli-eth
```

## Usage

### Sign a message
```bash
receipt-cli-eth sign "Your message here" --out receipt.json
```

### Verify a receipt
```bash
receipt-cli-eth verify receipt.json
```

## Options

| Option | Description |
|--------|-------------|
| `--key, -k` | Private key (DISCOURAGED - prefer RECEIPT_KEY env) |
| `--key-stdin` | Read key from stdin (CI-safe) |
| `--key-file <path>` | Read key from file |
| `--out, -o` | Output file (default: receipt.json) |
| `--pay` | Optional tip (0.0001 ETH) to support development |

## Receipt Format

```json
{
  "message": "Final Boss built this",
  "timestamp": "2024-12-25T00:00:00.000Z",
  "signer": "0x...",
  "signature": "0x..."
}
```

## SDK

For programmatic use:
```bash
npm install receipt-sdk
```

```javascript
const { quickSign, verify } = require('receipt-sdk');
const receipt = await quickSign('message', privateKey);
const result = verify(receipt);
```

## License

MIT - Built by FinalBoss
