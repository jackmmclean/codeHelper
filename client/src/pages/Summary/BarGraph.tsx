import React from "react";
import Card from "react-bootstrap/Card";
import ChartistGraph from "react-chartist";

export default function BarGraph({ dataObj, title, subtitle, foot }: any) {
  return (
    <Card>
      <Card.Header>
        <Card.Title as="h4">{title}</Card.Title>
        <p className="card-category">{subtitle}</p>
      </Card.Header>
      <Card.Body>
        <div className="ct-chart" id="chartActivity">
          <ChartistGraph
            data={{
              labels: dataObj && Object.keys(dataObj),
              series: dataObj && [Object.values(dataObj)],
            }}
            type="Bar"
            options={{
              seriesBarDistance: 10,
              axisX: {
                showGrid: false,
              },
              height: "245px",
            }}
            responsiveOptions={[
              [
                "screen and (max-width: 640px)",
                {
                  seriesBarDistance: 5,
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
        <hr></hr>
        <div className="stats">{foot}</div>
      </Card.Footer>
    </Card>
  );
}
