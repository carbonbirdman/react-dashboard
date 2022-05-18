//const tidy =
import {
  tidy,
  mutate,
  arrange,
  desc,
  summarize,
  groupBy,
  sum,
  median,
  mean
} from "@tidyjs/tidy";
import axios from "axios";

async function fetch() {
  return new Promise((resolve, reject) => {
    axios
      .get("https://kestrel-triangular.herokuapp.com/hourly_shortlist/json")
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        console.error("error", error);
        reject(error);
      });
  });
}

function toArray(P) {
  const X = Object.entries(P);
  return X;
}

function splitSortProfit(data) {
  let dataA = data.map((x) => ({
    index: x.token0 + "-" + x.token1 + "-" + x.token2,
    value: x.total
  }));
  let dataS = dataA.sort(function (a, b) {
    return a.value - b.value;
  });
  return dataS;
}

function attachProfit(P) {
  let X = P.map((x) => ({
    ...x,
    profit: parseFloat(x.output_dollars) - x.input_dollars
  }));
  return X;
}

async function getArray() {
  let P = await fetch();
  let X = toArray(P.data);
  return X;
}

export async function tokenCount() {
  let P = await fetch();
  let X = toArray(P.data);
  let Y = attachProfit(P.data);
  let T = tidy(
    Y,
    groupBy(
      ["token0", "token1", "token2"],
      [
        summarize({
          total: sum("profit"),
          median: median("profit"),
          mean: mean("profit")
        })
      ]
    )
  );
  let A = T.map((x) => ({
    index: x.token0 + "-" + x.token1 + "-" + x.token2,
    value: x.median
  }));
  A = A.sort(function (a, b) {
    return a.value - b.value;
  });
  //console.log(A.map((a) => a.index));
  return A;
}

async function main() {
  //const arbData = tokenCount();
  let P = await fetch();
  let X = toArray(P.data);
  let Y = attachProfit(P.data);
  let T = tidy(
    Y,
    groupBy(
      ["token0", "token1", "token2"],
      [summarize({ total: sum("profit"), median: median("profit") })]
    )
  );
  let arbData = T;

  let dataA = arbData.map((x) => ({
    ...x,
    index: x.token0 + "-" + x.token1 + "-" + x.token2
  }));
  console.log(dataA);
  //const K = (({ index, total, median }) => ({ index, total, median }))(dataA);
  //console.log(K);
}

//main();
//if (require.main === module) {
//  main();
//}
