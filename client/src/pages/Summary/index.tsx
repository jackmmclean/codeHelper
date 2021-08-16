import React, { useEffect, useState } from "react";
import {
  turnDatesToOptions,
  turnLabsToOptions,
  turnModulesToOptions,
} from "../../clientUtils";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./summary.css";

import {
  FaTicketAlt,
  FaUserClock,
  FaTimesCircle,
  FaUser,
} from "react-icons/fa";
import FormInput from "../../components/FormInput";
import {
  getAverageResolutionTime,
  getDemonstratorResolutionTimes,
  getDemonstratorTicketCounts,
  getLabActivity,
  getMissedCount,
  getModuleActivity,
  getModuleResolutionTimes,
  getResolutionTimeHistogramData,
  getStudentCount,
  getStudentResolutionTimes,
  getStudentTicketCounts,
  getTicketCount,
  getTicketDates,
} from "../../api/stats";
import SmallCardStat from "./SmallCardStat";
import BarGraph from "./BarGraph";
import PieChart from "./PieChart";
import LineGraph from "./LineGraph";
import { getLabs } from "../../api/labs";
import { getModules } from "../../api/modules";

function SummaryDashboard() {
  const [ticketDates, setTicketDates] = useState([]);
  const [selectedTicketDate, setSelectedTicketDate] = useState("");
  const [selectedTicketDateTo, setSelectedTicketDateTo] = useState<any>(null);

  const [ticketCount, setTicketCount] = useState(null);
  const [studentCount, setStudentCount] = useState(null);
  const [avgResolutionTime, setAvgResolutionTime] = useState(null);
  const [missedCount, setMissedCount] = useState(null);

  const [activityOptions, setActivityOptions] = useState<any>(null);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activity, setActivity] = useState<any>(null);

  const [moduleResolutionTimes, setModuleResolutionTimes] = useState<any>(null);
  const [demonstratorResolutionTimes, setDemonstratorResolutionTimes] =
    useState<any>(null);
  const [studentResolutionTimes, setStudentResolutionTimes] =
    useState<any>(null);

  const [demonstratorTicketCounts, setDemonstratorTicketCounts] =
    useState<any>(null);
  const [studentTicketCounts, setStudentTicketCounts] = useState<any>(null);
  const [resolutionTimeHistogram, setResolutionTimeHistogram] =
    useState<any>(null);

  function handleTicketCount() {
    getTicketCount(
      (res: any) => {
        setTicketCount(res.count);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleStudentCount() {
    getStudentCount(
      (res: any) => {
        setStudentCount(res.count);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleAvgResolutionTime() {
    getAverageResolutionTime(
      (res: any) => {
        setAvgResolutionTime(res.time);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleMissedCount() {
    getMissedCount(
      (res: any) => {
        setMissedCount(res.count);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleModuleResolutionTimes() {
    getModuleResolutionTimes(
      (res: any) => {
        setModuleResolutionTimes(res.times);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleDemonstratorResolutionTimes() {
    getDemonstratorResolutionTimes(
      (res: any) => {
        setDemonstratorResolutionTimes(res.times);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleStudentResolutionTimes() {
    getStudentResolutionTimes(
      (res: any) => {
        setStudentResolutionTimes(res.times);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleDemonstratorTicketCount() {
    getDemonstratorTicketCounts(
      (res: any) => {
        setDemonstratorTicketCounts(res.counts);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleStudentTicketCount() {
    getStudentTicketCounts(
      (res: any) => {
        setStudentTicketCounts(res.counts);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleResolutionTimeHistogram() {
    getResolutionTimeHistogramData(
      (res: any) => {
        setResolutionTimeHistogram(res.times);
      },
      selectedTicketDate,
      selectedTicketDateTo
    );
  }

  function handleActivity() {
    if (selectedActivity.length === 6) {
      getModuleActivity((res: any) => {
        setActivity(res.activity);
      }, selectedActivity);
    } else {
      getLabActivity((res: any) => {
        setActivity(res.activity);
      }, selectedActivity);
    }
  }

  function handleOptionChange(optionValue: string) {
    if (optionValue[0] === "x") {
      setSelectedTicketDate(optionValue.slice(1));
      setSelectedTicketDateTo(new Date().toISOString().slice(0, 10));
    } else {
      setSelectedTicketDate(optionValue);
      setSelectedTicketDateTo(null);
    }
  }

  useEffect(() => {
    getModules(
      (modulesRes: any) => {
        getLabs(
          (labsRes: any) => {
            setSelectedActivity(turnLabsToOptions(labsRes.labs)[0].optionValue);
            setActivityOptions([
              ...turnLabsToOptions(labsRes.labs),
              ...turnModulesToOptions(modulesRes.modules),
            ]);
          },
          (labsErr: any) => console.log(labsErr)
        );
      },
      (modulesErr: any) => console.log(modulesErr)
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    getTicketDates((res: any) => {
      //@ts-ignore
      setTicketDates(turnDatesToOptions(res.dates));
      handleOptionChange(turnDatesToOptions(res.dates)[0].optionValue);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedTicketDate !== "") {
      handleTicketCount();
      handleStudentCount();
      handleAvgResolutionTime();
      handleMissedCount();
      handleModuleResolutionTimes();
      handleDemonstratorResolutionTimes();
      handleStudentResolutionTimes();
      handleDemonstratorTicketCount();
      handleStudentTicketCount();
      handleResolutionTimeHistogram();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTicketDate, selectedTicketDateTo]);

  useEffect(() => {
    if (selectedActivity) {
      handleActivity();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedActivity]);

  return (
    <Container className="summary mt-3" style={{ maxWidth: "1300px" }} fluid>
      <Row>
        <Col md="10"></Col>
        <Col md="2">
          <FormInput
            id={"dateFrom"}
            as={"select"}
            type={"select"}
            handleChange={(option) => handleOptionChange(option)}
            options={ticketDates}
          />
        </Col>
      </Row>

      <Row>
        <Col lg="3" sm="6">
          <SmallCardStat
            icon={<FaTicketAlt className="text-primary" />}
            title={"Number of Tickets"}
            stat={ticketCount}
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
        <Col lg="3" sm="6">
          <SmallCardStat
            icon={<FaUser className="text-primary" />}
            title={"Number of Students"}
            stat={studentCount}
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
        <Col lg="3" sm="6">
          <SmallCardStat
            icon={<FaUserClock className="text-primary" />}
            title={"Average Ticket Resolution Time"}
            stat={avgResolutionTime ? `${avgResolutionTime}m` : "NA"}
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
        <Col lg="3" sm="6">
          <SmallCardStat
            icon={<FaTimesCircle className="text-primary" />}
            title={"Missed Tickets"}
            stat={missedCount}
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
      </Row>
      <Row>
        <Col md="8">
          {activity && (
            <LineGraph
              select={true}
              options={activityOptions}
              handleSelectChange={(opt: any) => setSelectedActivity(opt)}
              tidyDataObj={activity}
              title={"Lab Activity"}
              subtitle={"Lab data for each day that the lab was in session"}
              foot={`For lab with id '${selectedActivity}'`}
              legendNames={["Ticket Count", "Student Count", "Missed Count"]}
            />
          )}
        </Col>
        <Col md="4">
          <PieChart
            dataObj={{
              //@ts-ignore
              Closed: 100 * (ticketCount / (missedCount + ticketCount)),
              //@ts-ignore
              Missed: 100 * (missedCount / (missedCount + ticketCount)),
            }}
            title={"Tickets Missed"}
            subtitle={"Proportion of tickets missed"}
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
      </Row>
      <Row style={{ textAlign: "center" }}>
        <Card.Title as="h3">Average Ticket Resolution Times</Card.Title>
      </Row>
      <Row>
        <Col md="6">
          <BarGraph
            dataObj={moduleResolutionTimes}
            title={"Per Module"}
            subtitle={
              "Average number of minutes until ticket is marked as 'closed'"
            }
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
        <Col md="6">
          <BarGraph
            dataObj={demonstratorResolutionTimes}
            title={"Per Demonstrator"}
            subtitle={
              "Average number of minutes until ticket is marked as 'closed'"
            }
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
      </Row>
      <Row>
        <Col md="6">
          <BarGraph
            dataObj={studentResolutionTimes}
            title={"Per Student"}
            subtitle={
              "Average number of minutes until ticket is marked as 'closed'"
            }
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
      </Row>
      <Row style={{ textAlign: "center" }}>
        <Card.Title as="h3">Total Ticket Counts</Card.Title>
      </Row>
      <Row>
        <Col md="6">
          <BarGraph
            dataObj={studentTicketCounts}
            title={"Per Student"}
            subtitle={"Total count of tickets posted by each student"}
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
        <Col md="6">
          <BarGraph
            dataObj={demonstratorTicketCounts}
            title={"Per Demonstrator"}
            subtitle={
              "Total count of tickets marked as 'closed' by each demonstrator"
            }
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
      </Row>
      <Row>
        <Col md="12">
          <BarGraph
            dataObj={resolutionTimeHistogram}
            title={"Ticket Resolution Length Histogram"}
            subtitle={
              "Counts of successful ticket resolution time (in minutes) range bins"
            }
            foot={`${selectedTicketDate} to ${selectedTicketDateTo}`}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default SummaryDashboard;
