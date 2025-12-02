const separador = ['-', '<>', '_', '::']

const urlCnl = "data/codigos-cnl.json"
const urlFailureTypes = "data/tipos-de-falhas.json"
const urlPartners = "data/parceiras.json"

const listCnl = listJson(urlCnl)
const listFailureTypes = listJson(urlFailureTypes)
const listPartners = listJson(urlPartners)

const failureType = document.querySelector('#tipo')
const hostnameA = document.querySelector('#hostA')
const hostnameB = document.querySelector('#hostB')
const partner = document.querySelector('#partner')

////--------------------Events------------------------------------
failureType.addEventListener('focus', () => {
    let datalist = document.querySelector('#failure-types')
    if (datalist.innerHTML == '') {
        for (i of Object.keys(listFailureTypes[0])) {
            datalist.innerHTML += `<option value="${i}"></option>`
        }
    }
})
failureType.addEventListener('blur', (event) => {
    let item = event.target.value.trim().toUpperCase()
    let spanError = document.querySelector(`#${event.target.id}~span`)
    let spanText = ''
    if (item.length > 0) {
        event.target.classList.add('incluedText')
    }
    if (item.length == 0) {
        spanText = 'Campo Obrigatório'
    } else if (Object.keys(listFailureTypes[0]).indexOf(item.trim()) == -1) {
        spanText = 'Tipo Falha Não Cadastrada'
    }

    event.target.setCustomValidity(spanText)
    spanError.innerText = spanText

    const hostLast = document.querySelector('.hostname~.hostname')
    if (item.includes("FALHA") || item.includes("TEMPERATURA")) {
        hostnameB.disabled = true
        hostnameB.value = ''
        hostLast.style.display = 'none'
    } else {
        hostnameB.disabled = false
        hostLast.style.display = ''
    }
})
//
partner.addEventListener('focus', () => {
    let datalist = document.querySelector('#partners')
    if (datalist.innerHTML == '') {
        for (i of listPartners) {
            datalist.innerHTML += `<option value="${i}"></option>`
        }
    }
})
partner.addEventListener('blur', (event) => {
    let item = event.target.value.trim().toUpperCase()
    let spanError = document.querySelector(`#${event.target.id}~span`)
    let spanText = ''
    if (item.length > 0) {
        event.target.classList.add('incluedText')
    }
    if (item.length == 0) {
        spanText = 'Campo Obrigatório'
    } else if (listPartners.indexOf(item.trim()) == -1) {
        spanText = 'Parceiro Não Cadastrado'
    }
    event.target.setCustomValidity(spanText)
    spanError.innerText = spanText
})
//
inputHostnameBlur(hostnameA, separador[0])
inputHostnameBlur(hostnameB, separador[0])
////-----------------------------------------------------

////-------------------Functions---------------------------

