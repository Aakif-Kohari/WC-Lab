document.addEventListener('DOMContentLoaded', () => {
    const display = document.getElementById('display');
    const buttons = document.querySelector('.buttons');

    let currentInput = '0';
    let previousInput = null;
    let operation = null;
    let waitForSecondNumber = false;
    let lastResult = null; 

    const updateDisplay = () => {
        display.textContent = currentInput;
    };

    const performCalculation = async (num1, num2, op) => {
        let opString;
        switch (op) {
            case '+': opString = 'add'; break;
            case '-': opString = 'subtract'; break;
            case '*': opString = 'multiply'; break;
            case '/': opString = 'divide'; break;
            default: return 'Error';
        }

        const url = `/calculate?num1=${encodeURIComponent(num1)}&num2=${encodeURIComponent(num2)}&operation=${encodeURIComponent(opString)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            return data.result;

        } catch (error) {
            console.error('Calculation error:', error);
            return 'Server Error';
        }
    };

    const handleEquals = async () => {
        if (previousInput === null || operation === null) return;

        const result = await performCalculation(previousInput, currentInput, operation);

        if (result.startsWith('Error') || result.startsWith('Invalid')) {
            currentInput = 'Error';
            lastResult = null;
        } else {
            currentInput = result.toString();
            lastResult = result;
        }

        previousInput = null;
        operation = null;
        waitForSecondNumber = true;
        updateDisplay();
    };

    const handleNumber = (value) => {
        if (waitForSecondNumber) {
            currentInput = value;
            waitForSecondNumber = false;
        } else if (currentInput === '0' || currentInput === 'Error') {
            currentInput = value;
        } else {
            currentInput += value;
        }
        updateDisplay();
    };

    const handleOperator = (op) => {
        if (previousInput !== null && operation !== null && !waitForSecondNumber) {
            handleEquals(); 
            previousInput = currentInput;
            operation = op;
            waitForSecondNumber = true;
        } else {
            previousInput = currentInput;
            operation = op;
            waitForSecondNumber = true;
        }
        updateDisplay();
    };

    const handleAction = (action) => {
        switch (action) {
            case 'clear':
                currentInput = '0';
                previousInput = null;
                operation = null;
                waitForSecondNumber = false;
                lastResult = null;
                break;
            case 'decimal':
                if (waitForSecondNumber) {
                    currentInput = '0.';
                    waitForSecondNumber = false;
                } else if (!currentInput.includes('.')) {
                    currentInput += '.';
                }
                break;
            case 'sign':
                if (currentInput !== '0' && currentInput !== 'Error') {
                    currentInput = (parseFloat(currentInput) * -1).toString();
                }
                break;
            case 'percent':
                 if (currentInput !== '0' && currentInput !== 'Error') {
                    currentInput = (parseFloat(currentInput) / 100).toString();
                }
                break;
            case 'equals':
                handleEquals();
                return; 
        }
        updateDisplay();
    };

    buttons.addEventListener('click', (event) => {
        const target = event.target;
        if (!target.classList.contains('btn')) return;

        if (target.classList.contains('num-btn')) {
            handleNumber(target.textContent);
        } else if (target.classList.contains('op-btn')) {
            handleOperator(target.textContent);
        } else if (target.classList.contains('func-btn') || target.classList.contains('eq-btn')) {
            const action = target.getAttribute('data-action');
            handleAction(action);
        }
    });

    updateDisplay();
});