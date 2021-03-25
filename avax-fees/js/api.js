const getTokensWallet = async (address) => {
    return await fetch(`https://api.covalenthq.com/v1/43114/address/${address}/balances_v2/`)
        .then(res => res.json())
        .catch(err => {
            console.log('error:', err)
            return {}
        });
}

const getTransactions = async (address) => {
    return await fetch(`https://api.covalenthq.com/v1/43114/address/${address}/transactions_v2/?page-number=0&page-size=999999999`)
        .then(res => res.json())
        .catch(err => null);
}

const getTokenPrice = async (tokenId) => {
    const price = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd')
        .then(res => res.json())
        .catch(err => null)
    return price[tokenId] ? price[tokenId].usd : 0
}

getARC20Tokens = async () => {
    return await fetch('https://api.covalenthq.com/v1/43114/tokens/tokenlists/all/?page-size=9999999')
        .then(res => res.json())
        .catch(err => null)
}
