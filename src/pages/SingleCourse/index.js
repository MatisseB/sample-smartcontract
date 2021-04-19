import React, { useState, useEffect, useContext } from "react"
import { Form, Input, Card, Button, Spin, Typography, Row, PageHeader, Col, Divider } from "antd"
import { useHistory } from "react-router-dom"
import { accountContext } from "../../contexts/AccountContext"
import Course from "../../abis/Course.json"
import styles from "./styles.module.css"

var faker = require('faker');


const { Meta } = Card
const { Title } = Typography

const SingleCourse = () => {
  const { accountHash } = useContext(accountContext)
  const [isProfessor, setProfessor] = useState(null)
  const [title, setTitle] = useState("")
  const [students, setStudents] = useState([])
  const history = useHistory()
  const [form] = Form.useForm()

  useEffect(() => {
    const getCourse = async () => {
      const web3 = window.web3
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

      let professor = await contract.methods.professor().call().then(professor => {
        return professor
      })
      if (professor == accountHash) {
        let title = await contract.methods.title().call().then( title => {
          return title
        })
        setTitle(title)
        setProfessor(true)
        await contract.methods.totalSupply().call().then(async totalSupply => {
          if (totalSupply > 0) {
            for (let i = 0; i<totalSupply; i++) {
              await contract.methods.students(i).call().then(async student => {
                await contract.methods.__students(student).call().then(infos => {
                  setStudents(students => [...students, {
                    name: infos.name,
                    grade: infos.grade==-1?"":infos.grade,
                    id: student
                  }])
                })
              })
            }
          }
        })
      } else {
        history.push("/students/"+accountHash)
      }
    }

    getCourse()
  }, [])

  const registerStudent = async payload => {
      const web3 = window.web3
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

      await contract.methods
        .registerStudent(payload.adresse, faker.name.findName())
        .send({from: accountHash})
        .once("receipt", receipt => {
          window.location.reload(false);
        })
  }

  const handleSubmit = async () => {
    const adresse = form.getFieldValue("adresse")
    const payload = {
      adresse
    }
    registerStudent(payload)
  }
  
  // Redirect to Student
  const cardOnclick = id => {
    history.push('/students/'+id)
  } 

  return (
    <>

      <PageHeader
        style={{backgroundColor: "#fff"}}
        title={title}
        subTitle="Etudiants"
        onBack={() => history.goBack()}
      />
      {(isProfessor)?
      <>
        <div className={styles.mutateFormContainer}>
          <Form
            form={form}
            labelCol={{ span: 3 }}
            initialValues={{
              available: true
            }}
          >
            <Form.Item name="adresse" label="Adresse" rules={[
              {
                message: "Le champ adresse est requis !",
                required: true
              }
            ]}>
              <Input placeholder="Adresse" />
            </Form.Item>
            <Form.Item style={{textAlign: "center"}}>
              <Button onClick={() => handleSubmit()} type="primary">
                Ajouter un Etudiant
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Divider><Title underline>Liste des etudiants</Title></Divider>
        
        <Row>

        {students.length > 0 &&
          students.map((student) => {
            return (
              <Col key={student.id} style={{ marginTop: 25, marginLeft: 25 }}>
              <Card
                hoverable
                style={{ width: "200px"}}
                onClick={() => {cardOnclick(student.id)}}
              >
                <Meta title={<>{student.name}</>} />
                <p><strong>Note: {student.grade}</strong></p>
              </Card>
            </Col>
            )
          })}
        </Row>

      </>
      :
      <Spin />
      }
    </>
  )
}

export default SingleCourse
