import React, { useEffect, useState } from "react";
import { getActivity } from "../../api/users";
import Container from "react-bootstrap/Container";
import ActivityLine from "./ActivityLine";
import { sortByAgeFromString } from "../../clientUtils";

export default function Activity() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    getActivity(
      (res: any) => {
        //console.log(res.message);
        var newActivities = res.activities;
        newActivities.map(
          (activity: any) => (activity.timestamp = new Date(activity.timestamp))
        );
        //@ts-ignore
        setActivities(sortByAgeFromString(newActivities).reverse());
      },
      (err: any) => console.log(err)
    );
  }, []);

  return (
    <Container className="summary mt-4 align-items-center justify-content-center mb-5">
      {activities.map((activity: any) => (
        <ActivityLine key={activity.id} activity={activity} />
      ))}
    </Container>
  );
}
