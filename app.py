# Ram Paranjothy - Nov 24 2020

import pandas as pd
import pandas_datareader as r
from datetime import datetime, timedelta
import yfinance
from flask import Flask, jsonify, render_template, url_for
from flask_cors import CORS
import numpy as np
# import concurrent.futures
import time
import requests
import urllib.parse
import json

app = Flask(__name__)
CORS(app)


# def getPrice(x):
#     time.sleep(2)
#     o = {}
#     print("received", x)
#     res = requests.get(urllib.parse.urljoin(
#         "http://localhost:5000", url_for("data", ticker=x)))
#     j = res.json()
#     o['ticker'] = x
#     o['gain'] = j['a_range']['median']
#     print(o)
#     return o
def optiGains(p, cap):
    px, capx = tuple(map(float, (p, cap)))
    tolerance = .0175
    lps = .04
    risk = float(capx)*tolerance
    qty = int(risk/(float(px)*lps))
    return qty


def xoo(n, l, v):
    # print(n)
    list(filter(lambda x: x['name'] == n.split(
        "-")[0], l))[0].update({"dx": v})


@app.route("/api/v1/projectedGains/<cap>", methods=["GET"])
def showGains(cap):
    res = requests.get(urllib.parse.urljoin(
        "http://localhost:5000", url_for("list")))
    j = res.json()
    lticks = j['data']
    i = yfinance.download(tickers=lticks, period="20d", interval="1d")
    gains = (i['High']-i['Low'])
    delta = i['Close']-i['Close'].shift(1)
    price = i['Close']
    for i in gains.columns:
        gains[f"{i}-QTY"] = optiGains(price[f"{i}"][-1], float(cap))
        gains[f"{i}-MED"] = gains[f"{i}"].median()
        gains[f"{i}-GAIN"] = gains[f"{i}-QTY"]*gains[f"{i}-MED"]
        gains[f"{i}-DX"] = round(delta[f"{i}"], 3)
    xo = gains.last("1d")
    xx = pd.DataFrame()
    for c in [xc for xc in xo.columns if xc in lticks]:
        xx[f"{c}"] = round(xo[f"{c}-QTY"]*xo[f"{c}-MED"], 4)
    jsonString = xx.to_json(orient="records")
    xout = json.loads(jsonString)

    # add direction This is brainbending
    dx = gains.last("1d")[[x for x in gains.columns if x.endswith("-DX")]]
    dxl = json.loads(dx.to_json(orient="records"))
    dxj = dxl[0]
    xoutx = [{"name": k, "gain": v} for k, v in xout[0].items()]
    [xoo(k, xoutx, v) for k, v in dxj.items()]

    ccc = sorted(xoutx,
                 key=lambda x: x['gain'], reverse=True)

    # print(ccc)
    return jsonify({"gains": ccc})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"msg": "PraiseGod"})


@app.route("/gain", methods=["GET"])
def gain():
    return render_template("gain.html")


@app.route("/app", methods=["GET"])
def main():
    return render_template("index.html")


def predictCloseRange(i, d, s):
    std = s['std']
    fx = np.polyfit(i['idx'], i["Close"], 1)
    ff = np.poly1d(fx)
    regValue = round(ff(i['idx'][-1]+d), 3)
    oxReg = {k: v for k, v in zip(
        ("value", "sigma", "low", "high"), map(lambda x: round(x, 3), (regValue, 1, regValue-(1*std), regValue+(1*std))))}
    return oxReg


def getStats(i, x):
    h = i[x]
    std, mu, me, high, low, curr = tuple(
        map(lambda x: round(x, 4), (h.std(), h.mean(), h.median(), h.max(), h.min(), h[-1])))
    xStats = {k: v for k, v in zip(
        ("std", "mean", "median", "high", "low", "current"), (std, mu, me, high, low, curr))}
    ox = [{k: v for k, v in zip(
        ("sigma", "low", "high"), map(lambda x: round(x, 3), (a, mu-(a*std), mu+(a*std))))} for a in range(1, 3)]

    xStats['ci'] = sorted(ox, reverse=True, key=lambda x: x["sigma"])

    return xStats


