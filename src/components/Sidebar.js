import { HomeOutlined, FolderAddOutlined } from "@ant-design/icons"
import { Menu, Layout } from "antd"
import { Link, useHistory } from "react-router-dom"

const { Sider } = Layout

export const Sidebar = () => {
  const history = useHistory()
  const { pathname } = history.location

  return (
    <Sider collapsible>
      <Menu
        defaultSelectedKeys={pathname === "/courses" ? ["estate-route"] : null}
        selectedKeys={[pathname]}
        mode="inline"
        theme="dark"
      >
        <Menu.Item key="/courses" icon={<HomeOutlined />}>
          <Link to="/courses">Cours</Link>
        </Menu.Item>
        <Menu.Item key="/events">
        <Link to="/events">Événements</Link>
        </Menu.Item>
        

      </Menu>
    </Sider>
  )
}
