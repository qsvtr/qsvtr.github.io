let ARC20TOKENS = null // bad idea :/

const onClickMenu = async (buttonID) => {
    let list_div = ['fees_topic', 'transactions_topic', 'wallet_topic', 'roadmap_topic', 'tipme_topic']
    list_div = list_div.filter(e => e !== buttonID)
    $('.'+buttonID).css('display', 'block');
    list_div.forEach(e => $('.'+e).css('display', 'none'))
}

const getTokenName = (tokens, contract) => {
    return tokens.find(obj => obj.contract_address.toLowerCase() === contract.toLowerCase())
}

const fillTransactionsTable = async (transactions) => {
    transactions.items.forEach(t => {
        if (t.successful) {
            const tx = t.log_events[0]
            if (!tx) {
                console.log(t)
                console.log(`Transfer from ${t.from_address} to ${t.to_address} for ${t.value/1E18} AVAX at ${t.block_signed_at}`)
                /*let t_line = `<tr><td>trasnfer ${token1.contract_ticker_symbol} for ${token2.contract_ticker_symbol}</td>`
                t_line+=`<td>$${price1} ${token1.contract_ticker_symbol}</td><td>$${price2} ${token2.contract_ticker_symbol}</td><td>${date}</td>`
                t_line+=`<td><a target="_blank" href='https://cchain.explorer.avax.network/tx/${tx.tx_hash}'>explorer</a></td></tr>`
                $('.transaction_table').append(t_line)*/
            } else {
                //console.log(t)
                if (t.log_events[0].decoded.name === 'Withdrawal' && t.log_events[1].decoded.name === 'Swap') {
                    const token1 = getTokenName(ARC20TOKENS.data.items, t.log_events[t.log_events.length-1].sender_address)
                    const token2 = getTokenName(ARC20TOKENS.data.items, t.log_events[3].sender_address)
                    const date = t.block_signed_at.split('T')[0]
                    let price1, price2 = 0
                    if (t.log_events[1].decoded.params[1].value !== '0') {
                        price1 = (t.log_events[1].decoded.params[1].value/10**token1.contract_decimals).toFixed(2)
                        price2 = (t.log_events[1].decoded.params[4].value/10**token2.contract_decimals).toFixed(2)
                    } else if (t.log_events[1].decoded.params[2].value !== '0') {
                        price1 = (t.log_events[1].decoded.params[2].value/10**token1.contract_decimals).toFixed(2)
                        price2 = (t.log_events[1].decoded.params[3].value/10**token2.contract_decimals).toFixed(2)
                    }
                    let t_line = `<tr><td>swap ${token1.contract_ticker_symbol} for ${token2.contract_ticker_symbol}</td>`
                    t_line+=`<td>$${price1} ${token1.contract_ticker_symbol}</td><td>$${price2} ${token2.contract_ticker_symbol}</td><td>${date}</td>`
                    t_line+=`<td><a target="_blank" href='https://cchain.explorer.avax.network/tx/${tx.tx_hash}'>explorer</a></td></tr>`
                    $('.transaction_table').append(t_line)
                } else if (tx.decoded.name === 'Swap') {
                    const token1 = getTokenName(ARC20TOKENS.data.items, t.log_events[3].sender_address)
                    const token2 = getTokenName(ARC20TOKENS.data.items, t.log_events[2].sender_address)
                    const date = tx.block_signed_at.split('T')[0]
                    let price1, price2 = 0
                    if (tx.decoded.params[1].value !== '0') {
                        price1 = (tx.decoded.params[1].value/10**token1.contract_decimals).toFixed(2)
                        price2 = (tx.decoded.params[4].value/10**token2.contract_decimals).toFixed(2)
                    } else if (tx.decoded.params[2].value !== '0') {
                        price1 = (tx.decoded.params[2].value/10**token1.contract_decimals).toFixed(2)
                        price2 = (tx.decoded.params[3].value/10**token2.contract_decimals).toFixed(2)
                    }
                    let t_line = `<tr><td>swap ${token1.contract_ticker_symbol} for ${token2.contract_ticker_symbol}</td>`
                    t_line+=`</td><td>$${price1} ${token1.contract_ticker_symbol}</td><td>$${price2} ${token2.contract_ticker_symbol}</td><td>${date}</td>`
                    t_line+=`<td><a target="_blank" href='https://cchain.explorer.avax.network/tx/${tx.tx_hash}'>explorer</a></td></tr>`
                    $('.transaction_table').append(t_line)
                } else if (tx.decoded.name === 'Claimed') {
                    const token = getTokenName(ARC20TOKENS.data.items, t.log_events[t.log_events.length-1].sender_address)
                    const quantity = (tx.decoded.params[2].value/10**token.contract_decimals).toFixed(2)
                    const date = tx.block_signed_at.split('T')[0]
                    $('.transaction_table').append(`<tr><td>claim ${token.contract_ticker_symbol}</td><td>$${quantity} ${token.contract_ticker_symbol}</td><td>-</td><td>${date}</td><td><a target="_blank" href='https://cchain.explorer.avax.network/tx/${tx.tx_hash}'>explorer</a></td></tr>`)
                } else if (tx.decoded.name === 'Transfer') {
                    //console.log(tx)
                }
                /* need smart contract address
                else if (tx.decoded.name === 'Deposit') {
                    console.log(tx)
                } else if (tx.decoded.name === 'Staked') {
                    console.log(tx)
                } else if (tx.decoded.name === 'RewardPaid') {
                    console.log(tx)
                } else if (tx.decoded.name === 'Withdraw') {
                    console.log(tx.decoded.name)
                }  else if (tx.decoded.name === 'Withdrawal') {
                    console.log(tx.decoded.name)
                } else if (tx.decoded.name === 'Approval') {
                    console.log(tx.decoded.name)
                } else if (tx.decoded.name === 'RewardPaid') {
                    console.log(tx.decoded.name)
                } else if (tx.decoded.name === 'Mint') {
                    console.log(tx.decoded.name)
                } else if (tx.decoded.name === 'Transfer') {
                    console.log(tx.decoded.name)
                }*/
            }
        }
    }, ARC20TOKENS)
}

