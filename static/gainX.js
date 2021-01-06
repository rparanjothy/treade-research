!(() => {
  document.title = "PinkPanther-GainX";

  // cx = document.createElement("input");
  // cx.type = "number";
  // cx.id = "cx";
  // cx.addEventListener("change", (e) => {
  //   // fetchMe(e.target.value);
  //   // e.target.value = "";
  // });

  // document.getElementById("container").appendChild(cx);

  window.printMe = window.printMe ? null : (x) => {};

  window.createDiv = window.createDiv
    ? null
    : (id, v) => {
        const x = document.createElement("div");
        x.id = id;
        v
          ? (x.innerText =
              id === "pre-qty" ? parseInt(v) : `$${parseFloat(v).toFixed(2)}`)
          : null;
        id.startsWith("pre-risk") ? x.classList.add("seeMe") : null;
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
        console.log("sddd");
        loading = createDiv("loading");
        loading.innerText = "Loading";
        loading.classList.add("loading");

        document.body.appendChild(loading);
        document.getElementById("banner").innerHTML = "";
        axios
          .get(`/api/v1/watermark`)
          .then((e) => e.data.data)
          .then((x) => {
            // console.log(x);
            loading.classList.toggle("hide");
            x.sort((a, b) => (a.a_s < b.a_s ? 1 : -1)).forEach((x1) =>
              addToBanner(banner, x1)
            );
          })
          .catch((e) => console.error(e));
      };

  window.addToBanner = window.addToBanner
    ? null
    : (banner, x1) => {
        // console.log(x1);
        const r = "#ff0000ba";
        const g = "#00ff00ba";
        bpod = createDiv("banner-pod");
        bpodName = createDiv("banner-name");
        bpodName.innerText = x1.name;
        bPodGain = createDiv("banner-gain");
        bPodGain.innerText = `${x1.strength}`;

        bPodMn = createDiv("banner-Mn");
        bPodMn.innerText = `$${x1.min}`;
        bPodMn.style.fontSize = "11px";

        bPodC = createDiv("banner-C");
        bPodC.innerText = `$${x1.price}`;
        bPodC.style.fontSize = "11px";

        bPodMx = createDiv("banner-Mx");
        bPodMx.innerText = `$${x1.max}`;
        bPodMx.style.fontSize = "11px";

        vbar = createDiv("v-bar");
        [bPodMn, bPodC, bPodMx].forEach((x) => vbar.appendChild(x));

        vbarSR = createDiv("v-bar-sr");
        bPodR = createDiv("banner-R");
        bPodR.innerText = `R: ${x1.a_r}`;
        bPodR.style.fontSize = "11px";

        bPodS = createDiv("banner-S");
        bPodS.innerText = `S: ${x1.a_s}`;
        bPodS.style.fontSize = "11px";

        [bPodMn, bPodC, bPodMx].forEach((x) => vbar.appendChild(x));
        [bPodS, bPodR].forEach((x) => vbarSR.appendChild(x));

        [bpodName, bPodGain, vbar, vbarSR].forEach((x) => bpod.appendChild(x));
        banner.appendChild(bpod);
      };

  // banner
  banner = createDiv("banner");
  banner.classList.add("banner");
  document.body.appendChild(banner);

  fetchMe();
})();
