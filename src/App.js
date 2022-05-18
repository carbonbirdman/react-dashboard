import "./styles.css";
import * as React from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import { tokenCount } from "./arbData.js";
let dataurl = "https://kestrel-triangular.herokuapp.com/hourly_shortlist/json";

async function getRoute(aurl) {
  //console.log(url);
  let response = await axios.get(aurl);
  return response;
}

const DisplayRoutes = ({ url }) => {
  const [responseData, setResponseData] = React.useState("none");
  const [inputUrl, setInputUrl] = React.useState(url);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  React.useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        console.log(inputUrl);
        let response = await tokenCount();
        console.log(response);
        setResponseData(response);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
      console.log("response", responseData);
      //console.log(responseData.)
    };

    fetchData();
  }, [inputUrl]);
  return (
    <div>
      <br />I tried to consume this URL: {inputUrl}
      <br />
      {responseData === "none" ? (
        <p> Loading ... </p>
      ) : (
        <div>
          {" "}
          <p>And this happened: {typeof responseData}</p>
          <Plot
            data={[
              {
                x: responseData.map((a) => a.index),
                y: responseData.map((a) => a.value),
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "red" }
              },
              {
                type: "bar",
                x: responseData.map((a) => a.index),
                y: responseData.map((a) => a.value)
              }
            ]}
            layout={{}}
            config={{
              responsive: true
            }}
          />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <div className="App">
      <DisplayRoutes url={dataurl} />
    </div>
  );
}
