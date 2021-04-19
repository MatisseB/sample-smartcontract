import React, { useState, Suspense, useEffect, useContext } from "react"
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom"
import { Loading } from "../components/Loading"
import LayoutApp from "../layout/LayoutApp"
import Course from "../abis/Course.json"
import { accountContext } from "../contexts/AccountContext"


const Courses = React.lazy(() => import("../pages/Courses"))
const Student = React.lazy(() => import("../pages/Student"))
const SingleCourse = React.lazy(() => import("../pages/SingleCourse"))
const BlockchainEvents = React.lazy(() => import("../pages/BlockchainEvents"))

const Router = () => {
  const [authorized, setAuthorized] = useState()
  const { accountHash } = useContext(accountContext)
  const web3 = window.web3

  useEffect(async () => {
    const networkId = await web3.eth.net.getId()
    const networkData = Course.networks[networkId]
    let contract
    
    if (networkData) {
      const abi = Course.abi
      const address = networkData.address
      contract = new web3.eth.Contract(abi, address)
    } else {
      window.alert("Smart contract not deployed to detected network.")
    }
    
    
    const isAuthorized = async () => {
      contract.methods.getProfessor().call().then( prof => {
        if (prof === accountHash) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      })}

      isAuthorized()
  }, [])

  return (
    <BrowserRouter>
      <Switch>
        <LayoutApp>
          <Suspense fallback={<Loading />}>
          <Route exact path="/" render={() => <Redirect to="/courses" />} />
            <Route exact path="/courses" render={() => <Courses />} />
            <Route exact path="/course/:courseId" render={() => <SingleCourse />} />
            <Route exact path="/students/:studentId" render={() => <Student />} />
            <Route exact path="/events" render={() => <BlockchainEvents />} />
          </Suspense>
        </LayoutApp>
      </Switch>
    </BrowserRouter>
  )
}

export default Router
