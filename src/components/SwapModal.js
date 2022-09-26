import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TokenModal from './TokenModal';


function SwapModal({ tokens, user }) {
    const qs = require('qs');
    const Web3 = require('web3');
    const BigNumber = require('bignumber.js');


    // Swap modal
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Swap amount 
    const [fromAmount, setFromAmount] = useState(null);
    const [toAmount, setToAmount] = useState(null);

    // Tokem Modal Open
    const [tokenOpenFrom, setTokenOpenFrom] = useState(false);
    const [tokenOpenTo, setTokenOpenTo] = useState(false);

    const handleTokenModalTo = () => {
        setTokenOpenTo(prev => !prev);
    }
    const handleTokenModalFrom = () => {
        setTokenOpenFrom(prev => !prev);
    }

    // Token TO and FROM
    const [tokenFrom, setTokenFrom] = useState(null);
    const [tokenTo, setTokenTo] = useState(null);

    const handleTokenFromChange = (tokenObj) => {
        setTokenFrom(tokenObj);
    }
    const handleTokenToChange = (tokenObj) => {
        setTokenTo(tokenObj);
    }

    async function handlePriceEstimate() {
        if (!tokenFrom || !tokenTo) return
        let amount = fromAmount * 10 ** tokenFrom.decimals
        console.log(amount)

        const params = {
            sellToken: tokenFrom.address,
            buyToken: tokenTo.address,
            sellAmount: amount
        }

        const response = await fetch(`https://api.0x.org/swap/v1/price?${qs.stringify(params)}`)
        const priceJSON = await response.json();
        console.log("fetching price", priceJSON)
        setToAmount(priceJSON.buyAmount / (10 ** tokenTo.decimals))
    }

    async function getQuote(account) {
        if (!tokenFrom || !tokenTo || !user) return

        console.log("getting quote")

        let amount = fromAmount * 10 ** tokenFrom.decimals
        console.log(amount)

        const params = {
            sellToken: tokenFrom.address,
            buyToken: tokenTo.address,
            sellAmount: amount,
            // takerAddress: account
        }
        const response = await fetch(`https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`)
        const swapQuoteJSON = await response.json();

        setToAmount(swapQuoteJSON.buyAmount / (10 ** tokenTo.decimals))

        return swapQuoteJSON;
    }

    async function trySwap() {

        // Pulls in any address / most recent used account.
        let accounts = await window.ethereum.request({ method: "eth_accounts" });
        console.log("window.eth", accounts[0]);
        console.log("user", user)

        let takerAddress = accounts[0];
        const swapQuoteJSON = await getQuote(takerAddress);
        console.log(swapQuoteJSON)

        // Set token allowance 
        const web3 = new Web3(Web3.givenProvider);
        const fromTokenAddress = tokenFrom.address;
        const erc20Abi = [
            {
                "constant": true,
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_spender",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_from",
                        "type": "address"
                    },
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "name": "balance",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "name": "",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "_to",
                        "type": "address"
                    },
                    {
                        "name": "_value",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "name": "",
                        "type": "bool"
                    }
                ],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "_owner",
                        "type": "address"
                    },
                    {
                        "name": "_spender",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "payable": true,
                "stateMutability": "payable",
                "type": "fallback"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            }
        ]

        const ERC20TokenContract = new web3.eth.Contract(erc20Abi, fromTokenAddress);
        console.log("setup erc20 token contract: ", ERC20TokenContract);

        const maxApproval = new BigNumber(2).pow(256).minus(1);

        ERC20TokenContract.methods.approve(swapQuoteJSON.allowanceTarget, maxApproval)
            .send({ from: takerAddress })
            .then(tx => console.log("tx: ", tx))

        const receipt = await web3.eth.sendTransaction(swapQuoteJSON);
        console.log("receipt: ", receipt);
    }




    return (
        <div className='swap-modal-wrapper'>
            <Button onClick={handleOpen}>Open modal</Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                hideBackdrop={true}
            >
                <>
                    <Box className='swap-modal'>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Swap
                        </Typography>

                        <Box className='swap-box'>
                            <h1>From</h1>
                            <input type="text" placeholder='0.0' onBlur={handlePriceEstimate} value={fromAmount} onChange={(e) => setFromAmount(e.target.value)} />
                            <div onClick={handleTokenModalFrom} className='token-dropdown'>
                                <h2>🔁</h2>
                                <h2>{tokenFrom && tokenFrom.symbol}</h2>
                            </div>
                            {tokens.length && <TokenModal tokenOpen={tokenOpenFrom} handleTokenModal={handleTokenModalFrom} tokens={tokens} handleTokenFromChange={handleTokenFromChange} />}
                        </Box>

                        <Box className='swap-box'>
                            <h1>To</h1>
                            <input type="text" placeholder='0.0' value={toAmount} />
                            <div onClick={handleTokenModalTo} className='token-dropdown'>
                                <h2>🔁</h2>
                                <h2>{tokenTo && tokenTo.symbol}</h2>
                            </div>
                            {tokens.length && <TokenModal tokenOpen={tokenOpenTo} handleTokenModal={handleTokenModalTo} tokens={tokens} handleTokenFromChange={handleTokenToChange} />}
                        </Box>

                        <button disabled={!user} onClick={trySwap}>SWAP</button>
                    </Box>

                </>



            </Modal>
        </div>
    );
}

export default SwapModal;