const fillWalletTable = async (address) => {
    const tokens = await getTokensWallet(address)
    if (tokens.data) {
        tokens.data.items.forEach(token => {
            const contract = token.contract_address.substring(0, 6) + '...' + token.contract_address.substring(token.contract_address.length-4, token.contract_address.length)
            $('.wallet_table').append(`<tr><td><img src="${token.logo_url}" alt="icon"></td><td>${token.contract_ticker_symbol}</td><td>${token.balance}</td><td>X</td><td>X</td><td><a href="">${contract}</a></td></tr>`)
        })
    }
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
        total_fees += el.gas_price*el.gas_spent/1E18
        if (!el.successful) {
            total_fees_failed.number++
            total_fees_failed.gas += el.gas_price*el.gas_spent/1E18
        }
    })
    const avax_price = await getTokenPrice('avalanche-2')
    await fillTransactionsTable(transactions.data)
    // await fillWalletTable(address)
    $('.total_fees').html(` <b>${total_fees.toFixed(2)} AVAX</b> for ${transactions.data.items.length} transactions - <b>$${(total_fees*avax_price).toFixed(2)}*</b>`)
    $('.total_failed').html(` ${total_fees_failed.number} failed for ${total_fees_failed.gas.toFixed(2)} AVAX`)
    $('.price').html(` $${avax_price}`)
    $('#download').html('<button type="button" class="nes-btn is-primary" onclick="onDownload()">Download my transaction history</button>')
}

window.addEventListener('load', async () => {

    $(".infos_topic").html('<h2>fetching tokens<span class="loading"></span></h2>')
    ARC20TOKENS = await getARC20Tokens();
    if (!ARC20TOKENS.data) {
        console.log('error fatal')
        $(".infos_topic").html('<h2>FATAL ERROR: can\'t retrieve tokens :(</h2>')
        return
    }
    $(".infos_topic").html('<h2>Connecting to Metamask<span class="loading"></span></h2>')
    const params = getUrlVars();
    let address = params.address || params.a || null;
    if (!address) {
        if (window.hasOwnProperty("ethereum") && window.ethereum.hasOwnProperty("isMetaMask")) {
            const addresses = await ethereum.request({method: 'eth_requestAccounts'});
            address = addresses[0]
        } else {
            $('.infos_topic').html('<h2>Oops you need to install <a target="_blank" href="https://metamask.io/">MetaMask</a> before!</h2><br><p>Or add an argument in the url like that: ?a=YOUR_ADDRESS</p>');
            $('.address_section').html('<br/><p>you can try an example <a href="https://qsvtr.github.io/avax-fees/?a=0xC35D1124f56EEbf9E727C04fc678191D02df9A09">here</a> (random address)</p>');
            $(".wallet_topic").html('');
            $(".tokens_topic").html('');
            return
        }
    }
    $(".infos_topic").html('')
    $('.address_section').html(`<br/><p>Connected to <span id="address"><b>${address}</b></span></p>`)
    $(".menu_topic").css('display', 'block');
    $(".fees_topic").css('display', 'block');
    await main(address)
    $('.loading').css('display', 'none')
    $('.warning_loading').css('display', 'none')
    $('#fees_box').css('display', 'block');
});
