import React from "react";
import Card from "react-bootstrap/Card";
import ChartistGraph from "react-chartist";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { FaCircle } from "react-icons/fa";
import FormInput from "../../components/FormInput";

export default function LineGraph({
  select,
  options,
  handleSelectChange,
  tidyDataObj,
  title,
  subtitle,
  foot,
  legendNames,
}: any) {
  function getColorClassName(idx: any) {
    const colours = ["text-info", "text-danger", "text-warning"];
    return colours[idx % 3];
  }

  return (
    <Card>
      <Card.Header>
        <Row>
          {" "}
          <Col md="9">
            <Card.Title as="h4">{title}</Card.Title>
            <p className="card-category">{subtitle}</p>
          </Col>
          <Col md="3">
            {select && (
              <FormInput
                id={"selectLab"}
                as={"select"}
                type={"select"}
                handleChange={handleSelectChange}
                options={options}
              />
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <div className="ct-chart" id="chartHours">
          <ChartistGraph
            data={tidyDataObj && tidyDataObj}
            type="Line"
            options={{
              showArea: false,
              height: "245px",
              axisX: {
                showGrid: false,
              },
              lineSmooth: true,
              showLine: true,
              showPoint: true,
              fullWidth: true,
              chartPadding: {
                right: 50,
              },
            }}
            responsiveOptions={[
              [
                "screen and (max-width: 640px)",
                {
                  axisX: {
                    labelInterpolationFnc: function (value: any) {
                      return value[0];
                    },
                  },
                },
              ],
            ]}
          />
        </div>
      </Card.Body>
      <Card.Footer>
        <div className="legend">
          {legendNames.map((key: any, idx: number) => {
            return (
              <span key={idx}>
                <FaCircle className={getColorClassName(idx)} /> {key}{" "}
              </span>
            );
          })}
        </div>
        <hr></hr>
        <div className="stats">{foot}</div>
      </Card.Footer>
    </Card>
  );
}
