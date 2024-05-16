// Selectors
const addBtn = document.getElementById('add-btn');
const incomeInput = document.getElementById('income-input');
const addForm = document.getElementById('add-form');

// Result table
const yourIncomeTd = document.getElementById('your-income');
const yourExpensesTd = document.getElementById('your-expenses');
const remainingTd = document.getElementById('remaining');

// Expense form
const expenseForm = document.getElementById('expense-form');
const expenseAreaInput = document.getElementById('expense-area');
const dateInput = document.getElementById('date');
const amountInput = document.getElementById('amount');

// Expense Table
const expenseBody = document.getElementById('expense-body');
const clearBtn = document.getElementById('clear-btn');

// Variables
let incomes = 0;

// Array to store all expenses (JSON)
let expenseList = [];

// Events

// When the form submit button is clicked
addForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload
  incomes = incomes + Number(incomeInput.value); // Prevent string concatenation

  // Copy incomes to localStorage for persistence
  localStorage.setItem('incomes', incomes);

  // Reset input value
  addForm.reset();

  // Update the result table with changes
  calculateAndDisplay();
});

// When the page is loaded
window.addEventListener('load', () => {
  // Read incomes from local storage and assign to global variable
  incomes = Number(localStorage.getItem('incomes'));

  // Read expense list from local storage and assign to global array
  expenseList = JSON.parse(localStorage.getItem('expenses')) || [];

  // Write each expense object from the array to the DOM
  expenseList.forEach((expense) => writeExpenseToDOM(expense));

  // Set the date input to today's date
  dateInput.valueAsDate = new Date();

  // Calculate and display the changed values
  calculateAndDisplay();
});

// When the expense form is submitted
expenseForm.addEventListener('submit', (e) => {
  e.preventDefault(); // Prevent page reload

  // Create a new expense object with the entered values
  const newExpense = {
    id: new Date().getTime(), // Get the system time in milliseconds, acting as a unique identifier
    date: dateInput.value,
    area: expenseAreaInput.value,
    amount: amountInput.value,
  };

  // Add the new expense object to the array
  expenseList.push(newExpense);

  // Send the updated array to localStorage
  localStorage.setItem('expenses', JSON.stringify(expenseList));

  // Write the new expense to the DOM
  writeExpenseToDOM(newExpense);

  // Calculate and display the changed values
  calculateAndDisplay();

  // Reset the form inputs
  expenseForm.reset();
  dateInput.valueAsDate = new Date();
});

// Function to calculate and update the result table
const calculateAndDisplay = () => {
  const expenses = expenseList.reduce(
    (total, expense) => total + Number(expense.amount),
    0
  );

  yourIncomeTd.innerText = incomes;
  yourExpensesTd.innerText = expenses;
  remainingTd.innerText = incomes - expenses;
};

// Function to write an expense to the DOM
const writeExpenseToDOM = ({ id, amount, date, area }) => {
  expenseBody.innerHTML += `
  <tr>
    <td>${date}</td>
    <td>${area}</td>
    <td>${amount}</td>
    <td><i id=${id} class="fa-solid fa-trash-can text-danger"  type="button"></i></td>
  </tr>
  `;
};

// When any element in the expense table is clicked
expenseBody.addEventListener('click', (e) => {
  if (e.target.classList.contains('fa-trash-can')) {
    e.target.parentElement.parentElement.remove();

    const id = e.target.id;

    // Remove the corresponding expense object from the array
    expenseList = expenseList.filter((expense) => expense.id != id);

    // Update localStorage with the modified array
    localStorage.setItem('expenses', JSON.stringify(expenseList));

    // Recalculate and display the updated values
    calculateAndDisplay();
  }
});

// When the clear button is clicked
clearBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear?')) {
    // Clear the expense list in RAM
    expenseList = [];

    // Clear the income in RAM
    incomes = 0;

    // Clear all data in localStorage
    localStorage.clear();

    // Clear all expenses in the DOM
    expenseBody.innerHTML = '';

    // Clear the values in the result table in the DOM
    calculateAndDisplay();
  }
});
