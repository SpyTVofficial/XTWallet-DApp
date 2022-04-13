var login = document.getElementById("login");
var answer = document.getElementById("answer");

function onNetworkChange({networkHost, networkName}) {
    console.log('Network changed', networkName, networkHost)
}

function onAccountChange({accountId, accountPublicKey}) {
    console.log('Account changed', accountId, accountPublicKey)
}

function onPermissionRemoved({origin}) {
    console.log('Permission removed', origin)
}

function onAccountRemoved({accountId}) {
    console.log('Account removed', accountId)
}

let connectionListener = null;


login.addEventListener("click", function() {
    (async () => {
        const ledger = sig$.LedgerClientFactory.createClient({
            nodeHost: 'https://europe3.testnet.signum.network'
        });
        const {networkName, addressPrefix, valueSuffix } = await ledger.network.getNetworkInfo()
        const isTestnet = networkName.endsWith('TESTNET')
        const wallet = new sig$wallets.GenericExtensionWallet();
        const connection = await wallet.connect({
            appName: "Example App",
            networkName
        });

        // you can listen to all these events if you want
        connectionListener = connection.listen({
            onNetworkChanged: onNetworkChange,
            onAccountChanged: onAccountChange,
            onPermissionRemoved: onPermissionRemoved,
            onAccountRemoved: onAccountRemoved,
        });

        const {accountId, currentNodeHost: nodeHost} = connection

        const newDiv = document.createElement("div");
        const newContent = document.createTextNode("You connected successfully");
        newDiv.appendChild(newContent);
        document.body.insertBefore(newDiv, answerAccount);

        const accountIdAnswer = document.createTextNode(`Your accountId: ${accountId} - ${sig$.Address.create(accountId, addressPrefix).getReedSolomonAddress()}`);
        const node = document.createTextNode("Your node host: " + nodeHost + "\n");
        answerAccount.appendChild(accountIdAnswer);
        answerNode.appendChild(node);

        const explorer = document.createElement('a');
        const explorerLink = document.createTextNode("Go to explorer \n");
        explorer.appendChild(explorerLink);
        explorer.href = isTestnet
          ? `https://t-chain.signum.network/address/${accountId}`
          : `https://chain.explorer.signum.network/address/${accountId}`;

        document.body.appendChild(explorer);

        ledger.account.getAccountBalance(accountId).then(balance=>{
              const balUser = sig$util.Amount.fromPlanck(balance.balanceNQT).getSigna();
              const balDiv = document.createElement('div');
              const getBal = document.createTextNode(`\nAccount Balance: ${balUser} ${valueSuffix}`);
              balDiv.appendChild(getBal);
              document.body.insertBefore(balDiv, balanceUser);
          }
        )
    })()
},false);
var logout = document.getElementById("logout");
logout.addEventListener("click", function(){
    connectionListener && connectionListener.unlisten()
    location.reload();
}, false);

