const fs = require('fs');
const readline = require('readline');
const Web3 = require("web3")

fs.readFile('wallets1.txt', 'utf8', (err, data) => {
    global.remainings = data.split('\n').length
})

global.web3 = new Web3('wss://spring-silent-glitter.quiknode.pro/54b6842c56d511d1efcb300c219aa9758ccc9885/')

async function loop() {
    let counter = 0
    const fileStream = fs.createReadStream("wallets1.txt");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        const wallet = line.split([' '])[0];
        const private_key = line.split([' '])[1];
        await web3.eth.getBalance(wallet)
            .then(response => {
                const view_balance = web3.utils.fromWei(response, 'ether')
                if (view_balance > 0.022) {
                    fs.appendFile('results.txt', view_balance + ' ' + wallet + ' ' + private_key, function (err) {
                        if (err) throw err;
                        console.log(view_balance + ' ' + wallet + ' ' + private_key);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
        counter++
        if (counter % 100 === 0) {
            console.log(Number(remainings) - counter + ' remaining...')
        }
    }
}


loop()