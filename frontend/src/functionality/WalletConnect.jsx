import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers';
import '../pages/Interface.css';


function WalletConnect({setProvider, setSigner, setConnected, setAddress}) {
    const connectWallect = async () => {
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
    // useEffect(() => {
    //     connectWallect();
    // }, []);
  return (
    <div className='connectcontainer'>
        <div class="connectedStatus">
            <h3>Connect Your Wallet</h3>
            <button onClick={connectWallect}>Connect</button>
        </div>
    </div>
  )
}

export default WalletConnect;