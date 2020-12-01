!(() => {
  document.title = "PinkPanther-Dash";

  cx = document.createElement("input");
  cx.type = "number";
  cx.id = "cx";
  cx.addEventListener("change", (e) => {
    fetchMe(e.target.value);
    // e.target.value = "";
  });

  document.getElementById("container").appendChild(cx);

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
        loading = createDiv("loading");
        loading.innerText = "Loading";
        loading.classList.add("loading");

        document.body.appendChild(loading);
        document.getElementById("banner").innerHTML = "";
        axios
          .get(`/api/v1/projectedGains/${x1}`)
          .then((e) => e.data.gains)
          .then((x) => {
            // console.log(x);
            loading.classList.toggle("hide");
            x.forEach((x1) => addToBanner(banner, x1));
          })
          .catch((e) => console.error(e));
      };

  window.addToBanner = window.addToBanner
    ? null
    : (banner, x1) => {
        console.log(x1);
        const r = "#ff0000ba";
        const g = "#00ff00ba";
        bpod = createDiv("banner-pod");
        bpodName = createDiv("banner-name");
        bpodName.innerText = x1.name;
        bPodGain = createDiv("banner-gain");
        bPodGain.innerText = `$${x1.gain}`;
        bPodDx = createDiv("banner-dx");
        bPodDx.innerText = `$${x1.dx}`;
        bPodDx.style.fontSize = "10px";
        bpod.style.background = x1.dx < 0 ? r : g;
        [bpodName, bPodGain, bPodDx].forEach((x) => bpod.appendChild(x));
        banner.appendChild(bpod);
      };

  // banner
  banner = createDiv("banner");
  banner.classList.add("banner");
  document.body.appendChild(banner);
})();
