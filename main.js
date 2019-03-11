const canvas = require('canvas-api-wrapper');
// let domain = 1; //everything
let domain = 48; //campus
// let domain = 5; //online
// let domain = 24; //pathway

function myMap(account) {
    return {
        id: account.id,
        name: account.name,
        parentAccountId: account.parent_account_id
    }
}

(async function runMe() {
    async function getAllAccounts(account) {
        let subAccounts = await canvas.get(`/api/v1/accounts/${account.id}/sub_accounts`);
        if (subAccounts.length > 0) {
            account.subAccounts = subAccounts.map(myMap);
            for (let i = 0; i < subAccounts.length; i++) {
                await getAllAccounts(account.subAccounts[i]);
            }
        }
    }

    let start = await canvas.get(`/api/v1/accounts/${domain}`);
    start = myMap(start);
    await getAllAccounts(start);
    console.log(JSON.stringify(start));
}())