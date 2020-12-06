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

    //portfolio page
    @observable transactionFrom = 'ethereum';
    @observable transactionTo = 'dollars';
    @observable transactionCoefficient = 1;
    @observable maxFrom = '';

    @action transaction = (value) => {
        console.log('transaction', value, typeof value);
        let k = this.transactionCoefficient;
        this.userCoins.forEach((coin) => {
            if (coin.name.toLowerCase() === this.transactionFrom) {
                if (value > 1) {
                    coin.count = +((coin.count - +value).toFixed(2));
                } else {
                    coin.count = +((coin.count - +value).toPrecision(4));
                }
            }
            if (coin.name.toLowerCase() === this.transactionTo) {
                if (value > 1) {
                    coin.count = +((coin.count + +value * +k).toFixed(2));
                } else {
                    coin.count = +((coin.count + +value * +k).toPrecision(4));
                }
            }
        });
        if (this.transactionTo !== this.transactionFrom) {
            this.maxFrom = this.maxFrom - value;
        }
        this.solveValues();
    };

    @action setTransactionFrom = (coin) => {
        this.transactionFrom = coin;
        this.solveTransactionCoefficient(coin, this.transactionTo);
        console.log('from', coin, this.coinsData[coin].usdCost);
        this.userCoins.forEach(({name, count}) => {
            if (name.toLowerCase() === coin) {
                this.maxFrom = count;
                console.log('here');
            }
        })
    };

    @action solveTransactionCoefficient = (from, to) => {
        console.log('from', from, 'to', to, this.coinsData);
        this.transactionCoefficient = this.coinsData[from].usdCost / this.coinsData[to].usdCost
    };

    @action setTransactionTo = (coin) => {
        this.transactionTo = coin;
        this.solveTransactionCoefficient(this.transactionFrom, coin);
        console.log('from', coin);
    };

    @observable userCoins = [
        {name: 'Bitcoin', count: 1, value: 1},
        {name: 'Dollars', count: 10000, value: 1},
        {name: 'Ethereum', count: 10, value: 1},
    ];

    @observable coinsBase = 'dollars';
    @observable coinsSum = '';

    @action fetchAllCoins = async () => {
        for (let item of this.valuesArr) {
            let coin = item.value;
            if (!this.coinsData[coin]) {
                await this.fetchCoin(coin)
            }
        }
        this.setTransactionFrom(this.transactionFrom);
        this.solveValues();
    };

    @action solveValues = () => {
        console.log('solve');
        let sum = 0;
        this.userCoins.forEach((item) => {
            console.log('from', item.name, 'to', this.coinsBase, this.coinsData);
            let coefficient = this.coinsData[item.name.toLowerCase()].usdCost / this.coinsData[this.coinsBase].usdCost;
            item.value = item.count * coefficient;
            sum += item.value;
        });
        if (sum > 10) {
            this.coinsSum = sum.toFixed(2);
        } else {
            this.coinsSum = sum.toPrecision(4);
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

    @action setCoinFrom = async (coin) => {
        if (!this.coinsData[coin]) {
            await this.fetchCoin(coin);
        }
        this.solveCoinsCoefficient(coin, this.coinTo);
        this.coinFrom = coin;
    };

    @action solveCoinsCoefficient = (from, to) => {
        console.log('from', from, 'to', to, this.coinsData);
        this.coinsCoefficient = this.coinsData[from].usdCost / this.coinsData[to].usdCost
    };

    @action setCoinTo = async (coin) => {
        if (!this.coinsData[coin]) {
            await this.fetchCoin(coin);
        }
        this.solveCoinsCoefficient(this.coinFrom, coin);
        this.coinTo = coin;
    };

    @action fetchCoin = async (coin) => {
        if (coin !== 'dollars')
            try {
                let response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}`);
                if (response.ok) {
                    let json = await response.json();
                    console.log(json['market_data']['current_price'].usd);
                    let s = {usdCost: json['market_data']['current_price'].usd, ...json};
                    this.coinsData[coin] = s;
                    console.log('json', s);
                } else {
                    console.log('error');
                }
            } catch (e) {
                console.log(e);
                alert('Ошибка сети');
            }
        else {
            this.coinsData[coin] = {usdCost: 1, name: 'Dollars'}
        }
    };

    @action fetchCoins = async (from, to) => {
        await this.fetchCoin(from);
        await this.fetchCoin(to);
        this.solveCoinsCoefficient(from, to);
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
            let usdArr;
            if (coin === 'dollars') {
                let response = await fetch(`https://api.coingecko.com/api/v3/coins/${coin}/market_chart?vs_currency=usd&days=14&interval=daily`)
                if (response.ok) {
                    let json = await response.json();
                    usdArr = json.prices;
                    console.log('json', json,);
                } else {
                    console.log('error');
                }
            }
            if (response.ok) {
                let json = await response.json();
                if (coin === 'dollars') {
                    console.log('here');
                    json.prices = json.prices.map((item, index) => {
                        return [item[0], item[1] / usdArr[index][1]]
                    })
                }
                this.chartData = json.prices;
                console.log('json', json, 'this.data', this.chartData);
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
