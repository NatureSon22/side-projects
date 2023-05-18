class Calculator {
    constructor(equation, num) {
        this.equation = equation;
        this.num = num;
        this.clear();
    }

    clear() {
        this.equationOperand = "";
        this.numOperand = "";
        this.operation = undefined;
    }

    delete() {
        this.numOperand = this.numOperand.toString().slice(0, -1);
    }

    appendNumber(num) {
        if(num === '.' && this.numOperand.includes('.')) {
          return;
        }
        this.numOperand += num;
    }
      

    choooseOperation(operation) {
        if(this.numOperand === "") {
            return
        }

        if(this.equationOperand !== "") {
            this.compute();
        }
        this.operation = operation;
        this.equationOperand = this.numOperand;
        this.numOperand = ""

    }

    compute() {
        let computation;
        let prev = parseFloat(this.equationOperand);
        let current = parseFloat(this.numOperand);

        if(isNaN(prev) || isNaN(current)) return;

        switch(this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '/':
                computation = prev / current;
                break;
            default:
                return;
        }
        this.numOperand = computation;
        this.operation = undefined;
        this.equationOperand = ""
    }

    getDisplayNumber(num) {
        const stringNum = num.toString();
        const [intDigits, decDigits] = stringNum.split('.');
    
        let intDisplay = '';
        if (!isNaN(intDigits)) {
            intDisplay = intDigits.toLocaleString('en', {maximumFractionDigits: 0});
        }
    
        if (decDigits != null) {
            return `${intDisplay}.${decDigits}`;
        } else {
            return intDisplay;
        }
    }
    

    display() {
        this.num.value = this.getDisplayNumber(this.numOperand);
        if(this.operation !== undefined) {
            this.equation.value = `${this.equationOperand} ${this.operation}`
        } else {
            this.equation.value = "";
        }
    }
} 


const numBtns = document.querySelectorAll('[data-number]');
const operationBtns = document.querySelectorAll('[data-operation]');
const equalsBtn = document.querySelector('[data-equals]');
const deleteBtn= document.querySelector('[data-delete]');
const allClearBtn = document.querySelector('[data-all-clear]');
const equation = document.querySelector('[data-equation]');
const num = document.querySelector('[data-num]');
const mode = document.querySelector('.fa-sun');
let isClicked = false

const calculator = new Calculator(equation, num);

numBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        calculator.appendNumber(btn.textContent);
        calculator.display();
    });
})

operationBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        calculator.choooseOperation(btn.textContent);
        calculator.display();
    });
})

equalsBtn.addEventListener("click", () => {
    calculator.compute();
    calculator.display();
})


allClearBtn.addEventListener("click", () => {
    calculator.clear();
    calculator.display();
    num.value = 0
})


deleteBtn.addEventListener("click", () => {
    calculator.delete();
    calculator.display();
})


mode.addEventListener("click", () => {
    if(!isClicked) {
        document.querySelector(".calculator-body").classList.add('active');
        document.getElementsByTagName('body')[0].classList.add('body-active');
        num.classList.add('input-active');
        num.classList.add('answer-bar-active')
        operationBtns.forEach(btn => btn.classList.add('operation'))
        equation.classList.add('input-active');
        equalsBtn.classList.add('equals');
        document.querySelectorAll('.hvr-float').forEach(icon => icon.classList.add('icon-active'))
        numBtns.forEach(btn => {
            btn.classList.add('number-active')
        })
        deleteBtn.classList.add('util-active')
        allClearBtn.classList.add('util-active')
        isClicked = true
    } else {
        document.querySelector(".calculator-body").classList.remove('active');
        document.getElementsByTagName('body')[0].classList.remove('body-active');
        num.classList.remove('input-active');
        equation.classList.remove('input-active');
        num.classList.remove('answer-bar-active')
        operationBtns.forEach(btn => btn.classList.remove('operation'))
        equation.classList.remove('input-active');
        equalsBtn.classList.remove('equals');
        document.querySelectorAll('.hvr-float').forEach(icon => icon.classList.remove('icon-active'))
        numBtns.forEach(btn => btn.classList.remove('number-active'))
        deleteBtn.classList.remove('util-active')
        allClearBtn.classList.remove('util-active')
        isClicked = false
    }
});