import { Layout } from "antd"
import PropTypes from "prop-types"
import { Navbar } from "../components/Navbar"
import { Sidebar } from "../components/Sidebar"

const { Content } = Layout

const LayoutApp = props => {
  return (
    <>
      <Navbar />
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar />
        <Content
          style={{
            margin: 0,
            minHeight: 280,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </>
  )
}

LayoutApp.propTypes = {
  children: PropTypes.node,
}

export default LayoutApp