@app.route("/api/v1/list", methods=["GET"], endpoint="list")
def lister():
    x = [
        "MRNA",
        "COCP",
        "APPS",
        "APHA",
        "WIFI",
        "ROKU",
        "AMD",
        "XLNX",
        "SHOP",
        "CRUS",
        "IRM",
        "FIZZ",
        "GNMK",
        "UNG",
        "QCOM",
        "AAPL",
        "MSCI",
        "KR",
        "AZO",
        "SHW",
        "K",
        "ZM",
        "TXN",
        "PAAS",
        "NOW",
        "IBB",
        "LSI",
        "MCHP",
        "WING",
        "NEWR",
        "COST",
        "WMT",
        "CSCO",
        "MRK",
        "DIS",
        "ABT",
        "TQQQ",
        "HD",
        "JNJ",
        "SILV",
        "DOCU",
        "NET",
        "ON",
        "KHC",
        "ADBE",
        "STM",
        "ZNGA",
        "ENR",
        "PAYC",
        "SLV",
        "IDEX",
        "WM",
        "CLX",
        "ORCL",
        "SRVR",
        "F",
        "ORLY",
        "TWTR",
        "PM",
        "MU",
        "PINC",
        "TPB",
        "PEP",
        "FB",
        "SPY",
        "MUSA",
        "MSFT",
        "FCX",
        "CLDR",
        "CMG",
        "SBUX",
        "D",
        "WYNN",
        "SQ",
        "VTI",
        "JO",
        "LRCX",
        "KLAC",
        "CAT",
        "AMZN",
        "BKNG",
        "BIG",
        "KO",
        "MO",
        "PFGC",
        "SWK",
        "KMB",
        "HOG",
        "HPQ",
        "NHI",
        "TSM",
        "GD",
        "LMT",
        "ROST",
        "ODP",
        "ED",
        "PRAA",
        "WLL",
        "BLK",
        "MMM",
        "X",
        "TWOU",
        "WBA",
        "BUD",
        "EURN",
        "BA",
        "JPM",
        "PRPL",
        "LUV",
        "CMCSA",
        "NVR",
        "JWN",
        "TSLA",
        "RCL",
        "NCLH",
        "KSS",
        "TCEHY",
        "LL",
        "WFC",
        "NAT",
        "AMC",
        "CVX",
        "XOM",
        "FRO",
        "AAL",
        "M",
        "NIO",
        "MRO",
        "OSG",
        "CCL",
        "ORN",
        "SOLO",
        "BLNK",
        "DPW",
        "RIG",
        "AYRO",
        "JFIN",
        "GP",
        "NBAC",
        "KNDI",

    ]
    return jsonify({"data": sorted(x)})


@app.route("/api/v1/data/<ticker>/<freq>", methods=["GET"])
@app.route("/api/v1/data/<ticker>", methods=["GET"], endpoint="data")
def getInsights(ticker, freq="20d"):
    i = yfinance.download(tickers=ticker.upper(), period=freq, interval="1d")
    # TODO: Improve this.. its not fast enuf
    i['growthX'] = (i['Close']/i['Close'].shift(1))
    #  for fit
    i["idx"] = (i.index.shift(1, freq="D")-i.index[0]).days
    i["range"] = i['High']-i['Low']

    # Strength Computation
    pMin, pMax = tuple(
        map(
            lambda x: round(x, 4),
            (i['Close'].min(
            ), i['Close'].max())
        )
    )

    i['strength'] = (i['Close']-pMin) / (pMax-pMin)

    currStrength = round((i['strength'][-1]), 3)

    # highStats = getStats(i, "High")
    # lowStats = getStats(i, "Low")
    closeStats = getStats(i, "Close")
    growthStats = getStats(i, "growthX")
    rangeStats = getStats(i, "range")

    prediction = predictCloseRange(i, 1, closeStats)

    del(i)

    out = {}
    out['a_freq'] = freq
    out["a_strength"] = round(currStrength, 2)
    out["a_ticker"] = ticker
    out["a_predict"] = prediction
    out["a_range"] = rangeStats
    out['close'] = closeStats
    out['a_x'] = growthStats
    out["a"] = "RED" if growthStats["median"] < .99 else "GREEN"
    out["a_curr_dirn"] = "DOWN" if growthStats["current"] < 1 else "UP"
    return jsonify(out)


@app.route("/api/v1/opti/<p>/<cap>", methods=['GET'], endpoint="opti")
def opti(p, cap):
    px, capx = tuple(map(float, (p, cap)))
    tolerance = .0175
    lps = .04
    lps_amt = lps*px
    stoploss = round(px*(1-lps), 2)
    risk = float(capx)*tolerance
    qty = int(risk/(float(px)*lps))
    eq = qty*px
    lo = capx-eq
    return jsonify({"eq": eq, "lo": lo, "risk": risk, "lps": lps_amt, "riskpct": tolerance, 'qty': qty, "stoploss": stoploss, "price": px, "cap": capx})


if __name__ == "__main__":
    app.run("0.0.0.0", 5000)
