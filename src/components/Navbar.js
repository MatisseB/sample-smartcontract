import { Layout, Menu } from "antd"
import { useContext } from "react"
import { accountContext } from "../contexts/AccountContext"
import Catalog from "../abis/Catalog.json"
import { Link, useHistory } from "react-router-dom"


const { Header } = Layout

export const Navbar = () => {
  const { accountHash } = useContext(accountContext)
  const web3 = window.web3
  const history = useHistory()

  const redirect = async () => {
    history.push('/owner/')
  }


  return (
    <Header>
      <Menu mode="horizontal" theme="dark" className="header">
        <Menu.Item 
          onClick={redirect} 
          style={{ float: "right" }}>{accountHash}</Menu.Item>
      </Menu>
    </Header>
  )
}
