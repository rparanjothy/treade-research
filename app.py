# Ram Paranjothy - Nov 24 2020

import pandas as pd
import pandas_datareader as r
from datetime import datetime, timedelta
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from functools import reduce
import yfinance
from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np


app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"msg": "PraiseGod"})


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


@app.route("/api/v1/data/<ticker>/<freq>", methods=["GET"])
@app.route("/api/v1/data/<ticker>", methods=["GET"])
def getInsights(ticker, freq="20d"):
    i = yfinance.download(tickers=ticker.upper(), period=freq, interval="1d")
    # TODO: Improve this.. its not fast enuf
    i['growthX'] = (i['Close']/i['Close'].shift(1))
    #  for fit
    i["idx"] = (i.index.shift(1, freq="D")-i.index[0]).days

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
    prediction = predictCloseRange(i, 1, closeStats)

    del(i)

    out = {}
    out['a_freq'] = freq
    out["a_strength"] = round(currStrength, 2)
    out["a_ticker"] = ticker
    out["a_predict"] = prediction
    out['close'] = closeStats
    out['a_x'] = growthStats
    out["a"] = "RED" if growthStats["median"] < .99 else "GREEN"
    out["a_curr_dirn"] = "DOWN" if growthStats["current"] < 1 else "UP"
    return jsonify(out)


if __name__ == "__main__":
    app.run("0.0.0.0", 5000, True)
