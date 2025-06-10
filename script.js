const display = document.getElementById('display'); 
const buttons = document.querySelectorAll('button'); 


// Constants for operators and parenthesis used in the calculator
const operators = ["+", "/", "-", "*"];
const parenthesis = ["(", ")"];


// This function listens for button clicks and updates the display accordingly
buttons.forEach(button => {
    button.addEventListener('click', () => {
      const value = button.textContent; // Get the text content of the clicked button
      console.log("button clicked:", display.value, value); // Log the current display value and clicked button value
      console.log(typeof value, typeof display.value); // Log the types of the values
      if(value === 'AC') 
        {
        display.value = ''; // Clear the display if 'AC' is clicked
      } else if(display.value === 'Error') {
        display.value = value; // Reset the display if it currently shows 'Error'
      }
      
      else if(value === '=') 
        {
            try {
                const result = evaluatePostFix(display.value); // Evaluate the expression in the display
                if (isNaN(result)) {
                    throw new Error("Invalid expression"); // Throw error if result is not a number
                }
                display.value = result; // Update the display with the result
            } catch (error) {
                console.error("Error evaluating expression:", error); // Log any errors during evaluation
                display.value = 'Error'; // Display an error message if evaluation fails
            }
        
      } else {
        display.value += value; // Append the clicked button's text to the display
      }
    });
});

// Function to tokenize the input expression into numbers and operators
function tokenize(expression) {
    const result = []; // Array to store tokens
    let numberbuffer = ""; // Buffer to accumulate digits of a number

    for (char of expression) {
        if (char >= "0" && char <= "9") {
            // If character is a digit, add it to the number buffer
            numberbuffer += char;
        } else if (numberbuffer.length > 0) {
            // If a non-digit is encountered, push the accumulated number to result
            result.push(numberbuffer);
            numberbuffer = ""; // Reset the buffer
        }
        if (operators.includes(char) || parenthesis.includes(char)) {
            // If character is an operator or parenthesis, add it to result
            result.push(char);
        }
    }
    if (numberbuffer.length > 0) {
        // Push any remaining number in the buffer to result
        result.push(numberbuffer);
    }
    return result; // Return the tokenized expression
}

// Function to get the difference in precedence between two operators
function hasHigherOrEqualPrecedence(op1,op2) {
    const precedence = {
        '+': 1, // Addition has precedence 1
        '-': 1, // Subtraction has precedence 1
        '*': 2, // Multiplication has precedence 2
        '/': 2  // Division has precedence 2
    };
    if (op1 in precedence && op2 in precedence) {
        return precedence[op1] >= precedence[op2]; // Return difference in precedence
    } else {
        return console.log("Error, not in precedence"); // Log error for invalid operator
    }
}

// Function to convert infix expression to postfix using Shunting Yard Algorithm
function shuntingYardAlgorithm(expression) {
    expression = tokenize(expression); // Tokenize the input expression
    let outputQueue = []; // Queue to store the postfix expression
    let operatorStack = []; // Stack to store operators

    for (let token of expression) {
        if (!isNaN(token)) {
            // If token is a number, push it to the output queue
            outputQueue.push(Number(token));
        } else if (operators.includes(token)) {
            // If token is an operator, handle operator precedence
            while (
                operatorStack.length > 0 &&
                operators.includes(operatorStack[operatorStack.length - 1]) &&
                hasHigherOrEqualPrecedence(operatorStack[operatorStack.length - 1], token)
            ) {
                outputQueue.push(operatorStack.pop()); // Pop higher/equal precedence operators to output queue
            }
            operatorStack.push(token); // Push current operator to stack
        } else if (token === "(") {
            // Push '(' directly to operator stack
            operatorStack.push(token);
        } else if (token === ")") {
            // Pop operators until '(' is found
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== "("
            ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.pop(); // Remove '(' from stack
        }
    }

    // Pop any remaining operators to output queue
    while (operatorStack.length > 0) {
        outputQueue.push(operatorStack.pop());
    }

    return outputQueue; // Return the postfix expression
}
// Function to evaluate the postfix expression
function evaluatePostFix(expression) {
    postfix = shuntingYardAlgorithm(expression); // Convert infix to postfix
    let stack = []; // Stack to evaluate the postfix expression
    for(token of postfix) 
    if(!isNaN(token)) // Check if token is a number
    {
       stack.push(token ); // Push number onto the stack
    } else 
    {    // Pop the top two values from the stack
        let val1 = stack.pop();
        let val2 = stack.pop();
        switch(token) 
        {
            // Perform the operation based on the operator token
            case "+":
                stack.push(val1 + val2);
                break;
            case "-":
                stack.push(val2 - val1);
                break;
            case "/":
                if (val1 === 0) {
                    throw new Error("Division by zero"); // Handle division by zero
                }
                stack.push(val2 / val1);
                break;
            case "*":
                stack.push(val1 * val2);
                break;

        }
    }
    // The evaluated value is the one left in the stack
    return stack.pop();
}
