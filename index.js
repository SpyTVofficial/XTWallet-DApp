var login = document.getElementById("login");
var answer = document.getElementById("answer");

login.addEventListener("click", function() {
    (async () => {
        const api = sig$.composeApi({
            nodeHost: 'https://europe.signum.network'
        });

        const wallet = new sig$wallets.GenericExtensionWallet();
        const {publicKey, connectionStatus, nodeHost, accountId} = await wallet.connect({
            appName: "Example App",
            nodeHost: "https://europe.signum.network"   
        });

        const newDiv = document.createElement("div");
        const newContent = document.createTextNode("You connected successfully");
        newDiv.appendChild(newContent);
        document.body.insertBefore(newDiv, answerAccount);

        const accountIdAnswer = document.createTextNode("Your accountId: " + accountId + "\n");
        const node = document.createTextNode("Your node host: " + nodeHost + "\n");
        answerAccount.appendChild(accountIdAnswer);
        answerNode.appendChild(node);

        const explorer = document.createElement('a');
        const explorerLink = document.createTextNode("Go to explorer \n");
        explorer.appendChild(explorerLink);
        explorer.href = "https://chain.signum.network/address/" + accountId;
        document.body.appendChild(explorer);

        api.account.getAccountBalance(accountId).then(balance => {
            const balUser = sig$util.Amount.fromPlanck(balance.balanceNQT).toString();
            const balDiv = document.createElement('div');
            const getBal = document.createTextNode("\nAccount Balance: " + balUser);
            balDiv.appendChild(getBal);
            document.body.insertBefore(balDiv, balanceUser);
        })
    })()
},false);
var logout = document.getElementById("logout");
logout.addEventListener("click", function(){
    location.reload();
}, false);
var donate = document.getElementById("donate");
donate.addEventListener("click", function(){
    return sig$util.createDeeplink({
        payload: {
            recipient: "S-DFHC-U26W-H5QH-68Q7C",
            amountPlanck: sig$util.Amount.fromSigna('5.103635').getPlanck(),
            feePlanck: sig$util.Amount.fromSigna('0.0735').getPlanck(),
            message: '59b13cb7d10d5ead3b45b8e9039ebed100000000000000000000000000000000',
            messageIsText: false,
            immutable: false,
            deadline: 1440,
            encrypt: false
        },
        action: 'pay'
    }, );
}, false);