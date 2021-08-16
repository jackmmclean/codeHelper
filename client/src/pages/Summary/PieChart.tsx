import React from "react";
import Card from "react-bootstrap/Card";
import ChartistGraph from "react-chartist";

import { FaCircle } from "react-icons/fa";

export default function PieChart({ dataObj, title, subtitle, foot }: any) {
  function getColorClassName(idx: any) {
    const colours = ["text-info", "text-danger", "text-warning"];
    return colours[idx % 3];
  }

  for (let key in dataObj) {
    if (dataObj[key] === 0) {
      delete dataObj[key];
    }
  }

  if (dataObj) {
    return (
      <Card>
        <Card.Header>
          <Card.Title as="h4">{title}</Card.Title>
          <p className="card-category">{subtitle}</p>
        </Card.Header>
        <Card.Body>
          <div className="ct-chart ct-perfect-fourth" id="chartPreferences">
            <ChartistGraph
              data={{
                labels: dataObj && Object.keys(dataObj),
                series: dataObj && Object.values(dataObj),
              }}
              type="Pie"
            />
          </div>
          <div className="legend">
            {Object.keys(dataObj).map((key, idx) => {
              return (
                <span key={idx}>
                  <FaCircle className={getColorClassName(idx)} /> {key}{" "}
                </span>
              );
            })}
          </div>
          <hr></hr>
          <div className="stats">
            <i className="far fa-clock"></i>
            {foot}
          </div>
        </Card.Body>
      </Card>
    );
  } else {
    return null;
  }
}
