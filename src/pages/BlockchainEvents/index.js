import React, { useState, useEffect } from "react"
import { Card, PageHeader, List, Typography, Divider, Table  } from "antd"
import Course from "../../abis/Course.json"
import { useHistory } from "react-router-dom"
import styles from "./styles.module.css"

const { Meta } = Card

const BlockchainEvents = () => {
  const [events, setEvents] = useState([])
  const history = useHistory()
  const web3 = window.web3

  // équivalent à un componentDidMount
  useEffect(() => {
    const getEvents = async () => {
      const networkId = await web3.eth.net.getId()
      const networkData = Course.networks[networkId]
      let contract

      if (networkData) {
        const abi = Course.abi
        const address = networkData.address
        contract = new web3.eth.Contract(abi, address)
        setEvents([])
        contract.getPastEvents("allEvents", { fromBlock: 0, toBlock: 'latest' }).then(result => {
          let i=0
          result.map(async item => {
            if (item.event == "studentAssessed" || item.event == "studentAdded") {
            setEvents(events => [...events, {
              key: i++,
              event: item.event,
              professor: item.returnValues.professor,
              student: item.returnValues.student,
              date: new Date(item.returnValues.timestamp*1000).toString()
            }])
            }
          })
        })
      } else {
        window.alert("Smart contract not deployed to detected network.")
      }
    }

    getEvents()
  }, [])

  const columns = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
    },
    {
      title: 'Professor',
      dataIndex: 'professor',
      key: 'professor',
    },
    {
      title: 'Student',
      dataIndex: 'student',
      key: 'student',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    }
  ];

  return (
    <>
      <PageHeader
        style={{ backgroundColor: "#fff" }}
        title="Événements"
        onBack={() => history.goBack()}
      />
      <div className={styles.coursesPageContent}>
      </div>
      <Divider orientation="left">Événements</Divider>
      <Table dataSource={events} columns={columns} />;
    </>
  )
}

export default BlockchainEvents
