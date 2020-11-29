!(() => {
  document.title = "PinkPanther";
  closebtn = document.createElement("div");
  closebtn.id = "closebtn";
  closebtn.innerHTML = "X";

  cclosebtn = document.createElement("div");
  cclosebtn.id = "cclosebtn";
  cclosebtn.innerHTML = "Y";

  tt = document.createElement("input");
  tt.id = "sym-input";
  tt.type = "text";
  tt.placeholder = "Enter Symbol";
  tt.addEventListener("change", (e) => {
    fetchMe(e.target.value);
    e.target.value = "";
  });
  document.body.appendChild(tt);

  ccx = document.createElement("input");
  ccx.id = "cap-input";
  ccx.type = "number";
  ccx.step = 10;
  ccx.placeholder = "Enter Cap";

  ccx.addEventListener("change", (e) => {
    window.maxCap = parseFloat(e.target.value).toFixed(2);
    window.cguy ? fetchMe(window.cguy) : null;
    window.cguy = null;
  });

  document.body.appendChild(ccx);

  closebtn.addEventListener("click", () => {
    document.getElementById("details").innerHTML = "";
  });

  cclosebtn.addEventListener("click", () => {
    document.getElementById("hpc").classList.toggle("hide");
  });

  document.body.appendChild(closebtn);
  document.body.appendChild(cclosebtn);

  window.newPriceOnChange = window.newPriceOnChange
    ? null
    : (newPrice, d) => {
        gx = parseFloat(newPrice) * d.qty - d.eq;
        const g = createDiv("pre-gain", gx);
        const gainRow = createKV(
          "line",
          `Gain @ $${newPrice} : ${parseFloat((gx / d.cap) * 100).toFixed(2)}%`,
          g
        );
        ppod.appendChild(gainRow);
      };

  window.computeMe = window.computeMe
    ? null
    : (x, cap) => {
        axios
          .get(`/api/v1/opti/${x.close.current}/${cap}`)
          .then((x) => x.data)
          .then((d) => {
            xbt = document.createElement("button");
            xbt.id = "x-btn-prvw";
            xbt.addEventListener("click", (d) => {
              d.target.parentNode.parentNode.removeChild(d.target.parentNode);
            });

            ppod = createDiv(`preview-pod-${x.a_ticker}`);
            ppod.classList.add("preview-pod");
            ppod.appendChild(xbt);

            const q = createDiv("pre-qty", d.qty > 0 ? d.qty : -99.99999);
            const c = createDiv("pre-cap", d.cap);
            const e = createDiv("pre-eq", d.eq);
            const l = createDiv("pre-lo", d.lo);
            const r = createDiv("pre-risk", d.risk);
            const s = createDiv("pre-stoploss", d.stoploss);
            const lps = createDiv("pre-lps", d.lps);
            const cp = createDiv("pre-cp", x.close.current);

            const qRow = createKV("line", "Quantity", q);
            const cRow = createKV("line", "Cap", c);
            const eRow = createKV("line", "Equity", e);
            const lRow = createKV("line", "Leftover", l);
            const rRow = createKV("line", "Risk", r);
            const cpRow = createKV("line", "Price", cp);
            const sRow = createKV("line", "StopLoss", s);
            const lpsRow = createKV("line", "LPS", lps);

            newPriceTxt = document.createElement("input");
            newPriceTxt.type = "number";
            newPriceTxt.id = "newPrice";
            newPriceTxt.step = "0.01";
            // newPriceTxt.value = x.close.current;
            newPriceTxt.value = parseFloat(
              x.close.current + x.a_range.median
            ).toFixed(2);

            newPriceTxt.addEventListener("change", (e) => {
              newPriceOnChange(e.target.value, d);
            });

            newPriceOnChange(newPriceTxt.value, d);

            const expPrice = createKV("line", "New Price", newPriceTxt);

            [
              qRow,
              cRow,
              eRow,
              lRow,
              rRow,
              sRow,
              lpsRow,
              cpRow,
              expPrice,
            ].forEach((x) => ppod.appendChild(x));

            document
              .getElementById(`details-box-${x.a_ticker}`)
              .appendChild(ppod);
          })
          .catch(console.error);
      };

  window.addMe = window.addMe
    ? null
    : (x) => {
        const li = document.createElement("button");
        li.id = x;
        li.innerText = x;
        li.addEventListener("click", () => {
          window.cguy = x;
          window.maxCap
            ? fetchMe(x)
            : document.getElementById("cap-input").focus();
        });
        ul.appendChild(li);
      };

  window.printMe = window.printMe
    ? null
    : (x) => {
        l = document.createElement("div");
        l.id = `details-box-${x.a_ticker}`;
        l.classList.add("details-box");
        // l.id = `details-box`;

        xbt = document.createElement("button");
        xbt.id = "x-btn";
        xbt.addEventListener("click", (d) => {
          d.target.parentNode.parentNode.removeChild(d.target.parentNode);
        });

        l.appendChild(xbt);

        xd = [
          `Name : ${x.a_ticker} (${x.a_freq})`,
          `Strength: ${x.a_strength}`,
          `Median Growth : ${x.a_x.median}`,
          `Growth (2 Sigma): ${
            x.a_x.ci.filter((e) => e.sigma === 2)[0].low
          } - ${x.a_x.ci.filter((e) => e.sigma === 2)[0].high}`,
          `Median Range* : $${x.a_range.median} [${parseFloat(
            (x.a_range.median / x.close.current) * 100
          ).toFixed(2)}%]`,
          `Range (2 Sigma): $${
            x.a_range.ci.filter((e) => e.sigma === 2)[0].low
          } - $${x.a_range.ci.filter((e) => e.sigma === 2)[0].high}`,
          `Current Gain : ${parseFloat((x.a_x.current - 1) * 100).toFixed(2)}%`,
          `Current Price : $${x.close.current}`,
          `Regression Value (1D): $${x.a_predict.value}`,
          `Prediction High: $${x.a_predict.high}`,
          `Prediction Low: $${x.a_predict.low}`,
        ];

        l.style.background =
          x.a_curr_dirn === "DOWN" ? "#ff000091" : "#00ff0081";

        xd.forEach((lx) => {
          l.appendChild(splitMe(lx));
        });

        document.getElementById("details").appendChild(l);

        // worksheet
        // prvw = createDiv("preview");
        capTxt = document.createElement("input");
        capTxt.type = "number";
        capTxt.id = "capTxt";
        capTxt.step = "10";
        capTxt.value = window.maxCap;

        capTxt.addEventListener("change", (e) => {
          // for the local guys cap
          computeMe(x, e.target.value);
        });

        //  to compute when rendered for the first time
        computeMe(x, window.maxCap);

        l.appendChild(capTxt);
      };

  window.createDiv = window.createDiv
    ? null
    : (id, v) => {
        const x = document.createElement("div");
        x.id = id;
        v
          ? (x.innerText =
              id === "pre-qty" ? parseInt(v) : `$${parseFloat(v).toFixed(2)}`)
          : null;
        return x;
      };

  window.createKV = window.createKV
    ? null
    : (id, k, v) => {
        const row = createDiv(id);
        const kx = document.createElement("div");
        kx.id = k;
        kx.class = "row-key";
        kx.innerText = k;
        v.class = "row-value";
        [kx, v].forEach((x) => row.appendChild(x));
        return row;
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
        d[0].startsWith("Median") ? v.classList.add("seeMe") : null;
        w.appendChild(k);
        w.appendChild(v);
        return w;
      };

  window.fetchMe = window.fetchMe
    ? null
    : (x1) => {
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

// capTxt.addEventListener("change", (e) => {
//   const cap = e.target.value;
//   e.target.value = "";
//   axios
//     .get(`/api/v1/opti/${x.close.current}/${cap}`)
//     .then((x) => x.data)
//     .then((d) => {
//       xbt = document.createElement("button");
//       xbt.id = "x-btn-prvw";
//       xbt.addEventListener("click", (d) => {
//         d.target.parentNode.parentNode.removeChild(d.target.parentNode);
//       });

//       ppod = createDiv(`preview-pod-${x.a_ticker}`);
//       ppod.classList.add("preview-pod");
//       ppod.appendChild(xbt);

//       const q = createDiv("pre-qty", d.qty > 0 ? d.qty : -99.99999);
//       const c = createDiv("pre-cap", d.cap);
//       const e = createDiv("pre-eq", d.eq);
//       const l = createDiv("pre-lo", d.lo);
//       const r = createDiv("pre-risk", d.risk);
//       const s = createDiv("pre-stoploss", d.stoploss);
//       const lps = createDiv("pre-lps", d.lps);
//       const cp = createDiv("pre-cp", x.close.current);

//       const qRow = createKV("line", "Quantity", q);
//       const cRow = createKV("line", "Cap", c);
//       const eRow = createKV("line", "Equity", e);
//       const lRow = createKV("line", "Leftover", l);
//       const rRow = createKV("line", "Risk", r);
//       const cpRow = createKV("line", "Price", cp);
//       const sRow = createKV("line", "StopLoss", s);
//       const lpsRow = createKV("line", "LPS", lps);
//       newPriceTxt = document.createElement("input");
//       newPriceTxt.type = "number";
//       newPriceTxt.id = "newPrice";
//       newPriceTxt.step = "0.01";
//       newPriceTxt.value = x.close.current;
//       newPriceTxt.addEventListener("change", (e) => {
//         gx = parseFloat(e.target.value) * d.qty - d.eq;
//         const g = createDiv("pre-gain", gx);
//         const gainRow = createKV(
//           "line",
//           `Gain @ $${e.target.value} : ${parseFloat(
//             (gx / d.cap) * 100
//           ).toFixed(2)}%`,
//           g
//         );
//         ppod.appendChild(gainRow);
//       });
//       const expPrice = createKV("line", "New Price", newPriceTxt);

//       [
//         qRow,
//         cRow,
//         eRow,
//         lRow,
//         rRow,
//         cpRow,
//         sRow,
//         lpsRow,
//         expPrice,
//       ].forEach((x) => ppod.appendChild(x));

//       document
//         .getElementById(`details-box-${x.a_ticker}`)
//         .appendChild(ppod);
//     })
//     .catch(console.error);
// });
