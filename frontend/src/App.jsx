import { useEffect, useState } from 'react'
import OwnerInterface from './pages/OwnerInterface';
import UserInterface from './pages/UserInterface';
import WalletConnect from './functionality/WalletConnect';

function App() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isOwner, setOwner] = useState(false);

  useEffect(() => {
    if(address === "0x92c339e9108c0144ab6b584f46082c1847ed6cdd") {
      setOwner(true);
    }
  }, [address]);    
  ////

  return (
    <>
   
    {
      connected ? (isOwner ?  <OwnerInterface address={address} signer={signer}/> : <UserInterface address={address} signer={signer} getToalStaked = {OwnerInterface.getToalStaked}/>) : <WalletConnect setProvider={setProvider} setSigner = {setSigner} setConnected={setConnected} setAddress={setAddress} />
    }
  

    </>
  )
}

export default App