function listJson(URL) {
    let list = []
    fetch(URL).then(resp => resp.json()).then(data => {
        for (item of data) {
            list.push(item)
        }
    })
    return list
}
//
function inputHostnameBlur(ELEMENT, SPLIT) {
    ELEMENT.addEventListener('blur', () => {
        let item = ELEMENT.value.trim().toUpperCase().replaceAll(".", separador[0])
        let spanError = document.querySelector(`#${ELEMENT.id}~span`)
        let spanText = ''

        if (item.length == 0) {
            spanText = 'Campo Obrigatório'
        } else if (item.split(SPLIT).length < 4) {
            spanText = `Hostmane Invalido!
            Ex: UF${SPLIT}CNL${SPLIT}POP${SPLIT}XXX00
            ou BR${SPLIT}UF${SPLIT}CNL${SPLIT}POP${SPLIT}XX${SPLIT}00`
        }

        spanError.innerText = spanText
        ELEMENT.setCustomValidity(spanText)

        if (item.length > 0) {
            ELEMENT.classList.add('incluedText')
        }
    })
}
//
function popSearchCNL(HOST, JSON, SPLIT) {
    let host = HOST.split(SPLIT)
    let pop = {}

    if (host.length > 2) {
        pop.POP = host[1].length > 2 ? host[2] : host[3]
        for (let i of JSON) {
            try {
                if (i.SIGLA === (host[1].length > 2 ? host[1] : host[2])) {
                    pop.UF = i.UF
                    pop.SIGLA = i.SIGLA
                    pop.MUNICIPIO = i.MUNICIPIO
                }
                console.log(erro)
            } catch (erro) {
            }
        }
    }
    return pop
}
//
function tableSites(OBJ) {
    try {
        return `<tr>
        <td>UF</td>
        <td>${OBJ.UF}</td>
    </tr>
    <tr>
        <td>MUNICIPIO</td>
        <td>${OBJ.MUNICIPIO}</td>
    </tr>
    <tr>
        <td>SIGLA</td>
        <td>${OBJ.SIGLA}</td>
    </tr>
    <tr>
        <td>POP</td>
        <td>${OBJ.POP}</td>
    </tr>
    `
    } catch { }
}
//
function gerar() {
    const failure = failureType.value.trim().toUpperCase()
    const hostA = hostnameA.value.trim().toUpperCase().replaceAll(".", separador[0])
    const hostB = hostnameB.value.trim().toUpperCase().replaceAll(".", separador[0])
    const selectPartner = partner.value.trim().toUpperCase()
    const response = document.getElementById('response')
    const sites = document.querySelector('.sites')
    const fiber = document.querySelector('input[type="radio"]:checked').value
    let pops = [popSearchCNL(hostA, listCnl, separador[0]), popSearchCNL(hostB, listCnl, separador[0])]
    pops.sort((a, b) => {
        return a.MUNICIPIO + a.POP < b.MUNICIPIO + b.POP ? -1 : a.MUNICIPIO + a.POP > b.MUNICIPIO + b.POP ? 1 : 0
    })
    if (failure.includes('FALHA') || failure.includes('TEMPERATURA')) {
        if (failure.includes('ENERGIA')) {
            response.innerText = `Aut Bdesk:#` + `${pops[0].UF}${separador[3]}` +
                `${listFailureTypes[0][failure]}${separador[3]}` +
                `${pops[0].MUNICIPIO}${separador[2]}${pops[0].POP}${separador[1]}` +
                `${pops[0].UF}${separador[0]}${pops[0].SIGLA}${separador[0]}${pops[0].POP}${separador[3]}` +
                `${selectPartner}`
        } else {
            response.innerText = `Aut Bdesk:#` + `${pops[0].UF}${separador[3]}` +
                `${listFailureTypes[0][failure]}${separador[3]}` +
                `${pops[0].MUNICIPIO}${separador[2]}${pops[0].POP}${separador[1]}` +
                `${hostA}${separador[3]}` +
                `${fiber}${separador[3]}${selectPartner}`
        }
    } else {
        response.innerText = `Aut Bdesk:#` + `${pops[0].UF}${separador[3]}` +
            `${listFailureTypes[0][failure]}${separador[3]}` +
            `${pops[0].MUNICIPIO}${separador[2]}${pops[0].POP}${separador[1]}` +
            `${pops[1].MUNICIPIO}${separador[2]}${pops[1].POP}${separador[3]}` +
            `${fiber}${separador[3]}${selectPartner}`
    }
    sites.innerHTML = ''
    for (i in pops) {
        if (pops[i].UF) {
            if (i == 0) {
                sites.innerHTML += `<table>
                <tr>
                    <th colspan="2">PONTA A</th>
                </tr>
                ${tableSites(pops[i])}
                </table>`
            } else {
                sites.innerHTML += `<table>
                <tr>
                    <th colspan="2">PONTA B</th>
                </tr>
                ${tableSites(pops[i])}
                </table>`
            }
        }
    }
}

////---------------------------------------------------

// Coletrar os itens com "required"
const fields = document.querySelectorAll("[required]")

// Pocurar eventos
for (let field of fields) {
    field.addEventListener("invalid", event => {
        const spanError = document.querySelector(`#${event.target.id}~span`)
        event.preventDefault()
        if (spanError.innerText == '') {
            spanError.innerText = 'Preencha esse campo'
        }
        document.getElementById('response').innerText = ''
        document.querySelector('.sites').innerHTML = ''
    })
}

// Capturar o evento do botão "submit"
document.querySelector("form").addEventListener("submit", event => {
    event.preventDefault()
    gerar()
})

// Copiar o texto criado
const copyButton = document.getElementById("copyButton")

copyButton.addEventListener('click', () => {
    copyButton.classList.remove('active')
    let inputText = document.createElement('input')
    inputText.value = document.querySelector("#response").innerText
    document.body.appendChild(inputText)
    inputText.select()
    document.execCommand('copy')
    document.body.removeChild(inputText)
    copyButton.classList.add('active')
})
