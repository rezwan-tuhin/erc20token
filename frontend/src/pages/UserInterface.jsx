import React, { useEffect, useState } from 'react'
import './Interface.css'
import OwnerInterface from './OwnerInterface';
import { ethers } from 'ethers';
import contractABI from '../functionality/ABI.json';

function UserInterface({address, signer}) {
    const contractAdress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const [contract, setContract] = useState(null);
    const [balance, setBalance] = useState(0);
    const [stakeAmount, setStakeAmount] = useState();
    const [unstakeAmount, setUnsatkeAmount] = useState();
    const [increaseSpender, setIncreaseSpender] = useState();
    const [increaseAmount, setIncreaseAmount] = useState();
    const [decreaseSpender, setDecreaseSpender] = useState();
    const [decreaseAmount, setDecreaseAmount] = useState();
    const [transferAmount, setTransferAmount] = useState();
    const [toAddress, setToAddress] = useState();
    const [alOwner, setAlOwner] = useState();
    const [alRecipient, setAlRecipient] = useState();
    const [alAmount, setalAmount] = useState();
    const [activeTab, setActiveTab] = useState();
    const [isLocked, setIsLocked] = useState();


    useEffect(() => {
        if(signer) {
            const tokenContract = new ethers.Contract(contractAdress, contractABI, signer);
            setContract(tokenContract);
        }
    }, [signer]);

    useEffect(() => {
        if(contract) {
            contract.on("Transfer", (from, to, amount, event) => {
                if(to.toLowerCase() === address.toLowerCase()) {
                    getBalance();
                }
            })
        }
    })

    useEffect (() => {
        getBalance();
        isItLocked();
    }, [contract]);

    const getBalance = async () => {
        if(contract) {
            try {
                const myBalance = await contract.myBalance();
                setBalance(myBalance/(10**18))
            }catch(error) {
                console.error(error);
            }
        }
        
    }
    const transferToken = async () => {
        const amountInWei = ethers.utils.parseUnits(transferAmount, 18);

        try {
            if(contract) {
                const tx = await contract.transfer(toAddress, amountInWei);
                await tx.wait();
                alert(`${transferAmount} Tuhin successfully sent to ${toAddress} `)
                setTransferAmount('');
                setToAddress('');
                getBalance();
            }
        }catch(error) {
            console.log(error);
        }
    }
    const spendToken = async () => {
        const amountInWei = ethers.utils.parseUnits(alAmount, 18);

        try {
            if(contract) {
                const tx = await contract.transferFrom(alOwner, alRecipient, amountInWei);
                await tx.wait();
                setAlOwner('');
                setAlRecipient('');
                setalAmount('');
                alert(`${alAmount} Tuhin successfully transferred to ${alRecipient} From your allowance from ${alOwner}`);
                getBalance();
            }
            
        }catch(error) {
            console.log(error);
        }
    }
    const increaseAllowance = async () => {
        const amountInWei = ethers.utils.parseUnits(increaseAmount, 18);

        try {
            if(contract) {
                const tx = await contract.increaseAllowance(increaseSpender, amountInWei);
                await tx.wait();
                alert(`Allowance increased successful`);
                setIncreaseAmount('');
                getBalance();
            }
        }catch(error) {
            console.error(error);
        }
    }
    const decreaseAllowance = async () => {
        const amountInWei = ethers.utils.parseUnits(decreaseAmount, 18);

        try {
            if(contract) {
                const tx = await contract.decreaseAllowance(decreaseSpender, amountInWei);
                await tx.wait();
                alert(`Allowance decreased successful`);
                setDecreaseAmount('');
                getBalance();
            }
        }catch(error) {
            console.error(error);
        }
    }

    const stakeTokens = async (e) => {
        const stakeInWei = ethers.utils.parseUnits(stakeAmount, 18);

        try {
            if(contract) {
                const tx = await contract.stake(stakeInWei);
                console.log(tx);
                await tx.wait();
                alert(`${stakeAmount} Tuhin successfully staked`);
                getBalance();
            }
            else {
                alert("contract not found!");
            }
            }catch(error) {
                console.error(error);
        }
        
    }
    const unstakeTokens = async (e) => {
        const unstakeInWei = ethers.utils.parseUnits(unstakeAmount, 18);

        try {
            if(contract) {
                const tx = await contract.unstake(unstakeInWei);
                console.log(tx);
                await tx.wait();
                alert(`${unstakeAmount} Tuhin successfully unstaked`);
                getBalance();
            }
            else {
                alert("contract not found!");
            }
            }catch(error) {
                alert(error.reason);
        }
        
    }
    const isItLocked = async () => {
        try {
            if(contract) {
                const tx = await contract.isLocked(address);
                if(tx) {
                    setIsLocked(true);
                } else{
                    setIsLocked(false);
                }
            }
        }catch(error) {
            console.error(error);
        }
    }
    const handleStakeSubmit = async (e) => {
        e.preventDefault();
        stakeTokens();
        setStakeAmount('');
    }
    const handleUntakeSubmit = async (e) => {
        e.preventDefault();
        unstakeTokens();
        setUnsatkeAmount('');
    }

    const handleIncreaseAllowance = (e) => {
        e.preventDefault();
        increaseAllowance();
    }
    const handleDecraseAllowance = (e) => {
        e.preventDefault();
        decreaseAllowance();
    }
    const handleTransferToken = (e) => {
        e.preventDefault();
        transferToken();
    }
    const handleSpendToken = (e) => {
        e.preventDefault();
        spendToken();
    }
  return (
    <>
    {
        activeTab !== 'owner' ? (
            <div className='container'>
        <div className="interface">
            <div className="header">
                <h2>User Interface - Tuhin Token</h2>
            </div>
            <div className="mainsection">
               {
                address === "0x92c339e9108c0144ab6b584f46082c1847ed6cdd" && (
                <section className='sectionheader'>
                    <div className="headerbtn">
                        <button onClick={() => setActiveTab('owner')}>Owner Interface</button>
                        <button onClick={() => setActiveTab('user')}>USer Interface</button>
                    </div>
                </section>
                )
               }
                <section className="accbalance">
                    <div className="sectionheader">
                        <h2>Account Balance</h2>
                    </div>
                    <div className="sectionbody">
                        <div className='sectionbodysingle'>
                            <p>Your Account: <span>{address}</span>  </p>
                            <p>Account Balance: <span>{Number(balance)} Tuhin</span> </p>
                        </div>
                    </div>
                </section>
                <section className="transfer">
                    <div className="sectionheader">
                        <h2>Transfer/Spend Tokens</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Transfer your own Tokens</p>
                            <input type="text" placeholder="Recipient's Account" value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
                            <input type="number" placeholder="Amount" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
                            <button onClick={handleTransferToken}>Send Token</button>
                        </div>
                        <div className="sectionbodyright rightbordernone">
                            <p>Spend your allowance</p>
                            <input type="text" placeholder="Token Owner's Address" value={alOwner} onChange={(e) => setAlOwner(e.target.value)} />
                            <input type="text" placeholder="Recipient's Address" value={alRecipient} onChange={(e) => setAlRecipient(e.target.value)} />
                            <input type="number" placeholder="Amount" value={alAmount} onChange={(e) => setalAmount(e.target.value)}/>
                            <button onClick={handleSpendToken}>Send</button>
                        </div>
                    </div>
                </section>
                <section className="allowancesection">
                    <div className="sectionheader">
                        <h2>Increase/Decrease Allowance</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Increase Allowance</p>
                            <input type="text" placeholder="Spender's Address" name="inspender" value={increaseSpender} onChange={(e) => setIncreaseSpender(e.target.value)} />
                            <input type="number" placeholder='Amount' name="inamount" value={increaseAmount} onChange={(e) => setIncreaseAmount(e.target.value)} />
                            <button onClick={handleIncreaseAllowance}>Increase Allowance</button>
                        </div>
                        <div className="sectionbodyright rightbordernone">
                            <p>Decrease Allowance</p>
                            <input type="text" placeholder="Spender's Address" name="despender" value={decreaseSpender} onChange={(e) => setDecreaseSpender(e.target.value)} />
                            <input type="number" placeholder='Amount' name="deamount" value={decreaseAmount} onChange={(e) => setDecreaseAmount(e.target.value)} />
                            <button onClick={handleDecraseAllowance}>Decrease Allowance</button>
                        </div>
                    </div>
                </section>
                <section className="stakingsection">
                    <div className="sectionheader">
                        <h2>Staking/Unstaking Tokens</h2>
                    </div>
                    <div className="sectionbody">
                        <div className="sectionbodyleft">
                            <p>Stake Tokens</p>
                            <input type="number" placeholder='Amount' name="stake" value={stakeAmount} onChange={(e) => setStakeAmount(e.target.value)} />
                            <button onClick={handleStakeSubmit}>Stake Tokens</button>
                        </div>
                            <div className="sectionbodyright rightbordernone">
                            <p>Unstake Tokens</p>
                            <input type="number" placeholder='Amount' name="unstake" value={unstakeAmount} onChange={(e) => setUnsatkeAmount(e.target.value)} />
                            <button onClick={handleUntakeSubmit}>Unstake Tokens</button>
                    </div>
                    </div>
                </section>
                <section className="lockstatus">
                    <div className="sectionheader">
                        <h2>Account Locked Status</h2>
                    </div>
                        <div className="sectionbody">
                        <div className='sectionbodysingle'>
                            {isLocked ? <p>Your account is Lock</p> : <p>Your account is NOT locked</p>}
                        </div>
                    </div>
                    
                </section>
        </div>
        </div>
    </div>
        ) : <OwnerInterface address={address} signer={signer}/>
    }
    </>
  )
}

export default UserInterface;