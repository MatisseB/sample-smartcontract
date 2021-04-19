import React, { useState, useEffect } from "react"
import { Card, Row, Col, PageHeader } from "antd"
import Course from "../../abis/Course.json"
import { useHistory } from "react-router-dom"
import styles from "./styles.module.css"

const { Meta } = Card

const Courses = () => {
  const [courses, setCourses] = useState([])
  const history = useHistory()
  const web3 = window.web3

  // équivalent à un componentDidMount
  useEffect(() => {
    const getCourses = async () => {
      const networkId = await web3.eth.net.getId()
      const networkData = Course.networks[networkId]
      let contract

      if (networkData) {
        const abi = Course.abi
        const address = networkData.address
        contract = new web3.eth.Contract(abi, address)
        
        let title = await contract.methods.title().call().then( title => {
          return title
        })
        let nbStudents = await contract.methods.studentCounter().call().then( nb => {
          return nb
        })
        setCourses(courses => [...courses, {
          title: title,
          nbSudents: nbStudents,
          _address: contract._address
        }])
      } else {
        window.alert("Smart contract not deployed to detected network.")
      }
    }

    getCourses()
  }, [])

  // Redirect to Course
  const cardOnclick = tokenId => {
    history.push('/course/'+tokenId)
  } 

  return (
    <>
      <PageHeader
        style={{ backgroundColor: "#fff" }}
        title="Cours"
        onBack={() => history.goBack()}
      />
      <div className={styles.coursesPageContent}>
        <Row>
          {courses.length > 0 &&
            courses.map((course) => {
              return (
                <Col key={course.id} style={{ marginTop: 25, marginLeft: 25 }}>
                  <Card
                    hoverable
                    style={{ width: "350px", height: "400px" }}
                    onClick={() => {cardOnclick(course._address)}}
                    cover={
                      <img
                        alt={course.name}
                        style={{ height: 275 }}
                        src="https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                      />
                    }
                  >
                    <Meta title={<>{course.title}</>} />
                    <p><strong>{course.nbSudents} Etudiants</strong></p>
                  </Card>
                </Col>
              )
            })}
        </Row>
      </div>
    </>
  )
}

export default Courses
