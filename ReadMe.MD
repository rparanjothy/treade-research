# Features

## API

1. List of Tickers
2. Who all are near the MACD Reversal
3. Who all are just reversed their mean yesterday
4. Who are near bottom
5. In a 30 day window, what was the confidence range for 95%,99%
6. (2* close - High - low) / (high - low) * volume

## UI

1.  Show all tickers; Upon choosing one, show the 95% and 99% range, show how far is it from the low/high
    for available capital, how much units to buy to risk 1.75% cap. (hpc formula)
2.  Sell Flag, Buy Flag? - if current growth factor is < X% then sell; likewise if x factor is >X % then buy buy low sell high, gradient is changing direction, up to down, sell, down to up buy

## Docker

```
docker build -t redcar .
```

## Systemd

```
systemctl start pinkpanther
systemctl enable pinkpanther
```

## Development

```
FLASK_APP=app
FLASK_ENV=development
export FLASK_DEBUG=true
flask run
```
