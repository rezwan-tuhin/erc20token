import { useState } from "react";
import contractABI from './ABI.json;'

const [provider, setProvider] = useState();
const [signer, setSigner] = useState();
const [connected, setConnected] = useState(false);
const [address, setAddress] = useState();

const contractAddress = '0xba5819d121adcf258ee8e77fabe2c0327c5b96cf';

export const useAddress = () => {
    return [address, setAddress];
}

export const connectWallet = async () => {
    if(window.ethereum) {
        try {
            const accounts = await window.ethereum.request(
                {
                    method: 'eth_requestAccounts'
                }
            )

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            setProvider(provider);
            setSigner(signer);
            setConnected(true);
            setAddress(accounts[0]);
        }catch(error) {
            console.error(error);
        };
    } else {
        console.alert("Please install metamask");
    }
}

export const getContract = () => {
    if(signer) {
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        return contract;
    }
    else{
        alert("Connect Wallet Please!");
    }
}



