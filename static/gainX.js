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
        [banner1, banner2, banner3].forEach((e) => (e.innerHTML = ""));

        loading = createDiv("loading");
        loading.innerText = "Loading";
        loading.classList.add("loading");

        document.body.appendChild(loading);
        document.getElementById("banner").innerHTML = "";
        axios
          .get(`/api/v1/watermark/${wl}`)
          .then((e) => e.data.data)
          .then((e) =>
            e.map((x) => {
              const xs = parseFloat(x.strength);
              if (xs <= 0.275) {
                x.box = 1;
              } else if (0.275 < xs && xs < 0.725) {
                x.box = 2;
              } else {
                x.box = 3;
              }
              return x;
            })
          )
          .then((x) => {
            // console.log(x);
            loading.classList.toggle("hide");
            x.sort((a, b) => (a.strength > b.strength ? 1 : -1)).forEach(
              (x1) => {
                switch (x1.box) {
                  case 1:
                    addToBanner(banner1, x1);
                    break;
                  case 2:
                    addToBanner(banner2, x1);
                    break;
                  case 3:
                    addToBanner(banner3, x1);
                    break;
                }
              }
            );
          })
          .catch((e) => console.error(e));
      };

  window.addToggler = window.addToggler
    ? null
    : (lbl) => {
        toggler = createDiv("toggler");
        toggler.innerText = lbl;

        toggler.addEventListener("click", () => {
          wl = lbl;
          fetchMe();
        });
        return toggler;
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

  // banner1
  banner1 = createDiv("banner");
  banner1.classList.add("banner");
  document.body.appendChild(banner1);

  // banner2
  banner2 = createDiv("banner");
  banner2.classList.add("banner");
  document.body.appendChild(banner2);

  // banner3
  banner3 = createDiv("banner");
  banner3.classList.add("banner");
  document.body.appendChild(banner3);

  wl = "pb";

  fetchMe();

  toggler = createDiv("toggler");
  toggler.innerText = "pb";

  // toggler.addEventListener("click", () => {
  //   wl = wl === "all" ? "pb" : "all";
  //   // console.log(wl);
  //   toggler.innerText = wl;
  //   fetchMe();
  // });

  btnbar = createDiv("btnbar");

  pb = addToggler("pb");
  chase = addToggler("chase");
  lt = addToggler("all");

  document.body.appendChild(btnbar);

  [pb, chase, lt].forEach((e) => btnbar.appendChild(e));
})();
