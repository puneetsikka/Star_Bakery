import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { FETCHLISTORDERS } from "../action";
import Chart from "chart.js/auto";
import { DateRangePicker } from "rsuite";
function BarChart() {
  const dispatch = useDispatch();
  const [chart1keys, setChart1keys] = useState([]);
  const [chart1Values, setChart1Values] = useState([]);
  const [chart2keys, setChart2keys] = useState([]);
  const [chart2Values, setChart2Values] = useState([]);
  const [chart3keys, setChart3keys] = useState([]);
  async function getStats() {
    const fetch = require("node-fetch");
    var url = `http://localhost:5000/api/list`;
    await fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setChart1keys(Object.keys(json.OrderStatesObject));
        setChart1Values(Object.values(json.OrderStatesObject));
        setChart2keys(Object.keys(json.itemTypesObject));
        setChart2Values(Object.values(json.itemTypesObject));
        setChart3keys(Object.values(json.top_5));
        dispatch(FETCHLISTORDERS(json));
      })
      .catch((err) => console.error("error:" + err));
  }
  async function getStatsFilter(value) {
    const fetch = require("node-fetch");
    var url = `http://localhost:5000/api/list`;
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    })
      .then((res) => res.json())
      .then((json) => {
        setChart1keys(Object.keys(json.OrderStatesObject));
        setChart1Values(Object.values(json.OrderStatesObject));
        setChart2keys(Object.keys(json.itemTypesObject));
        setChart2Values(Object.values(json.itemTypesObject));
        setChart3keys(Object.values(json.top_5));
        dispatch(FETCHLISTORDERS(json));
      })
      .catch((err) => console.error("error:" + err));
  }

  async function getCharts() {
    new Chart(document.getElementById("acquisitions"), {
      type: "bar",
      data: {
        labels: chart1keys,
        datasets: [
          {
            label: "Order by state",
            data: chart1Values,
            backgroundColor: [
              "rgba(75, 192, 192,0.8)",
              "rgba(255, 99, 13,0.8)",
              "rgba(54, 162, 235,0.8)",
              "rgba(255, 206, 86,0.8)",
            ],
          },
        ],
      },
    });
    new Chart(document.getElementById("item_type"), {
      type: "bar",
      data: {
        labels: chart2keys,
        datasets: [
          {
            label: "Item type",
            data: chart2Values,
            backgroundColor: [
              "rgba(255, 99, 13,0.8)",
              "rgba(54, 162, 235,0.8)",
              "rgba(255, 206, 86,0.8)",
            ],
          },
        ],
      },
    });
    new Chart(document.getElementById("top-5"), {
      type: "bar",
      data: {
        labels: chart3keys.map((row) => row._id),
        datasets: [
          {
            label: "Top 5 Branchs",
            data: chart3keys.map((row) => row.count),
            backgroundColor: [
              "rgba(54, 162, 235,0.8)",
              "rgba(255, 99, 13,0.8)",
              "rgba(255, 206, 86,0.8)",
            ],
          },
        ],
      },
    });
  }
  useEffect(() => {
    getStats();
  }, []);

  useEffect(() => {
    let chartStatus = Chart.getChart("acquisitions");
    if (chartStatus !== undefined) {
      chartStatus.destroy();
    }
    let chartStatus1 = Chart.getChart("item_type");
    if (chartStatus1 !== undefined) {
      chartStatus1.destroy();
    }
    let chartStatus2 = Chart.getChart("top-5");
    if (chartStatus2 !== undefined) {
      chartStatus2.destroy();
    }
    getCharts();
  });
  const handleOkay = (value) => {
    getStatsFilter(value);
  };
  return (
    <>
      <div
        style={{
          display: "flex",
          "flex-direction": "column",
          "justify-content": "center",
          "align-items": "center",
        }}
      >
        <p style={{'fontWeight':'bold'}}>Date Range Filter</p>
        <DateRangePicker onOk={handleOkay} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "40%", marginLeft: "5rem" }}>
          <canvas id="acquisitions"></canvas>
        </div>
        <div style={{ width: "40%", marginRight: "5rem" }}>
          <canvas id="item_type"></canvas>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "40%", marginLeft: "5rem" }}>
          <canvas id="top-5"></canvas>
        </div>
      </div>
    </>
  );
}
export default BarChart;
