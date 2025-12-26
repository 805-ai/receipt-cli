# receipt-cli-eth

**Sign cryptographic receipts. Free. No middleman.**

Signing is free. The `--pay` flag optionally sends a 0.0001 ETH tip to support development.

```bash
npx receipt-cli-eth sign "Final Boss built this" --out receipt.json
npx receipt-cli-eth verify receipt.json
```

## Project Names

| Name | What |
|------|------|
| **GitHub repo** | [805-ai/receipt-cli](https://github.com/805-ai/receipt-cli) |
| **npm package / CLI** | `receipt-cli-eth` |
| **SDK** | `receipt-sdk` |

## Key Handling (IMPORTANT)

Do **NOT** pass private keys on the command line unless you understand the risks:
- Shell history exposure
- CI logs leaking secrets
- Process list visibility

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

**macOS/Linux:**
```bash
printf "%s" "$RECEIPT_KEY" | npx receipt-cli-eth sign "message" --key-stdin --out receipt.json
```

**Windows PowerShell:**
```powershell
echo $env:RECEIPT_KEY | npx receipt-cli-eth sign "message" --key-stdin --out receipt.json
```

### File-based

```bash
npx receipt-cli-eth sign "message" --key-file ~/.receipt/key --out receipt.json
```

Ensure key file is `chmod 600` (owner read/write only) on Unix systems.

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

**Version:** 1

```json
{
  "message": "Final Boss built this",
  "timestamp": "2025-12-25T12:00:00.000Z",
  "signer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  "signature": "0x..."
}
```

### Signing Rule (for cross-language verification)

| Property | Value |
|----------|-------|
| **Scheme** | EIP-191 `personal_sign` (eth_sign with `\x19Ethereum Signed Message:\n` prefix) |
| **Signed bytes** | UTF-8 encoding of `JSON.stringify({ message, timestamp, signer })` |
| **Field order** | Exactly: `message`, `timestamp`, `signer` (JavaScript insertion order) |
| **Timestamp** | ISO 8601 with milliseconds: `YYYY-MM-DDTHH:mm:ss.sssZ` |
| **Recovery** | `ethers.utils.verifyMessage(payload, signature)` returns signer address |

**Canonical payload example:**
```
{"message":"Final Boss built this","timestamp":"2025-12-25T12:00:00.000Z","signer":"0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"}
```

Verifiers in other languages must construct this exact string (no extra whitespace, fields in order) before applying EIP-191 recovery.

## Verify Behavior

| Condition | Exit Code | Output |
|-----------|-----------|--------|
| Valid signature | `0` | Prints signer address, message, timestamp |
| Invalid signature | `1` | Prints "INVALID - signature mismatch" |
| Malformed receipt | `1` | Error message |

Use in CI:
```bash
npx receipt-cli-eth verify receipt.json && echo "Valid" || echo "Invalid"
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

MIT - Built by [Final Boss Technology, Inc.](https://finalbosstech.com)

## Patent Notice

**Patent Pending:** US 63/926,683, US 63/917,247, and related applications.

The cryptographic receipt architecture implemented in this software is protected by pending patent applications assigned to Final Boss Technology, Inc.

(c) 2025 Final Boss Technology, Inc. All rights reserved.
