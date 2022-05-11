const check_debank = require('./check_debank')
const axios = require('axios');
const fs = require('fs');
const readline = require('readline');


const wallets = []
const checked_wallets = []
const enable_check = true


async function check_final() {
    const fileStream = fs.createReadStream("results.txt");
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    for await (const line of rl) {
        const wallet = line.split([' '])[1];
        wallets.push(String(wallet).toLowerCase())
    }
    for await (const wallet of wallets) {
        if (checked_wallets.includes(wallet)) {
            //console.log('SKIP DOUBLE CHECK')
        } else {
            await axios.get('https://openapi.debank.com/v1/user/total_balance?id=' + wallet)
                .then(response => {
                    const total_usd = Number(response.data["total_usd_value"])
                    console.log(total_usd)
                    checked_wallets.push(wallet)
                })
                .catch(error =>{})
        }

    }
}


async function main() {
    console.log('       MyMoneyStraight MMS Checker by vL')
    await check_debank()
    //while (enable_check) {
    //    await check_final()
    //}
}


main()