const AURELIPS_FAUCET_ADDRESS = "0x4330D40D7d8b394224D5382FB055e3b9018bb312";
const AURELIPS_TOKEN_ADDRESS = "0x9A880e35fcbb1A080762A0Fe117105Ad5715B897";
const HEX_TOKEN_ADDRESS = "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39";

const FAUCET_ABI = [
    "function claimTokens() external",
    "function hasClaimed(address) view returns (bool)",
    "function aurelipsToken() view returns (address)",
    "function hexToken() view returns (address)"
];

const ERC20_ABI = [
    "function balanceOf(address) view returns (uint256)"
];

let provider;
let signer;
let account;
let faucetContract;
let hexContract;
let aurelipsContract;

const REQUIRED_HEX_BALANCE = BigInt("5000000000000000000000"); // 5000 HEX in wei

function initApp() {
    if (typeof ethers === 'undefined') {
        console.error("Ethers.js not loaded yet. Retrying in 100ms...");
        setTimeout(initApp, 100);
        return;
    }

    document.addEventListener('DOMContentLoaded', () => {
        const connectButton = document.getElementById('connectWallet');
        const claimButton = document.getElementById('claimButton');
        const statusDiv = document.getElementById('status');

        connectButton.addEventListener('click', connectMetaMask);
        claimButton.addEventListener('click', claimTokens);

        if (!window.ethereum) {
            statusDiv.innerText = "Please install a compatible Ethereum wallet (e.g., MetaMask, Trust Wallet) to use this DApp.";
            return;
        }

        provider = new ethers.BrowserProvider(window.ethereum);
        checkForExistingConnection();
    });
}

initApp();

async function checkForExistingConnection() {
    try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            await connectMetaMask();
        }
    } catch (error) {
        console.error("Error checking existing connection:", error);
    }
}

async function connectMetaMask() {
    const statusDiv = document.getElementById('status');
    try {
        if (!provider) {
            if (!window.ethereum) {
                throw new Error("No Ethereum wallet detected.");
            }
            provider = new ethers.BrowserProvider(window.ethereum);
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        account = accounts[0];
        signer = await provider.getSigner();

        await switchToPulseChain();

        faucetContract = new ethers.Contract(AURELIPS_FAUCET_ADDRESS, FAUCET_ABI, signer);
        hexContract = new ethers.Contract(HEX_TOKEN_ADDRESS, ERC20_ABI, signer);
        aurelipsContract = new ethers.Contract(AURELIPS_TOKEN_ADDRESS, ERC20_ABI, signer);

        await updateUI();
    } catch (error) {
        statusDiv.innerText = `Error connecting to wallet: ${error.message}`;
    }
}

async function switchToPulseChain() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x171' }],
        });
    } catch (switchError) {
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                    chainId: '0x171',
                    chainName: 'PulseChain',
                    nativeCurrency: { name: 'PLS', symbol: 'PLS', decimals: 18 },
                    rpcUrls: ['https://rpc.pulsechain.com'],
                    blockExplorerUrls: ['https://scan.pulsechain.com']
                }]
            });
        } else {
            throw switchError;
        }
    }
}

async function updateUI() {
    const accountAddress = document.getElementById('accountAddress');
    const hexBalanceSpan = document.getElementById('hexBalance');
    const faucetBalanceSpan = document.getElementById('faucetBalance');
    const claimStatusSpan = document.getElementById('claimStatus');
    const claimButton = document.getElementById('claimButton');
    const statusDiv = document.getElementById('status');

    accountAddress.innerText = `${account.slice(0, 6)}...${account.slice(-4)}`;

    const hexBalance = await hexContract.balanceOf(account);
    const formattedHexBalance = Number(ethers.formatEther(hexBalance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    hexBalanceSpan.innerText = formattedHexBalance;

    const faucetBalance = await aurelipsContract.balanceOf(AURELIPS_FAUCET_ADDRESS);
    const formattedFaucetBalance = Number(ethers.formatEther(faucetBalance)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    faucetBalanceSpan.innerText = formattedFaucetBalance;

    const hasClaimed = await faucetContract.hasClaimed(account);
    claimStatusSpan.innerText = (!hasClaimed && hexBalance >= REQUIRED_HEX_BALANCE) ? "Eligible" : "Not Eligible";

    claimButton.disabled = hasClaimed || hexBalance < REQUIRED_HEX_BALANCE;
    if (hexBalance < REQUIRED_HEX_BALANCE) {
        statusDiv.innerText = "You need at least 5,000 HEX to claim.";
    } else if (hasClaimed) {
        statusDiv.innerText = "You have already claimed your tokens.";
    } else if (faucetBalance < BigInt("11000000000000000000")) {
        statusDiv.innerText = "Faucet has insufficient ALIPS to process claims.";
    } else {
        statusDiv.innerText = "Ready to claim 1 ALIPS!";
    }
}

async function claimTokens() {
    const statusDiv = document.getElementById('status');
    statusDiv.innerText = "Processing claim...";

    try {
        const tx = await faucetContract.claimTokens();
        statusDiv.innerText = "Transaction sent. Waiting for confirmation...";
        await tx.wait();
        statusDiv.innerText = "Successfully claimed 1 ALIPS! 10 ALIPS burned.";
        await updateUI();
    } catch (error) {
        statusDiv.innerText = `Error: ${error.message}`;
    }
}
