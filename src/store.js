import {action, observable, makeObservable} from 'mobx';

class Store {
    constructor() {
        makeObservable(this)
    }

    valuesArr = [
        {
            value: 'dollars',
            label: 'US Dollar',
            vsCurrency: 'usd'
        },
        {
            value: 'ethereum',
            label: 'Ethereum',
            vsCurrency: 'eth'
        },
        {
            value: 'bitcoin',
            label: 'Bitcoin',
            vsCurrency: 'btc'
        }
    ];

    getVsCurrency(coin) {
        let vsCurrency;
        this.valuesArr.forEach(item => {
            if (item.value === coin) {
                vsCurrency = item.vsCurrency;
            }
        });
        return vsCurrency
    }

    //portfolio page
    @observable transactionFrom = 'ethereum';
    @observable transactionTo = 'dollars';
    @observable transactionCoefficient = 1;
    @observable maxFrom = '';

    @action transaction = (value) => {
        console.log('transaction', value, typeof value);
        let vsCurrency = this.getVsCurrency(this.transactionTo);
        let k = this.coinsData[this.transactionFrom]?.['market_data']['current_price'][vsCurrency];
        this.userCoins.forEach((coin) => {
            if (coin.name.toLowerCase() === this.transactionFrom) {
                if (value > 1) {
                    coin.count = +((coin.count - +value).toFixed(2));
                } else {
                    coin.count = +((coin.count - +value).toPrecision(5));
                }
            }
            if (coin.name.toLowerCase() === this.transactionTo) {
                if (value > 1) {
                    coin.count = +((coin.count + +value * +k).toFixed(2));
                } else {
                    coin.count = +((coin.count + +value * +k).toPrecision(5));
                }
            }
        });
        if (this.transactionTo !== this.transactionFrom) {
            this.maxFrom = this.maxFrom - value;
        }
        this.solveValues();
    };

    @action setTransactionFrom = (coin, to) => {
        this.transactionFrom = coin;
        let vsCurrency = this.getVsCurrency(to || this.transactionTo);
        this.transactionCoefficient = this.coinsData[coin]?.['market_data']['current_price'][vsCurrency];
        console.log('from', coin, this.coinsData[coin]?.['market_data']['current_price'][vsCurrency]);
        this.userCoins.forEach(({name, count}) => {
            if (name.toLowerCase() === coin) {
                this.maxFrom = count;
                console.log('here');
            }
        })
    };

    @action setTransactionTo = (coin) => {
        this.transactionTo = coin;
        let vsCurrency = this.getVsCurrency(coin);
        this.transactionCoefficient = this.coinsData[this.transactionFrom]?.['market_data']['current_price'][vsCurrency];
        console.log('from', coin, this.coinsData[this.transactionFrom]?.['market_data']['current_price'][vsCurrency],
            'to', coin);
    };

    @observable userCoins = [
        {name: 'Bitcoin', count: 1, value: 1},
        {name: 'Dollars', count: 10000, value: 1},
        {name: 'Ethereum', count: 10, value: 1},
    ];

    @observable coinsBase = 'dollars';
    @observable coinsSum = '';

    @action fetchAllCoins = async () => {
        for await (let item of this.valuesArr) {
            let coin = item.value;
            if (!this.coinsData[coin]) {
                try {
                    let response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
                    if (response.ok) {
                        let json = await response.json();
                        this.coinsData[coin] = json;
                        //console.log(coin, 'json', json, 'this.data', json);
                    } else {
                        console.log('error');
                    }
                } catch (e) {
                    alert('Ошибка сети')
                }
            }
        }
        this.setTransactionFrom(this.transactionFrom);
        this.solveValues();
    };

    @action solveValues = () => {
        console.log('solve');
        let sum = 0;
        this.userCoins.forEach((item) => {
            let vsCurrency = this.getVsCurrency(this.coinsBase);
            let coefficient = this.coinsData[item.name.toLowerCase()]?.['market_data']['current_price'][vsCurrency]
            item.value = item.count * coefficient;
            sum += item.value;
        });
        if (sum > 10) {
            this.coinsSum = sum.toFixed(2);
        } else {
            this.coinsSum = sum.toPrecision(5);
        }
    };

    @action setCoinsBase = (coin) => {
        this.coinsBase = coin;
        this.solveValues();
    };

    //converter page
    @observable coinFrom = 'ethereum';
    @observable coinTo = 'dollars';
    @observable coinsCoefficient = 1;
    @observable coinsData = {};

    @action setCoinFrom = (coin) => {
        if (!this.coinsData[coin]) {
            this.fetchCoinsFrom(coin)
        }
        this.coinFrom = coin;
    };

    @action setCoinTo = (coin) => {
        this.coinTo = coin;
        let vsCurrency = this.getVsCurrency(coin);
        let k = this.coinsData[this.coinFrom]?.['market_data']['current_price'][vsCurrency];
        this.coinsCoefficient = k
    };

    @action fetchCoinsFrom = async (coin) => {
        try {
            let response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
            if (response.ok) {
                let json = await response.json();
                this.coinsData[coin] = json;
                let vsCurrency = this.getVsCurrency(this.coinTo);
                let k = this.coinsData[this.coinFrom]?.['market_data']['current_price'][vsCurrency];
                this.coinsCoefficient = k;
                //console.log('json', json, 'this.data', json);
            } else {
                console.log('error');
            }
        } catch (e) {
            console.log(e);
            alert('Ошибка сети');
        }
    };


    @observable chartData = [];
    @observable chartCoin = 'ethereum';
    @observable chartVsCurrency = 'usd';

    @action setChartCoin = (coin) => {
        this.chartCoin = coin;
        this.fetchChartData(coin, this.chartVsCurrency);
    };

    @action setChartVsCurrency = (vsCurrency) => {
        this.chartVsCurrency = vsCurrency;
        this.fetchChartData(this.chartCoin, vsCurrency);
    };

    @action fetchChartData = async (coin, vsCurrency) => {
        try {
            let response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=${vsCurrency}&days=14&interval=daily`)
            if (response.ok) {
                let json = await response.json();
                this.chartData = json.prices;
                //console.log('json', json, 'this.data', this.chartData);
            } else {
                console.log('error');
            }
        } catch (e) {
            console.log(e);
            alert('Ошибка сети')
        }
    }
}

const store = new Store();

export {store};
