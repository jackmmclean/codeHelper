import React, { useState, useEffect } from "react";
//import { useHistory } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import FormInput from "../../components/FormInput";
import ModalSelectTags from "./ModalSelectTags";
import { postTicket } from "../../api/tickets";
import { getModules } from "../../api/modules";

export default function TicketForm() {
  useEffect(() => {
    getModules(
      (resp: any) => {
        setModuleOptions(resp.modules);
        setModuleCode(resp.modules[0].code);
      },
      (resp: any) => console.log(resp.message)
    );
  }, []);

  const [moduleCode, setModuleCode] = useState<string>("");
  const [practical, setPractical] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [chosenTags, setChosenTags] = useState([]);
  const [moduleOptions, setModuleOptions] = useState<any>(null);

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);

  function handlePostTicket() {
    postTicket(
      moduleCode,
      practical,
      issueDescription,
      chosenTags,
      (responseBody: any) => {
        //console.log(responseBody.message);
      },
      (responseBody: any) => {
        alert(responseBody.message);
      }
    );
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-enter mb-4">Submit a Help Request</h2>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleShow();
            }}
          >
            <FormInput
              id={"moduleCode"}
              name={"Module Code"}
              type={"select"}
              as={"select"}
              handleChange={setModuleCode}
              options={
                moduleOptions &&
                moduleOptions.map((module: any) => {
                  let option: any = {};
                  option["optionText"] = `${module.code} - ${module.name}`;
                  option["optionValue"] = module.code;
                  return option;
                })
              }
            />
            <FormInput
              id={"practical"}
              name={"Practical"}
              type={"text"}
              handleChange={setPractical}
              maxLength={30}
            />
            <FormInput
              id={"issueDescription"}
              name={
                "Describe the problem that you are having. What have you tried so far? What happened when you tried it?"
              }
              type={"textarea"}
              as={"textarea"}
              handleChange={setIssueDescription}
              minLength={50}
              maxLength={2000}
            />
            <Button className="w-100 mt-2" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <ModalSelectTags
        setShowModal={setShowModal}
        showModal={showModal}
        postTicket={handlePostTicket}
        tags={tags}
        setTags={setTags}
        chosenTags={chosenTags}
        setChosenTags={setChosenTags}
      />
    </>
  );
}
