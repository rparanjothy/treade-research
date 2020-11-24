!(() => {
  console.log("ada");
  ["AMD", "X", "INTL"].forEach((e) => {
    sleep(1000);
    axios
      .get(`http://localhost:5000/api/v1/data/${e}`, { timeout: 5000 })
      .then((x) => x.data)
      .then((e) => {
        aa(e);
      })

      .catch(console.err);
  });
})();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const aa = (x) => {
  var c = document.getElementById("container");
  dd = document.createElement("div");
  dd.innerText = `\n${x.ticker}  -  ${x.a} - \n$${parseFloat(
    x.price.current
  ).toFixed(2)} - $${parseFloat(x.price.high).toFixed(2)} - $${parseFloat(
    x.price.low
  ).toFixed(2)} | Median: ${parseFloat(x.stats.median).toFixed(
    4
  )} | Mean: ${parseFloat(x.stats.mean).toFixed(4)} | 3rd Sigma : ${x.x
    .filter((e) => e.sigma === 3)
    .map(
      (e) =>
        `${parseFloat(e.low).toFixed(4)} to ${parseFloat(e.high).toFixed(4)}`
    )}`;
  c.appendChild(dd);
};
