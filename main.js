const canvas = require('canvas-api-wrapper');
let domain = 1; //everything
// let domain = 48; //campus
// let domain = 5; //online
// let domain = 24; //pathway

// only return the info we care about instead of the entire account objects
function myMap(account) {
    return {
        id: account.id,
        name: account.name,
        parentAccountId: account.parent_account_id
    }
}

// setup the recursion to get all the nested accounts
(async function runMe() {
    // a recursive function to get all of the nested accounts
    async function getAllAccounts(account) {
        let subAccounts = await canvas.get(`/api/v1/accounts/${account.id}/sub_accounts`);
        // if there are subaccounts in the just-fetched account, then recurse again throught its subaccounts
        if (subAccounts.length > 0) {
            // send the accounts through the myMap function to only save the data we care about
            account.subAccounts = subAccounts.map(myMap);
            // for each of the subaccounts, recurse through them checking if they have subaccounts as well
            for (let i = 0; i < subAccounts.length; i++) {
                await getAllAccounts(account.subAccounts[i]);
            }
        }
    }

    // first iteration, get the top level account you care about
    // 'start' will be passed by reference for the remainder of this module
    let start = await canvas.get(`/api/v1/accounts/${domain}`);
    // only keep the data you care about
    start = myMap(start);
    // start the recursive search
    await getAllAccounts(start);
    console.log(JSON.stringify(start));
}())
