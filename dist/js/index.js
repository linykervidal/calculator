"use strict";
const viewCalcs = document.getElementById('view-calcs');
const ulNumbers = document.getElementById('numbers');
const opSum = document.getElementById('sum');
const opSub = document.getElementById('subtract');
const opMult = document.getElementById('multiply');
const opDiv = document.getElementById('divide');
const opTotal = document.getElementById('total');
const opReset = document.getElementById('reset');
const btnErase = document.getElementById('erase');
const decimal = document.getElementById('decimal');
const btnPercent = document.getElementById('percent');
const pView = document.createElement('p');
const resultHtml = document.createElement('p');
pView.id = 'view-numbers';
pView.innerText = '0';
resultHtml.id = 'result';
resultHtml.innerText = '= 0';
viewCalcs === null || viewCalcs === void 0 ? void 0 : viewCalcs.appendChild(pView);
viewCalcs === null || viewCalcs === void 0 ? void 0 : viewCalcs.appendChild(resultHtml);
for (let i = 0; i < 10; i++) {
    const liConstruct = document.createElement('li');
    liConstruct.innerText = i.toString();
    liConstruct.id = `num${i}`;
    ulNumbers === null || ulNumbers === void 0 ? void 0 : ulNumbers.appendChild(liConstruct);
    liConstruct.addEventListener('click', () => addNumber(i));
    if (i === 0) {
        liConstruct.style.order = '-1';
    }
}
let numbers = [];
let partialNumber = [''];
let lastExpression;
let lastSimbolOp = [];
let partialResult;
let resultCalc;
let lastOp = [];
let isFloated = false;
let usedOp = false;
let isFinished = false;
function resetStyle() {
    pView.style.fontSize = '72px';
    resultHtml.style.fontSize = '30px';
}
function addOpEvents() {
    isFinished = false;
    opSum === null || opSum === void 0 ? void 0 : opSum.addEventListener('click', useSomeOp);
    opSub === null || opSub === void 0 ? void 0 : opSub.addEventListener('click', useSomeOp);
    opMult === null || opMult === void 0 ? void 0 : opMult.addEventListener('click', useSomeOp);
    opDiv === null || opDiv === void 0 ? void 0 : opDiv.addEventListener('click', useSomeOp);
    btnPercent === null || btnPercent === void 0 ? void 0 : btnPercent.addEventListener('click', percent);
}
function addNumber(n) {
    if (pView.innerText === '0' || isFinished) {
        resetStyle();
        pView.innerText = n.toString();
        addOpEvents();
        resultHtml.style.opacity = '1';
    }
    else if (usedOp) {
        pView.innerText += n;
        btnPercent === null || btnPercent === void 0 ? void 0 : btnPercent.addEventListener('click', percent);
        usedOp = false;
    }
    else {
        pView.innerText += n;
    }
    partialNumber[partialNumber.length - 1] += n;
    attViewNumber();
}
function attViewNumber() {
    switch (lastOp[lastOp.length - 1]) {
        case 'sum':
            resultCalc = partialResult + parseFloat(partialNumber[partialNumber.length - 1]);
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        case 'sub':
            resultCalc = partialResult - parseFloat(partialNumber[partialNumber.length - 1]);
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        case 'mult':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] * parseFloat(partialNumber[partialNumber.length - 1]);
                    break;
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] * parseFloat(partialNumber[partialNumber.length - 1]);
                    break;
                default:
                    resultCalc = partialResult * parseFloat(partialNumber[partialNumber.length - 1]);
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        case 'div':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] / parseFloat(partialNumber[partialNumber.length - 1]);
                    break;
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] / parseFloat(partialNumber[partialNumber.length - 1]);
                    break;
                default:
                    resultCalc = partialResult / parseFloat(partialNumber[partialNumber.length - 1]);
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        default:
            resultHtml.innerText = `= ${pView.innerText}`;
    }
}
function useSomeOp(e) {
    if (!usedOp) {
        numbers.push(parseFloat(partialNumber[partialNumber.length - 1]));
        if (lastOp.length === 0) {
            partialResult = numbers[0];
        }
        else {
            partialResult = resultCalc;
        }
        resultHtml.innerText = `= ${partialResult}`.replace('.', ',');
        isFloated = false;
        partialNumber.push('');
        btnPercent === null || btnPercent === void 0 ? void 0 : btnPercent.removeEventListener('click', percent);
    }
    switch (e.target) {
        case opSum:
            if (!usedOp) {
                lastExpression = pView.innerHTML;
                lastOp.push('sum');
                lastSimbolOp.push('+');
            }
            else {
                lastOp[lastOp.length - 1] = 'sum';
                lastSimbolOp[lastSimbolOp.length - 1] = '+';
            }
            break;
        case opSub:
            if (!usedOp) {
                lastExpression = pView.innerHTML;
                lastOp.push('sub');
                lastSimbolOp.push('-');
            }
            else {
                lastOp[lastOp.length - 1] = 'sub';
                lastSimbolOp[lastSimbolOp.length - 1] = '-';
            }
            break;
        case opMult:
            if (!usedOp) {
                lastExpression = pView.innerHTML;
                lastOp.push('mult');
                lastSimbolOp.push('x');
            }
            else {
                lastOp[lastOp.length - 1] = 'mult';
                lastSimbolOp[lastSimbolOp.length - 1] = 'x';
            }
            break;
        default:
            if (!usedOp) {
                lastExpression = pView.innerHTML;
                lastOp.push('div');
                lastSimbolOp.push('/');
            }
            else {
                lastOp[lastOp.length - 1] = 'div';
                lastSimbolOp[lastSimbolOp.length - 1] = '/';
            }
    }
    pView.innerHTML = `${lastExpression} ${lastSimbolOp[lastSimbolOp.length - 1]}&nbsp;`;
    usedOp = true;
}
function floatingNumber() {
    if (!isFloated) {
        if (pView.innerText === '0' || isFinished) {
            resetStyle();
            pView.innerText = '0,';
            resultHtml.innerText = '= 0,';
            addOpEvents();
            resultHtml.style.opacity = '1';
        }
        else if (partialNumber[partialNumber.length - 1] === '' && usedOp) {
            pView.innerText += '0,';
            usedOp = false;
        }
        else {
            pView.innerText += ',';
        }
        partialNumber[partialNumber.length - 1] += '.';
        isFloated = true;
    }
}
decimal === null || decimal === void 0 ? void 0 : decimal.addEventListener('click', floatingNumber);
function percent() {
    if (numbers.length === 0) {
        pView.innerText += '%';
        resultHtml.innerText = `= ${parseFloat(partialNumber[partialNumber.length - 1]) / 100}`.replace('.', ',');
        total();
    }
    else {
        if (lastOp[lastOp.length - 1] === 'mult' || lastOp[lastOp.length - 1] === 'div') {
            if (lastOp[lastOp.length - 2] === 'sum' || lastOp[lastOp.length - 2] === 'sub') {
                pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;');
                partialNumber[partialNumber.length - 1] = (numbers[numbers.length - 1] * parseFloat(partialNumber[partialNumber.length - 1]) / 100).toString();
                pView.innerText += partialNumber[partialNumber.length - 1];
            }
            else {
                pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;');
                partialNumber[partialNumber.length - 1] = (partialResult * parseFloat(partialNumber[partialNumber.length - 1]) / 100).toString();
                pView.innerText += partialNumber;
            }
        }
        else {
            pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;');
            partialNumber[partialNumber.length - 1] = (partialResult * parseFloat(partialNumber[partialNumber.length - 1]) / 100).toString();
            pView.innerText += partialNumber;
        }
        attViewNumber();
    }
}
function erase() {
    if (numbers.length === 0) {
        resetCalc();
    }
    else {
        if (partialNumber[partialNumber.length - 1] === '0' || partialNumber[partialNumber.length - 1] === '') {
            numbers.pop();
            partialNumber.pop();
            lastOp.pop();
            usedOp = false;
            pView.innerHTML = pView.innerHTML.replace(` ${lastSimbolOp[lastSimbolOp.length - 1]}&nbsp;`, '');
            lastSimbolOp.pop();
        }
        else {
            if (partialNumber[partialNumber.length - 1].startsWith('0')) {
                partialNumber[partialNumber.length - 1] = partialNumber[partialNumber.length - 1].replace('0', '');
            }
            pView.innerHTML = pView.innerHTML.replace(`&nbsp;${partialNumber[partialNumber.length - 1]}`, '&nbsp;');
            partialNumber[partialNumber.length - 1] = '0';
            attViewNumber();
        }
    }
}
btnErase === null || btnErase === void 0 ? void 0 : btnErase.addEventListener('click', erase);
function clearDatas() {
    numbers = [];
    lastOp = [];
    lastSimbolOp = [];
    partialNumber = [''];
    isFloated = false;
    usedOp = false;
    opSum === null || opSum === void 0 ? void 0 : opSum.removeEventListener('click', useSomeOp);
    opSub === null || opSub === void 0 ? void 0 : opSub.removeEventListener('click', useSomeOp);
    opMult === null || opMult === void 0 ? void 0 : opMult.removeEventListener('click', useSomeOp);
    opDiv === null || opDiv === void 0 ? void 0 : opDiv.removeEventListener('click', useSomeOp);
    btnPercent === null || btnPercent === void 0 ? void 0 : btnPercent.removeEventListener('click', percent);
}
function total() {
    resultHtml.style.opacity = '1';
    pView.style.transition = '0.5s ease-in-out';
    resultHtml.style.transition = '0.5s ease-in-out';
    pView.style.fontSize = '30px';
    resultHtml.style.fontSize = '72px';
    isFinished = true;
    clearDatas();
    setTimeout(() => {
        pView.style.transition = 'none';
        resultHtml.style.transition = 'none';
    }, 600);
}
opTotal === null || opTotal === void 0 ? void 0 : opTotal.addEventListener('click', total);
function resetCalc() {
    pView.innerText = '0';
    resultHtml.innerText = '= 0';
    resetStyle();
    resultHtml.style.opacity = '0';
    clearDatas();
}
opReset === null || opReset === void 0 ? void 0 : opReset.addEventListener('click', resetCalc);
