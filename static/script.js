!(() => {
  closebtn = document.createElement("div");
  closebtn.id = "closebtn";
  closebtn.innerHTML = "X";

  tt = document.createElement("input");
  tt.id = "sym-input";
  tt.type = "text";
  tt.placeholder = "Enter Symbol";
  tt.addEventListener("change", (e) => {
    fetchMe(e.target.value);
    e.target.value = "";
  });
  document.body.appendChild(tt);

  closebtn.addEventListener("click", () => {
    document.getElementById("details").innerHTML = "";
  });

  document.body.appendChild(closebtn);

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

        xbt = document.createElement("button");
        xbt.id = "x-btn";
        xbt.addEventListener("click", (d) => {
          // console.log(d.target);
          d.target.parentNode.parentNode.removeChild(d.target.parentNode);
        });
        // xbt.value = "x";
        l.appendChild(xbt);
        xd = [
          `Name : ${x.a_ticker} (${x.a_freq})`,
          `Strength: ${x.a_strength}`,
          `Median Growth : ${x.a_x.median}`,
          `Median Range* : $ ${x.a_range.median}`,
          // `Current Direction : `,
          `Current Gain : ${parseFloat((x.a_x.current - 1) * 100).toFixed(2)}%`,
          `Current Price : $ ${x.close.current}`,
          `Regression Value (1D): $ ${x.a_predict.value}`,
          `Prediction High: $ ${x.a_predict.high}`,
          `Prediction Low: $ ${x.a_predict.low}`,
          `Growth (2 Sigma): ${
            x.a_x.ci.filter((e) => e.sigma === 2)[0].low
          } - ${x.a_x.ci.filter((e) => e.sigma === 2)[0].high}`,
          `Range (2 Sigma): $ ${
            x.a_range.ci.filter((e) => e.sigma === 2)[0].low
          } - $ ${x.a_range.ci.filter((e) => e.sigma === 2)[0].high}`,
        ];
        l.style.background =
          x.a_curr_dirn === "DOWN" ? "#ff000091" : "#00ff0081";
        xd.forEach((lx) => {
          l.appendChild(splitMe(lx));
        });
        document.getElementById("details").appendChild(l);
      };

  window.splitMe = window.splitMe
    ? null
    : (x) => {
        d = x.split(":");
        w = document.createElement("div");
        w.id = "line";
        k = document.createElement("div");
        v = document.createElement("div");
        v.id = "line-value";
        k.innerText = d[0];
        v.innerText = d[1];
        w.appendChild(k);
        w.appendChild(v);
        return w;
      };

  window.fetchMe = window.fetchMe
    ? null
    : (x1) => {
        // console.log(`Fetching - ${x1}`);
        axios
          .get(`/api/v1/data/${x1}`, { timeout: 5000 })
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
    .get("api/v1/list")
    .then((e) => e.data.data)
    .then((x) => {
      x.forEach(addMe);
    })
    .catch((e) => console.error(e));
})();
