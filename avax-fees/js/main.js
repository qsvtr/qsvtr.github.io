const getUrlVars = () => {
    const search = location.search.substring(1);
    return search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
}

/* http://www.4codev.com/javascript/download-save-json-content-to-local-file-in-javascript-idpx473668115863369846.html */
const download = (content, fileName, contentType) => {
    const a = document.createElement("a");
    const file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

const onDownload = async () => {
    const address = $("#address").text()
    if (address) {
        const transactions = await getTransactions(address)
        download(JSON.stringify(transactions), "transactions.json", "text/plain");
    } else {
        $("#download").append('<br><span class="nes-text is-error">Oops an error has occurred :/</span>')

    }
}

const onClickMenu = (buttonID) => {
    console.log(buttonID)
    let list_div = ['fees_topic', 'transactions_topic', 'wallet_topic', 'roadmap_topic', 'tipme_topic']
    list_div = list_div.filter(e => e !== buttonID)
    $('.'+buttonID).css('display', 'block');
    list_div.forEach(e => $('.'+e).css('display', 'none'))
}

const getTransactions = async (address) => {
    const CHAIN_ID = 43114
    return await fetch(`https://api.covalenthq.com/v1/${CHAIN_ID}/address/${address}/transactions_v2/?page-number=0&page-size=999999999`)
        .then(res => res.json())
        .catch(err => {
            console.log('error:', err)
            return {}
        });
}

const getTokenPrice = async (tokenId) => {
    const price = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd')
        .then(res => res.json())
        .catch(err => null)
   return price[tokenId] ? price[tokenId].usd : 0
}

const main = async (address) => {
    const transactions = await getTransactions(address)
    if (!transactions.data || transactions.error) {
        $("#fees_box").html("<p>Oops we can't fetch the data. Please try again or retry later.</p>")
        return
    }

    let total_fees = 0
    let total_fees_failed = {number:0, gas:0}
    transactions.data.items.forEach(el => {
        total_fees += el.gas_price/1E9 * el.gas_spent/1E9
        if (!el.successful) {
            total_fees_failed.number++
            total_fees_failed.gas += el.gas_price/1E9 * el.gas_spent/1E9
        }
    })

    const avax_price = await getTokenPrice('avalanche-2')
    $('.total_fees').html(` <b>${total_fees.toFixed(2)} AVAX</b> for ${transactions.data.items.length} transactions - <b>$${(total_fees*avax_price).toFixed(2)}*</b>`)
    $('.total_failed').html(` ${total_fees_failed.number} failed for ${total_fees_failed.gas.toFixed(2)} AVAX`)
    $('.price').html(` $${avax_price}`)
    $('#download').html('<button type="button" class="nes-btn is-primary" onclick="onDownload()">Download my transaction history</button>')
}
