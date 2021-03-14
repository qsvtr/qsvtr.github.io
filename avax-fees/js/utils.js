const getUrlVars = () => {
    const search = location.search.substring(1);
    return search ? JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}') : {}
}
const loadJsonFile = (file) => {
    return fetch(file)
        .then(response => response.json())
        .catch(err => {})
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

$(window).scroll(function () {
    const scroll = $(window).scrollTop();
    scroll > 50 ? $("#nav_bar").addClass("sticky") : $("#nav_bar").removeClass("sticky")
});
