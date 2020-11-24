import pandas as pd
import pandas_datareader as r
from datetime import datetime, timedelta
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from functools import reduce
import yfinance
from flask import Flask, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


@app.route("/api/v1/data/<ticker>/<freq>", methods=["GET"])
@app.route("/api/v1/data/<ticker>", methods=["GET"])
def getInsights(ticker, freq="20d"):
    i = yfinance.download(tickers=ticker.upper(), period=freq, interval="1d")
    # TODO: Improve this.. its not fast enuf
    i['delta'] = i['Close']-i['Close'].shift(1)
    i['R'] = i['High']-i['Low']
    i['pctChange'] = i['Close'].pct_change(1)
    i['pctChangeCum'] = i['pctChange'].cumsum()
    i['growthX'] = (i['Close']/i['Close'].shift(1))
    x = i['growthX']
    mn, mx, s, mu, me = x.min(), x.max(), x.std(), x.mean(), x.median()
    pMin, pMax = i['Close'].min(), i['Close'].max()
    i['strength'] = (i['Close']-pMin) / \
        (pMax-pMin)
    currStrength = i['strength'][-1]
    currPrice = i['Close'][-1]
    o = [{k: v for k, v in zip(
        ("sigma", "low", "high"), (a, mu-(a*s), mu+(a*s)))} for a in range(1, 4)]
    out = {}
    out['freq'] = freq
    out["strength"] = round(currStrength, 2)
    out['x'] = sorted(o, reverse=True, key=lambda x: x.get('sigma'))
    out["ticker"] = ticker
    out['stats'] = {"mean": mu, "median": me}
    out["price"] = {"current": currPrice, "low": pMin, "high": pMax}
    out["a"] = "RED" if me < 1 else "GREEN"
    del(i)
    return jsonify(out)


if __name__ == "__main__":
    app.run("0.0.0.0", 5000)
