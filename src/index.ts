type dom = HTMLElement | null //type alias

//chamando elementos via DOM
const viewCalcs: dom = document.getElementById('view-calcs') //tipando uma variável
const ulNumbers: dom = document.getElementById('numbers')
const opSum: dom = document.getElementById('sum')
const opSub: dom = document.getElementById('subtract')
const opMult: dom = document.getElementById('multiply')
const opDiv: dom = document.getElementById('divide')
const opTotal: dom = document.getElementById('total')
const opReset: dom = document.getElementById('reset')
const btnErase: dom = document.getElementById('erase')
const decimal: dom = document.getElementById('decimal')
const btnPercent: dom = document.getElementById('percent')

//criando elementos que serão geradas no HTML
const pView: HTMLParagraphElement = document.createElement('p')
const resultHtml: HTMLParagraphElement = document.createElement('p')

//configurando elementos criados
pView.id = 'view-numbers'
pView.innerText = '0'
resultHtml.id = 'result'
resultHtml.innerText = '= 0'

//atribuindo elementos filhos ao pai
viewCalcs?.appendChild(pView)
viewCalcs?.appendChild(resultHtml)

//criando e configurando vários elementos com looping e atribuindo-as ao seu pai
for (let i: number = 0; i < 10; i++) {
    const liConstruct: HTMLLIElement = document.createElement('li')
    liConstruct.innerText = i.toString()
    liConstruct.id = `num${i}`
    ulNumbers?.appendChild(liConstruct)
    liConstruct.addEventListener('click', () => addNumber(i))
    if (i === 0) {
        liConstruct.style.order = '-1'
    }
}

//criando variáveis que manipularão a lógica do projeto
let numbers: number[] = []
let partialNumber: string[] = ['']
let lastExpression: string
let lastSimbolOp: string[] = []
let partialResult: number
let resultCalc: number
let lastOp: string[] = []
let isFloated: boolean = false
let usedOp: boolean = false
let isFinished: boolean = false


//CRIANDO FUNÇÕES

//resetando estilos
function resetStyle(): void {
    pView.style.fontSize = '72px'
    resultHtml.style.fontSize = '30px'
}

//adicionando os eventos operacionais
function addOpEvents(): void {
    isFinished = false
    opSum?.addEventListener('click', useSomeOp)
    opSub?.addEventListener('click', useSomeOp)
    opMult?.addEventListener('click', useSomeOp)
    opDiv?.addEventListener('click', useSomeOp)
    btnPercent?.addEventListener('click', percent)
}

//adicionando números
function addNumber(n: number): void {
    if (pView.innerText === '0' || isFinished) {
        resetStyle()
        pView.innerText = n.toString()
        addOpEvents()
        resultHtml.style.opacity = '1'
    } else if (usedOp) {
        pView.innerText += n
        btnPercent?.addEventListener('click', percent)
        usedOp = false
    } else {
        pView.innerText += n
    }
    partialNumber[partialNumber.length - 1] += n
    attViewNumber()
}

//realizando cálculos dinamicamente
function attViewNumber():void {
    switch (lastOp[lastOp.length - 1]) {
        case 'sum':
            resultCalc = partialResult + parseFloat(partialNumber[partialNumber.length - 1])
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        case 'sub':
            resultCalc = partialResult - parseFloat(partialNumber[partialNumber.length - 1])
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        case 'mult':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] * parseFloat(partialNumber[partialNumber.length - 1])
                    break
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] * parseFloat(partialNumber[partialNumber.length - 1])
                    break
                default:
                    resultCalc = partialResult * parseFloat(partialNumber[partialNumber.length - 1])
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        case 'div':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] / parseFloat(partialNumber[partialNumber.length - 1])
                    break
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] / parseFloat(partialNumber[partialNumber.length - 1])
                    break
                default:
                    resultCalc = partialResult / parseFloat(partialNumber[partialNumber.length - 1])
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        default:
            resultHtml.innerText = `= ${pView.innerText}`
    }
}

//usando as operações
function useSomeOp(e: Event): void {
    if (!usedOp) {        
        numbers.push(parseFloat(partialNumber[partialNumber.length - 1]))
        
        if (lastOp.length === 0) {
            partialResult = numbers[0]
        } else {
            partialResult = resultCalc
        }
        
        resultHtml.innerText = `= ${partialResult}`.replace('.', ',')
        isFloated = false
        partialNumber.push('')
        btnPercent?.removeEventListener('click', percent)
    }

    //testando os elementos
    switch (e.target) {
        case opSum:
            if (!usedOp) {
                lastExpression = pView.innerHTML
                lastOp.push('sum')
                lastSimbolOp.push('+')
            } else {
                lastOp[lastOp.length - 1] = 'sum'
                lastSimbolOp[lastSimbolOp.length - 1] = '+'
            }
            break
        case opSub:
            if (!usedOp) {
                lastExpression = pView.innerHTML
                lastOp.push('sub')
                lastSimbolOp.push('-')
            } else {
                lastOp[lastOp.length - 1] = 'sub'
                lastSimbolOp[lastSimbolOp.length - 1] = '-'
            }
            break
        case opMult:
            if (!usedOp) {
                lastExpression = pView.innerHTML
                lastOp.push('mult')
                lastSimbolOp.push('x')
            } else {
                lastOp[lastOp.length - 1] = 'mult'
                lastSimbolOp[lastSimbolOp.length - 1] = 'x'
            }
            break
        default:
            if (!usedOp) {
                lastExpression = pView.innerHTML
                lastOp.push('div')
                lastSimbolOp.push('/')
            } else {
                lastOp[lastOp.length - 1] = 'div'
                lastSimbolOp[lastSimbolOp.length - 1] = '/'
            }
    }
    pView.innerHTML = `${lastExpression} ${lastSimbolOp[lastSimbolOp.length - 1]}&nbsp;`
    usedOp = true
}

