let txtAName = document.getElementById("txtAName");
let txtInitBalance = document.getElementById("txtInitBalance");
let txtDOB = document.getElementById("txtDOB");

let id = 101;
let accounts = [];

function BankAccount(name, dob, initBalance) {
  this.accountNumber = name.slice(0, 3).toUpperCase() + id;
  id++;
  this.accountHolderName = name;
  this.dob = dob;
  this.accountBalance = Number(initBalance);
}

function createAccount() {
  let name = txtAName.value.trim();
  let dob = txtDOB.value;
  let initBalance = Number(txtInitBalance.value);

  if (name === "" || dob === "" || txtInitBalance.value === "") {
    showToast("Error", "Please fill all fields", false);
  } else if (name.split(" ").length !== 3) {
    showToast("Error", "Full Name Required (First Middle Last)", false);
  } else if (initBalance < 500) {
    showToast("Error", "Minimum balance must be INR 500", false);
  } else {
    const newAccount = new BankAccount(name, dob, initBalance);
    accounts.push(newAccount);

    showToast("Success", `Account No: ${newAccount.accountNumber}<br>Name: ${newAccount.accountHolderName}<br>DOB: ${newAccount.dob}<br>Balance: ₹${newAccount.accountBalance}`, true);

    txtAName.value = "";
    txtDOB.value = "";
    txtInitBalance.value = "";
    showLoginForm(); // Switch back to login after creation
  }
}

function showCreateForm() {
  document.getElementById("creatAccountForm").classList.remove("hidden");
  document.getElementById("loginForm").classList.add("hidden");
}

function showLoginForm() {
  document.getElementById("loginForm").classList.remove("hidden");
  document.getElementById("creatAccountForm").classList.add("hidden");
}

function showToast(title, message, isSuccess = true) {
  const toastEl = document.getElementById("liveToast");
  const toastTitle = document.getElementById("toastTitle");
  const toastBody = document.getElementById("toastBody");

  toastTitle.textContent = title;
  toastBody.innerHTML = message;

  // Background color
  toastEl.classList.remove("bg-success", "bg-danger");
  toastEl.classList.add(isSuccess ? "bg-success" : "bg-danger");

  toastEl.querySelector(".toast-header").classList.remove("bg-success", "bg-danger");
  toastEl.querySelector(".toast-header").classList.add(isSuccess ? "bg-success" : "bg-danger");

  const toast = new bootstrap.Toast(toastEl);
  toast.show();
}
