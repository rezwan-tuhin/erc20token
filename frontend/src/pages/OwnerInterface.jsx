import React, { cache, useEffect, useState } from 'react'
import './Interface.css'
import UserInterface from './UserInterface';
import { ethers } from 'ethers';
import contractABI from '../functionality/ABI.json';

function OwnerInterface({address, signer}) {

    const contractAdress = import.meta.env.VITE_CONTRACT_ADDRESS;

    const [contract, setContract] = useState(null);
    const [totalSupply, setTotalSupply] = useState();
    const [addAddress, setAddAddress] = useState();
    const [removeAddress, setRemoveAddress] = useState();
    const [mintAmount, setMintAmount] = useState();
    const [mintAddress, setMintAddress] = useState();
    const [burnAddress, setBurnAddress] = useState();
    const [burnAmount, setBurnAmount] = useState();
    const [paused, setPaused] = useState(false);
    const [lockAddress, setLockAddress] = useState();
    const [lockDuration, setLockDuration] = useState();
    const [unlockAddress, setUnlockAddress] = useState();
    const [isLockedAddress, setIsLockedAddress] = useState();
    const [totalStaked, setTotalStaked] = useState();
    const [activeTab, setActiveTab] = useState('owner');

    useEffect(() => {
        if(signer) {
            const tokenContract = new ethers.Contract(contractAdress, contractABI, signer);
            setContract(tokenContract);
        }
    }, [signer]);

    useEffect (() => {
        getTotalSupply();
        getToalStaked();
    }, [contract]);

    const getTotalSupply = async () => {
        if(contract) {
            try {
                const myTotalSupply = await contract.totalSupply();
                const totalSupplyInTokens = ethers.utils.formatUnits(myTotalSupply, 18);
                setTotalSupply(totalSupplyInTokens);
            }catch(error) {
                console.error(error);
            }
        }
        
    }
    const addToWhitelist = async () => {
        try {
            if(contract) {
                const tx = await contract.addToWhitelist(addAddress);
                await tx.wait();
                alert(`${addAddress} successfully whitelisted`);
                setAddAddress('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const removeFromWhitelist = async () => {
        try {
            if(contract) {
                const tx = await contract.removeFromWhitelist(removeAddress);
                await tx.wait();
                alert(`${removeAddress} successfully removed from whitelist`);
                setRemoveAddress('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const mintToken = async () => {
        const amountToWei = ethers.utils.parseUnits(mintAmount, 18);
        try {
            if(contract) {
                const tx = await contract.mint(mintAddress, amountToWei);
                await tx.wait();
                getTotalSupply();
                alert(`${mintAmount} Tuhin successfully minted to ${mintAddress}`);
                setMintAddress('');
                setMintAmount('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const burnToken = async () => {
        const amountToWei = ethers.utils.parseUnits(burnAmount, 18);
        try {
            if(contract) {
                const tx = await contract.burn(burnAddress, amountToWei);
                await tx.wait();
                getTotalSupply();
                alert(`${burnAmount} Tuhin successfully burned from ${burnAddress}`);
                setBurnAddress('');
                setBurnAmount('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const pauseContract = async () => {
        try {
            if(contract) {
                const tx = await contract.pause();
                await tx.wait();
                setPaused(true);
            }
        }catch(error) {
            console.error(error);
        }
    }
    const unpauseContract = async () => {
        try {
            if(contract) {
                const tx = await contract.unpause();
                await tx.wait();
                setPaused(false);
            }
        }catch(error) {
            console.error(error);
        }
    }
    const lockAccount = async () => {
        const lockDurationInSeconds = lockDuration * 86400;
        try {
            if(contract) {
                const tx = await contract.lockTokens(lockAddress, lockDurationInSeconds);
                await tx.wait();
                alert(`${lockAddress} is successfully locked for next ${lockDuration} days`);
                setLockAddress('');
                setLockDuration('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const unlockAccount = async () => {
        try {
            if(contract) {
                const tx = await contract.unlockTokens(unlockAddress);
                await tx.wait();
                alert(`Account ${unlockAddress} is successfully unlocked`);
                setUnlockAddress('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const isItLocked = async () => {
        try {
            if(contract) {
                const tx = await contract.isLocked(isLockedAddress);
                if(tx) {
                    alert(`Account ${isLockedAddress} is Locked!`);
                }else{
                    alert(`Account ${isLockedAddress} is NOT Locked`);
                }
                setIsLockedAddress('');
            }
        }catch(error) {
            console.error(error);
        }
    }
    const getToalStaked = async () => {
        try{
            if(contract) {
                const tx = await contract.totalStaked();
                const totalStakedTokens = ethers.utils.formatUnits(tx, 18);
                console.log(totalStakedTokens);
                setTotalStaked(totalStakedTokens);
            }
        }catch(error) {
            console.error(error)
        }
    }

    const handleAddtoWhitelist = (e) => {
        e.preventDefault();
        addToWhitelist();
    } 
    const handleRemoveWhitelist = (e) => {
        e.preventDefault();
        removeFromWhitelist();
    }
    const handleMintToken = (e) => {
        e.preventDefault();
        mintToken();
    }
    const handleBurnToken = (e) => {
        e.preventDefault();
        burnToken();
    }
    const handlePauseContract = (e) => {
        e.preventDefault();
        pauseContract();
    }
    const handleUnPauseContract = (e) => {
        e.preventDefault();
        unpauseContract();
    }
    const handleLockAccount = (e) => {
        e.preventDefault();
        lockAccount();
    }
    const handleUnclokAccount = (e) => {
        e.preventDefault();
        unlockAccount();
    }
    const handleIsItLocked = (e) => {
        e.preventDefault();
        isItLocked();
    }

    //call getToalStaked every 5 seconds
    setInterval(getToalStaked, 5000);
  return (
    <>
    {
        activeTab === 'owner' ? (
            <div className='container'>
        <div className="interface">
            <div className="header">
                <h2>Owner Interface - Tuhin Token</h2>
            </div>
            <div className="mainsection">
                <section className='sectionheader'>
                    <div className="headerbtn">
                        <button onClick={() => setActiveTab('owner')}>Owner Interface</button>
                        <button onClick={() => setActiveTab('user')}>USer Interface</button>
                    </div>
                </section>
                <section className='totalsupply'>
                    <div className="sectionheader">
                        <h2>Total Supply: <span>{totalSupply}</span> Tuhin</h2>
                    </div>
                </section>
                <section className="whitelist">
                    <div className="sectionheader">
                        <h2>Whitelist Management</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Add to Whitelist</p>
                            <input type="text" placeholder='Address' value={addAddress} onChange={(e) => setAddAddress(e.target.value)} />
                            <button onClick={handleAddtoWhitelist}>Add to whitelist</button>
                            
                        </div>
                        <div className="sectionbodyright rightbordernone">
                            <p>Remove From Whitelist</p>
                            <input type="text" placeholder='Address' value={removeAddress} onChange={(e) => setRemoveAddress(e.target.value)} />
                            <button onClick={removeFromWhitelist}>Remove from whitelist</button>
                        </div>
                    </div>
                </section>
                <section className='mintburn'>
                    <div className="sectionheader">
                        <h2>Mint/Burn Tokens</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Mint Tokens</p>
                            <input type="text" placeholder='Address' value={mintAddress} onChange={(e) => setMintAddress(e.target.value)} />
                            <input type="number" placeholder='Amount' value={mintAmount} onChange={(e) => setMintAmount(e.target.value)} />
                            <button onClick={handleMintToken}>Mint</button>
                        </div>
                        <div className="sectionbodyright rightbordernone">
                            <p>Burn Tokens</p>
                            <input type="text" placeholder='Address' value={burnAddress} onChange={(e) => setBurnAddress(e.target.value)} />
                            <input type="number" placeholder='Amount' value={burnAmount} onChange={(e) => setBurnAmount(e.target.value)}/>
                            <button onClick={handleBurnToken}>Burn</button>
                        </div>
                    </div>
                </section>
                <section className="pauselock">
                    <div className="sectionheader">
                        <h2>Pause and Lock Management</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Pause Contract</p>
                            <p>Pause Status: {paused ? <span>Contract Paused</span> : <span>Contract Unpaused</span>} </p>
                            {paused ? <button disabled>Pause Contract</button> : <button onClick={handlePauseContract}>Pause Contract</button>}
                            
                        </div>
                        <div className="sectionbodyright rightbordernone">
                            <p>Unpause Contract</p>
                            <p>Pause Status: {paused ? <span>Contract Paused</span> : <span>Contract Unpaused</span>} </p>
                            {paused ? <button onClick={handleUnPauseContract}>Unpause Contract</button> : <button disabled>Unpause Contract</button>}
                        </div>
                    </div>
                </section>
                <section className="lockunlock">
                    <div className="sectionheader">
                        <h2>Lock/Unlock Account</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                        <p>Lock Account</p>
                            <input type="text" placeholder='Address' value={lockAddress} onChange={(e) => setLockAddress(e.target.value)}/>
                            <input type="text" placeholder='Lock Duration (days)' value={lockDuration} onChange={(e) => setLockDuration(e.target.value)}/>
                            <button onClick={handleLockAccount}>Lock Account</button>
                        </div>
                        <div className="sectionbodyright rightbordernone">
                            <p>Unlock Account</p>
                            <input type="text" placeholder='Address' value={unlockAddress} onChange={(e) => setUnlockAddress(e.target.value)}/>
                            <button onClick={handleUnclokAccount}>Unlock Account</button>
                        </div>
                    </div>
                </section>
                <section className='stats'>
                    <div className="sectionheader">
                        <h2>Locked Checking/Staking Stats</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Locked Checking</p>
                            <input type="text" placeholder='Account' value={isLockedAddress} onChange={(e) => setIsLockedAddress(e.target.value)} />
                            <button onClick={handleIsItLocked}>Is It Locked</button>
                        </div>
                        <div className="sectionbodyright">
                            <p>Staking Stats</p>
                            <p>Total Staked: <span>{totalStaked} Tuhin</span></p>
                            {/* <button onClick={getToalStaked} >Click</button> */}
                            <p>Reward Rate: <span>1% per year</span></p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
    ) : <UserInterface address={address} signer={signer} />
    }
    </>
  )
}

export default OwnerInterface