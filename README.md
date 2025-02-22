# Aurelips Faucet DApp

Claim free ALIPS tokens here: https://ipfs.io/ipfs/bafybeihj57jfa6wtd422mq2xoqfviqkrwf6pevpqhmwtwqdhefnsinazgy 

A decentralized application (DApp) that allows users to claim 1 ALIPS token from a faucet on PulseChain, provided they hold at least 5,000 HEX tokens and haven’t claimed before. This DApp runs entirely in the browser, interacting with the PulseChain blockchain via a user’s wallet (e.g., MetaMask).

## Features
- Connects to PulseChain (Chain ID: 369, Hex: `0x171`).
- Checks HEX balance and claim eligibility.
- Displays faucet ALIPS balance and user status.
- Claims 1 ALIPS token (burns 10 ALIPS from the faucet supply).

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended) and npm installed.
- A wallet like [MetaMask](https://metamask.io/) installed in your browser.
- PulseChain added to your wallet (see [PulseChain Docs](https://pulsechain.com/)).

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ultradaylight/Aurelips-Faucet-dApp.git
   cd Aurelips-Faucet-dApp
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Run the DApp Locally**:
   ```bash
   npm start
   ```
   - This starts a local server (using `live-server`) and opens the DApp in your default browser at `http://localhost:8080`.

## Usage
1. **Connect Wallet**:
   - Open the DApp in your browser.
   - Click "Connect Wallet" and approve the connection in MetaMask.

2. **Switch to PulseChain**:
   - If not already on PulseChain (Chain ID: `0x171`), the DApp will prompt you to switch or add it:
     - Chain ID: `369` (Hex: `0x171`)
     - RPC URL: `https://rpc.pulsechain.com`
     - Chain Name: `PulseChain`
     - Symbol: `PLS`
     - Explorer: `https://otter.pulsechain.com`

3. **Check Eligibility**:
   - Ensure you have at least 5,000 HEX tokens in your wallet.
   - The DApp will display your HEX balance, faucet ALIPS balance, and claim status.

4. **Claim Tokens**:
   - If eligible (5,000+ HEX and not previously claimed), click "Claim ALIPS".
   - Approve the transaction in your wallet.

## Project Structure
- `index.html`: The main HTML file with the DApp UI.
- `app.js`: JavaScript logic for wallet connection, contract interaction, and UI updates.
- `ethers.min.js`: Local copy of Ethers.js (optional, included for offline use).
- `package.json`: Node.js configuration for dependencies and scripts.

## Running Decentralized
- This DApp is fully decentralized when run locally:
  - No central server is required; it’s served from your machine.
  - All interactions (claiming tokens, checking balances) occur directly with the PulseChain blockchain via your wallet.
- Optionally, host it on IPFS or a similar decentralized platform for broader access (see [IPFS Hosting](#ipfs-hosting)).

## IPFS Hosting (Optional)
To make it even more decentralized:
1. Bundle the files (`index.html`, `app.js`, `ethers.min.js` if used).
2. Upload to IPFS using a client like [Pinata](https://pinata.cloud/) or the IPFS CLI:
   ```bash
   ipfs add -r .
   ```
3. Share the resulting IPFS hash (e.g., `Qm...`) for others to access via an IPFS gateway.

## Contracts
- **Faucet Contract**: `0x4330D40D7d8b394224D5382FB055e3b9018bb312`
- **Aurelips Token**: `0x9A880e35fcbb1A080762A0Fe117105Ad5715B897`
- **HEX Token**: `0x2b591e99afe9f32eaa6214f7b7629768c40eeb39`

## Troubleshooting
- **"Ethers.js not loaded"**: Ensure the CDN or local `ethers.min.js` is accessible.
- **Wallet Issues**: Verify MetaMask is installed and PulseChain is configured.
- **Insufficient HEX**: You need 5,000 HEX to claim; check your balance on [PulseScan](https://scan.pulsechain.com).

## Contributing
Feel free to fork, submit issues, or create pull requests to improve this DApp!

## License
MIT License - see [LICENSE](LICENSE) for details.
```





