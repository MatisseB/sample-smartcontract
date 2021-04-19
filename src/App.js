import Router from "./router"
import Web3 from "web3"
import { useEffect, useState } from "react"
import { accountContext } from "./contexts/AccountContext.js"
import { Loading } from "./components/Loading"

const { Provider } = accountContext

function App() {
  const [accountHash, setAccountHash] = useState(null)

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      console.log("You have a modern web3 browser!")

      await window.ethereum.enable()
    } else if (window.web3) {
      console.log("You have an older web3 browser!")
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert("Non-Ethereum browser detected. You should consider trying MetaMask!")
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts()
    setAccountHash(accounts[0])
  }

  useEffect(() => {
    const initWeb3 = async () => {
      await loadWeb3()
      await loadBlockchainData()
    }

    initWeb3()
  }, [])

  if(accountHash) {
    return (
      <Provider value={{ accountHash: accountHash }}>
        <Router />
      </Provider>
    )
  }

  return <Loading />
}

export default App
