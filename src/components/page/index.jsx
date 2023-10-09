import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"; // needed for dayClick

import { Col, Row, Button, Modal, Card, Select } from "antd";
// functions
import { createEvent, listEvent } from "../functions/fullcalendar";
import moment from 'moment'
 
const index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [values, setValues] = useState({
    title: "",
    start: "",
    end: "",
    color: "",
  });

  const [events, setEvents] = useState([]);

  const department = [
    { id: "1", name: "แผนกบัญชี", color: "red" },
    { id: "2", name: "แผนกไอที", color: "green" },
    { id: "3", name: "แผนกการเงิน", color: "pink" },
    { id: "4", name: "แผนกจัดเซื้อ", color: "#FF8080" },
  ];

  useEffect(() => {
    loaddata();
    drag();
  }, []);

  const loaddata = () => {
    listEvent()
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const drag = () => {
    let dargable = document.getElementById("external-event");
    console.log(dargable);
    new Draggable(dargable, {
      itemSelector: ".fc-event",
      eventData: function (eventEl) {
        let id = eventEl.getAttribute("id")
        let title = eventEl.getAttribute("title")
        let color = eventEl.getAttribute("color")
        return {
          id:id,
          title:title,
          color:color
        }
      }
    })
  };
const handRecieve = (eventInfo) =>{
  console.log(eventInfo);
  let value = {
    id : eventInfo.draggedEl.getAttribute("id"),
    title : eventInfo.draggedEl.getAttribute("title"),
    color : eventInfo.draggedEl.getAttribute("color"),
    start:eventInfo.dateStr,
    end:moment(eventInfo.dateStr).add(+1,"days").format('YYYY-MM-DD')
  }

  createEvent(value)
  .then((res) => {
    loaddata();
  })
  .catch((err) => {
    console.log(err);
  });
  console.log("value",value);
}



  const handleSelect = (info) => {
    showModal();
    console.log(info);
    setValues({
      ...values,
      start: info.startStr,
      end: info.endStr,
    });
  };

  const onchangValues = (e) => {
    console.log(e.target.value);
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    console.log(values);
    createEvent(values)
      .then((res) => {
        setValues({ ...values, title: "" });
        loaddata();
      })
      .catch((err) => {
        console.log(err);
      });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Row>
        <Col span={6}>
          <Card>
            <div id="external-event">
              <ul >
                {department.map((item, index) => 
                  <li
                    className="fc-event"
                    id={item.id}
                    title={item.name}
                    color={item.color}
                    key={index}
                    style={{ backgroundColor: item.color }}
                  >
                    {item.name}
                  </li>
                )}
              </ul>
            </div>
          </Card>
        </Col>
        <Col span={18}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            select={handleSelect}
            drop={handRecieve}
          />
          <Modal
            title="Basic Modal"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <input name="title" value={values.title} onChange={onchangValues} />
            <select onChange={onchangValues} name="color">
              <option key={48} value="">
                {" "}
                --กรุณาเลือกแผนก--
              </option>
              {department.map((item, index) => (
                <option
                  key={index}
                  value={item.color}
                  style={{ backgroundColor: item.color }}
                >
                  {item.name}
                </option>
              ))}
            </select>
          </Modal>
        </Col>
      </Row>
    </>
  );
};

export default index;
