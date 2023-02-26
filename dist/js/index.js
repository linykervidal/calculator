"use strict";
const viewCalcs = document.getElementById('view-calcs');
const ulNumbers = document.getElementById('numbers');
const opSum = document.getElementById('sum');
const opSub = document.getElementById('subtract');
const opMult = document.getElementById('multiply');
const opDiv = document.getElementById('divide');
const opTotal = document.getElementById('total');
const opReset = document.getElementById('reset');
const decimal = document.getElementById('decimal');
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
let partialNumber = '';
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
        usedOp = false;
    }
    else {
        pView.innerText += n;
    }
    partialNumber += n;
    switch (lastOp[lastOp.length - 1]) {
        case 'sum':
            resultCalc = partialResult + parseFloat(partialNumber);
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        case 'sub':
            resultCalc = partialResult - parseFloat(partialNumber);
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        case 'mult':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] * parseFloat(partialNumber);
                    break;
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] * parseFloat(partialNumber);
                    break;
                default:
                    resultCalc = partialResult * parseFloat(partialNumber);
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        case 'div':
            switch (lastOp[lastOp.length - 2]) {
                case 'sum':
                    resultCalc = partialResult - numbers[numbers.length - 1] + numbers[numbers.length - 1] / parseFloat(partialNumber);
                    break;
                case 'sub':
                    resultCalc = partialResult + numbers[numbers.length - 1] - numbers[numbers.length - 1] / parseFloat(partialNumber);
                    break;
                default:
                    resultCalc = partialResult / parseFloat(partialNumber);
            }
            resultHtml.innerText = `= ${resultCalc}`.replace('.', ',');
            break;
        default:
            resultHtml.innerText = `= ${pView.innerText}`;
    }
}
function useSomeOp(e) {
    numbers.push(parseFloat(partialNumber));
    if (lastOp.length === 0) {
        partialResult = numbers[0];
    }
    else {
        partialResult = resultCalc;
    }
    resultHtml.innerText = `= ${partialResult}`.replace('.', ',');
    isFloated = false;
    usedOp = true;
    partialNumber = '';
    switch (e.target) {
        case opSum:
            pView.innerHTML += ' +&nbsp;';
            lastOp.push('sum');
            break;
        case opSub:
            pView.innerHTML += ' -&nbsp;';
            lastOp.push('sub');
            break;
        case opMult:
            pView.innerHTML += ' x&nbsp;';
            lastOp.push('mult');
            break;
        default:
            pView.innerHTML += ' /&nbsp;';
            lastOp.push('div');
    }
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
        else if (partialNumber === '' && usedOp) {
            pView.innerText += '0,';
            usedOp = false;
        }
        else {
            pView.innerText += ',';
        }
        partialNumber += '.';
        isFloated = true;
    }
}
decimal === null || decimal === void 0 ? void 0 : decimal.addEventListener('click', floatingNumber);
function clearDatas() {
    numbers = [];
    lastOp = [];
    partialNumber = '';
    isFloated = false;
    usedOp = false;
    opSum === null || opSum === void 0 ? void 0 : opSum.removeEventListener('click', useSomeOp);
    opSub === null || opSub === void 0 ? void 0 : opSub.removeEventListener('click', useSomeOp);
    opMult === null || opMult === void 0 ? void 0 : opMult.removeEventListener('click', useSomeOp);
    opDiv === null || opDiv === void 0 ? void 0 : opDiv.removeEventListener('click', useSomeOp);
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
