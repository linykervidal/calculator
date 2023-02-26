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
const decimal: dom = document.getElementById('decimal')

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
let partialNumber: string = ''
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
}

//adicionando números e realizando cálculos dinamicamente
function addNumber(n: number): void {
    if (pView.innerText === '0' || isFinished) {
        resetStyle()
        pView.innerText = n.toString()
        addOpEvents()
        resultHtml.style.opacity = '1'
    } else if (usedOp) {
        pView.innerText += n
        usedOp = false
    } else {
        pView.innerText += n
    }
    partialNumber += n

    switch (lastOp[lastOp.length - 1]) {
        case 'sum':
            resultCalc = partialResult + parseFloat(partialNumber)
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        case 'sub':
            resultCalc = partialResult - parseFloat(partialNumber)
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        case 'mult':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] * parseFloat(partialNumber)
                    break
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] * parseFloat(partialNumber)
                    break
                default:
                    resultCalc = partialResult * parseFloat(partialNumber)
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        case 'div':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] / parseFloat(partialNumber)
                    break
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] / parseFloat(partialNumber)
                    break
                default:
                    resultCalc = partialResult / parseFloat(partialNumber)
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',')
            break
        default:
            resultHtml.innerText = `= ${pView.innerText}`
    }
}

//usando as operações
function useSomeOp(e: Event): void {
    numbers.push(parseFloat(partialNumber))

    if (lastOp.length === 0) {
        partialResult = numbers[0]
    } else {
        partialResult = resultCalc
    }

    resultHtml.innerText = `= ${partialResult}`.replace('.', ',')
    isFloated = false
    usedOp = true
    partialNumber = ''

    //testando os elementos
    switch (e.target) {
        case opSum:
            pView.innerHTML += ' +&nbsp;'
            lastOp.push('sum')
            break
        case opSub:
            pView.innerHTML += ' -&nbsp;'
            lastOp.push('sub')
            break
        case opMult:
            pView.innerHTML += ' x&nbsp;'
            lastOp.push('mult')
            break
        default:
            pView.innerHTML += ' /&nbsp;'
            lastOp.push('div')
    }
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
        } else if (partialNumber === '' && usedOp) {
            pView.innerText += '0,'
            usedOp = false
        } else {
            pView.innerText += ','
        }
        partialNumber += '.'
        isFloated = true
    }
}

decimal?.addEventListener('click', floatingNumber)

//resetando algumas variáveis e eventos
function clearDatas(): void {
    numbers = []
    lastOp = []
    partialNumber = ''
    isFloated = false
    usedOp = false
    opSum?.removeEventListener('click', useSomeOp)
    opSub?.removeEventListener('click', useSomeOp)
    opMult?.removeEventListener('click', useSomeOp)
    opDiv?.removeEventListener('click', useSomeOp)
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