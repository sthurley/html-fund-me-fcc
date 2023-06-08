import {ethers} from "./ethers-5.6.esm.min.js"
import {abi, contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
const ownerButton = document.getElementById("ownerButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
ownerButton.onclick = getContractOwner 

async function connect() {
    if(typeof window.ethereum !== "undefined") {
        try {
            // request connection to Metamask
            await window.ethereum.request({method: "eth_requestAccounts"})
        } catch (error) {
            console.log(error)
        }       
        connectButton.innerHTML = "Connected!"
        const accounts = await ethereum.request({method: "eth_accounts"})
        console.log(accounts)
    } else {
        fundButton.innerHTML = "Please install metamask"
    }
}

async function getBalance() {
    if(typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    // grab value from ethAmount input box in HTML form
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}`)
    if(typeof window.ethereum !== "undefined") {
        //find endpoint in MetaMask and use as provider
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // returns account connected via metamask
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)})
            //wait for tx to finish
            await listenForTransactionMine(transactionResponse, provider)
            console.log("Done!")
        } catch(error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`)
            // promise function either returns a "resolve", or a "reject". Will only return resolve once the tx found
            resolve()
        })
    })
    
}

async function withdraw () {
    if (typeof window.ethereum != "undefined") {
        console.log("Withdrawing...")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        console.log(signer)
        const owner = await contract.getOwner()
        console.log(owner)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransactionMine(transactionResponse, provider)
        } catch(error) {
            console.log(error)
        }
    }
}

async function getContractOwner() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        const owner = contract.getOwner()
        console.log(owner)
    }
}
 


