const axios = require('axios');
const fs = require('fs');
const readline = require('readline');

const debank_wallets = []
const checked_wallets = []


async function loop(wallets) {
    for await (const wallet of wallets) {
        if (checked_wallets.includes(wallet)) {
            //console.log('SKIP DOUBLE CHECK')
        } else {
            await axios.get('https://openapi.debank.com/v1/user/total_balance?id=' + wallet)
                .then(response => {
                    const total_usd = Number(response.data["total_usd_value"])
                    if (total_usd > 40) {
                        console.log(total_usd + ' ' + wallet)
                        fs.appendFile('results.txt', total_usd + ' ' + wallet + '\n', function (err) {
                            if (err) throw err;
                        });
                    }
                })
                .catch(error => {});
            checked_wallets.push(wallet)
        }
    }
}


module.exports = async function work() {
    const fileStream = fs.createReadStream("wallets.txt");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        const wallet = line.split([' '])[0];
        debank_wallets.push(String(wallet).toLowerCase())
    }
    const chunkSize = 7500;
    for (let i = 0; i < debank_wallets.length; i += chunkSize) {
        const chunk = debank_wallets.slice(i, i + chunkSize);
        loop(chunk)
    }
}