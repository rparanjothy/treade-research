!(() => {
  window.addMe = window.addMe
    ? null
    : (x) => {
        // console.log(`Added - ${x}`);
        const li = document.createElement("button");
        li.id = x;
        li.innerText = x;
        // li.onclick = fetchMe(x);
        li.addEventListener("click", () => fetchMe(x));
        ul.appendChild(li);
      };

  window.printMe = window.printMe
    ? null
    : (x) => {
        // console.log(x);
        // document.getElementById("details").innerHTML = "";
        l = document.createElement("div");
        l.id = "details-box";
        xd = [
          `Name : ${x.a_ticker} [${x.a}]`,
          `Median Growth : ${x.a_x.median}`,
          `Current Direction : ${x.a_curr_dirn}`,
          `Current Gain : ${parseFloat((x.a_x.current - 1) * 100).toFixed(2)}%`,
          `Current Price : $ ${x.close.current}`,
          `Prediction High: $ ${x.a_predict.high}`,
          `Prediction Low: $ ${x.a_predict.low}`,
          `Regression Value: $ ${x.a_predict.value}`,
          `Strength: ${x.a_strength}`,
          `Growth (2 Sigma): ${
            x.a_x.ci.filter((e) => e.sigma === 2)[0].low
          } - ${x.a_x.ci.filter((e) => e.sigma === 2)[0].high}`,
          `Freq:  ${x.a_freq}`,
        ];
        xd.forEach((lx) => {
          line = document.createElement("div");
          line.id = "line";
          line.innerText = lx;
          l.appendChild(line);
        });
        // console.log(xd.join("\n"));
        document.getElementById("details").appendChild(l);
      };

  window.fetchMe = window.fetchMe
    ? null
    : (x1) => {
        // console.log(`Fetching - ${x1}`);
        axios
          .get(`http://localhost:5000/api/v1/data/${x1}`, { timeout: 5000 })
          .then((x) => x.data)
          .then((e) => {
            printMe(e);
          });
      };

  ccc = document.getElementById("container");
  ul = document.createElement("div");
  ul.id = "list";
  data = document.createElement("div");
  data.id = "details";
  ccc.appendChild(ul);
  ccc.appendChild(data);

  axios
    .get("http://localhost:5000/api/v1/list")
    .then((e) => e.data.data)
    .then((x) => {
      x.forEach(addMe);
    })
    .then(console.error);
})();
