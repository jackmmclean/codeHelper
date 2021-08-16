import React, { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { postTag } from "../../../api/tickets";
import Tag from "../../../components/Tag";

export default function SelectTags({
  tags,
  setTags,
  chosenTags,
  setChosenTags,
  getTags,
}: any) {
  const [newTagName, setNewTagName] = useState("");
  const tagInput = useRef(null);

  function chooseTag(tag: any) {
    setTags(
      tags.filter(
        (notChosenTag: any) =>
          JSON.stringify(tag) !== JSON.stringify(notChosenTag)
      )
    );
    setChosenTags([...chosenTags, tag]);
  }

  function unChooseTag(tag: any) {
    setChosenTags(
      chosenTags.filter(
        (chosenTag: any) => JSON.stringify(tag) !== JSON.stringify(chosenTag)
      )
    );
    setTags([...tags, tag]);
  }

  const handlePostTag = () =>
    postTag(newTagName, (responseBody: any) => {
      console.log(responseBody.message);
      //@ts-ignore
      tagInput.current.value = "";
      getTags(() => chooseTag(responseBody.tag));
      chooseTag(responseBody.tag);
      setNewTagName("");
    });

  return (
    <>
      <div>
        {tags.map((tag: any) => (
          <Tag
            chosen={false}
            onClick={() => chooseTag(tag)}
            name={tag.name}
            key={tag.name}
          />
        ))}
        <Button>
          <Form
            onSubmit={(e) => {
              handlePostTag();
              e.preventDefault();
            }}
          >
            <Form.Group>
              <Form.Control
                type="text"
                ref={tagInput}
                onChange={(e) => setNewTagName(e.target.value)}
                minLength={2}
                maxLength={70}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Button>
      </div>
      <div>
        {chosenTags.map((tag: any) => (
          <Tag
            chosen={true}
            onClick={() => unChooseTag(tag)}
            name={tag.name}
            key={tag.name}
          />
        ))}
      </div>
    </>
  );
}
