import React, { useState, useContext, useEffect } from "react"
import { Form, Input, Button, Row, PageHeader, Divider, Typography, Col, Statistic } from "antd"
import Course from "../../abis/Course.json"
import { accountContext } from "../../contexts/AccountContext"
import { useHistory } from "react-router-dom"
import { useParams } from "react-router"
import styles from "./styles.module.css"
const { Title } = Typography


const Student = () => {
  const { accountHash } = useContext(accountContext)
  const [student, setStudent] = useState({})
  const [isProfessor, setProfessor] = useState(null)
  const [isStudent, setIsStudent] = useState(null)
  const history = useHistory()
  let { studentId } = useParams()
  const web3 = window.web3
  const [form] = Form.useForm()
  
  // équivalent à un componentDidMount
  useEffect(() => {
    const getStudent = async () => {
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
      await contract.methods.professor().call().then(async professor => {
        if (professor == accountHash) {
          setProfessor(true)
        }
        await contract.methods.__students(studentId).call().then( result => {
          if (result.id == accountHash || isProfessor) {
            setIsStudent(true)       
            setStudent({
              name: result.name,
              grade: result.grade,
              comment: result.comment
            })
          } else {
            setIsStudent(false)
          }
        })
      })
    }
    
    getStudent()
  }, [isStudent, isProfessor])

  const assessStudent = async payload => {
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
      .assessStudent(studentId, payload.grade, payload.comment)
      .send({from: accountHash})
      .once("receipt", receipt => {
          window.location.reload(false);
      })
}

const handleSubmit = async () => {
  const grade = form.getFieldValue("note")
  const comment = form.getFieldValue("commentaire")
  const payload = {
    grade,
    comment
  }
  assessStudent(payload)
}
  return (
    <>
      <PageHeader
        style={{ backgroundColor: "#fff" }}
        title="Etudiant"
        subTitle=""
        onBack={() => history.goBack()}
      />
      {
        isStudent?
        <>
        <Title style={{ marginTop: "25px", marginBottom: "50px"}}>Bonjour, {isProfessor?"Professeur":student.name}</Title>
        <Row gutter={162}>
        <Col span={5} style={{ marginLeft: "50px"}}>
          <Statistic 
            title="Note" 
            value={student.grade>-1?student.grade+"/20":"Aucune note"} 
          />
        </Col>
        <Col span={16}>
        <Statistic 
            title="Commentaire" 
            value={student.comment?student.comment:"Pas de commentaire"} 
          />
        </Col>
      </Row>
      </>
        :
        <Title>Interdit</Title>
      }
      {
        isProfessor?
          <>
            <Divider><Title underline>Notation</Title></Divider>

            <div className={styles.mutateFormContainer}>
              <Form
                form={form}
                labelCol={{ span: 3 }}
                initialValues={{
                  available: true
                }}
              >
                <Form.Item name="note" label="Note" rules={[
                  {
                    message: "Le champ note est requis",
                    required: true
                  }
                ]}>
                  <Input type="number" min={0} max={20} placeholder="Note" />
                </Form.Item>
                <Form.Item name="commentaire" label="Commentaire">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item style={{textAlign: "center"}}>
                  <Button onClick={() => handleSubmit()} type="primary">
                    Noter
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </>
          :
          ""
      }
    </>
  )
}

export default Student