//tornando o numero decimal
function floatingNumber(): void {
    if (!isFloated) {
        if (pView.innerText === '0' || isFinished) {
            resetStyle()
            pView.innerText = '0,'
            resultHtml.innerText = '= 0,'
            addOpEvents()
            resultHtml.style.opacity = '1'
        } else if (partialNumber[partialNumber.length - 1] === '' && usedOp) {
            pView.innerText += '0,'
            usedOp = false
        } else {
            pView.innerText += ','
        }
        partialNumber[partialNumber.length - 1] += '.'
        isFloated = true
    }
}

decimal?.addEventListener('click', floatingNumber) //chamando a função acima

//usando porcentagem sobre o último número
function percent(): void {
    if (numbers.length === 0) {
        pView.innerText += '%'
        resultHtml.innerText = `= ${parseFloat(partialNumber[partialNumber.length - 1]) / 100}`.replace('.', ',')
        total()
    } else {
        if (lastOp[lastOp.length - 1] === 'mult' || lastOp[lastOp.length - 1] === 'div') {
            if (lastOp[lastOp.length - 2] === 'sum' || lastOp[lastOp.length - 2] === 'sub') {
                pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;')
                partialNumber[partialNumber.length - 1] = (numbers[numbers.length - 1] * parseFloat(partialNumber[partialNumber.length - 1]) / 100).toString()
                pView.innerText += partialNumber[partialNumber.length - 1]
            } else {
                pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;')
                partialNumber[partialNumber.length - 1] = (partialResult * parseFloat(partialNumber[partialNumber.length - 1]) / 100).toString()
                pView.innerText += partialNumber
            }
        } else {
            pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;')
            partialNumber[partialNumber.length - 1] = (partialResult * parseFloat(partialNumber[partialNumber.length - 1]) / 100).toString()
            pView.innerText += partialNumber
        }
        attViewNumber()
    }
}

//PAREI AQUI, FUNÇÃO AINDA ESTÁ BUGADA, TESTAR TORNAR A VARIAVEL LAST EXPRESSION COMO ARRAY E INCLUIR NA SOLUÇÃO
function erase(): void {
    if (numbers.length === 0) {
        resetCalc()
    } else {
        if (partialNumber[partialNumber.length - 1] === '0' || partialNumber[partialNumber.length - 1] === '') {
            numbers.pop()
            partialNumber.pop()
            lastOp.pop()
            usedOp = false
            pView.innerHTML = pView.innerHTML.replace(` ${lastSimbolOp[lastSimbolOp.length - 1]}&nbsp;`, '')
            lastSimbolOp.pop()
        } else {
            if (partialNumber[partialNumber.length - 1].startsWith('0')) {
                partialNumber[partialNumber.length - 1] = partialNumber[partialNumber.length - 1].replace('0', '')
            }
            pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;')
            partialNumber[partialNumber.length - 1] = '0'
            attViewNumber()
        }
    }
}

btnErase?.addEventListener('click', erase)

//resetando algumas variáveis e eventos
function clearDatas(): void {
    numbers = []
    lastOp = []
    lastSimbolOp = []
    partialNumber = ['']
    isFloated = false
    usedOp = false
    opSum?.removeEventListener('click', useSomeOp)
    opSub?.removeEventListener('click', useSomeOp)
    opMult?.removeEventListener('click', useSomeOp)
    opDiv?.removeEventListener('click', useSomeOp)
    btnPercent?.removeEventListener('click', percent)
}

//calculando o total
function total(): void {
    resultHtml.style.opacity = '1'
    pView.style.transition = '0.5s ease-in-out'
    resultHtml.style.transition = '0.5s ease-in-out'
    pView.style.fontSize = '30px'
    resultHtml.style.fontSize = '72px'
    isFinished = true
    clearDatas()
    setTimeout(() => {
        pView.style.transition = 'none'
        resultHtml.style.transition = 'none'        
    }, 600);
}

opTotal?.addEventListener('click', total) //chamando a função acima

//resetando a calculadora
function resetCalc(): void {
    pView.innerText = '0'
    resultHtml.innerText = '= 0'
    resetStyle()
    resultHtml.style.opacity = '0'
    clearDatas()
}

opReset?.addEventListener('click', resetCalc) //chamando a função acima