import { Spin } from "antd"
import React from "react"

export const Loading = () => (
  <div style={styles.container}>
    <Spin size="large" />
  </div>
)

const styles = {
  container: {
    alignItems: "center",
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    width: "100%",
  },
}
