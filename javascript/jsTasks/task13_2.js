let bankAccounts = [];
let jsonStr = JSON.stringify(bankAccounts);

// Load or initialize bankAccounts
if (localStorage.getItem("bankAccounts") === null) {
  localStorage.setItem("bankAccounts", jsonStr);
}

let currentAccount = null;
// Load account number counter
let no = localStorage.getItem("accountNo")
  ? parseInt(localStorage.getItem("accountNo"))
  : 526;

const str = "1800-2334-";

// DOM elements
let createAccountForm = document.getElementById("createAccountForm");
let loginForm = document.getElementById("loginForm");
let txtANo = document.getElementById("txtANo");
let txtName = document.getElementById("txtName");
let txtDOB2 = document.getElementById("txtDOB2");
let txtInitBalance = document.getElementById("txtInitBalance");

window.addEventListener("load", () => {
  bankAccounts = JSON.parse(localStorage.getItem("bankAccounts"));
  for (let i = 0; i < bankAccounts.length; i++) {
    let acc = bankAccounts[i];
    console.log(
      acc.accountNum,
      acc.name,
      new Date(acc.dob).toLocaleDateString()
    );
  }
});

window.addEventListener("beforeunload", function () {
  jsonStr = JSON.stringify(bankAccounts);
  localStorage.setItem("bankAccounts", jsonStr);
  localStorage.setItem("accountNo", no.toString());
});

function BankAccount(name, dob, initBalance) {
  this.accountNum = str + no;
  no++;
  this.name = name;
  this.dob = dob;
  this.balance = initBalance;
  this.transactionHistory = [
    {
      transactionId: 101,
      transactionStatus: "success",
      transactionRemark: "account Created",
      transactionDesc: `Account has been successfully created with ₹${initBalance}`,
      transactionDate: new Date(),
    },
  ];
}
function Transaction(status, remark, desc) {
  this.transactionId = currentAccount.transactionHistory[0].transactionId + 1;
  this.transactionStatus = status;
  this.transactionRemark = remark;
  this.transactionDesc = desc;
  this.transactionDate = new Date();
}

function funAccNo(e) {
  let value = e.currentTarget.value.replace(/-/g, "");
  let newValue = "";
  for (let i = 0; i < value.length; i++) {
    if (!isNaN(value[i])) {
      newValue += value[i];
    }
  }
  if (newValue.length > 4) {
    newValue = newValue.slice(0, 4) + "-" + newValue.slice(4);
  }
  if (newValue.length > 9) {
    newValue = newValue.slice(0, 9) + "-" + newValue.slice(9);
  }
  this.value = newValue.slice(0, 13);
}

txtANo.addEventListener("input", funAccNo);

function showcreateAccountForm() {
  createAccountForm.style.display = "block";
  loginForm.style.display = "none";
}
// btn Create Account handler
function createAccount() {
  let name = txtName.value;
  let dobStr = txtDOB2.value;
  let initBalance = txtInitBalance.value;

  if (name == "" || dobStr == "" || initBalance == "") return;

  let dob = new Date(dobStr).toLocaleDateString();
  let newAccount = new BankAccount(name, dob, initBalance);
  bankAccounts.push(newAccount);

  // Save immediately
  localStorage.setItem("bankAccounts", JSON.stringify(bankAccounts));
  localStorage.setItem("accountNo", no.toString());

  console.log(newAccount);
  createAccountForm.style.display = "none";
  loginForm.style.display = "block";
}

function clearAccounts() {
  if (confirm("Are you sure you want to clear all accounts?")) {
    localStorage.removeItem("bankAccounts");
    localStorage.removeItem("accountNo");
    alert("All account data cleared.");
    bankAccounts = [];
    no = 526;
    location.reload(); // Reload the page to reset UI
  }
}

// next code using jquery + js
$(document).ready(() => {
  // btn login handler
  $("input[value='Login']").click(() => {
    let accountNo = $("#txtANo").val();
    let dobStr = $("#txtDOB").val();
    let dob = new Date(dobStr).toLocaleDateString();
    if (accountNo === "" || dobStr === "") {
      return;
    }

    bankAccounts.forEach((account) => {
      if (accountNo == account.accountNum && dob == account.dob) {
        currentAccount = account;
      }
      // console.log(accountNo, account.accountNum);
      // console.log(accountNo == account.accountNum);
      // console.log(dob,account.dob);
      // console.log(dob==account.dob);
    });
    if (currentAccount) {
      alert(currentAccount.name + "welcome");
      $("#txtANo").val("");
      $("#txtDOB").val("");
      $("#loginForm").hide();
      $("#login").show();
      displayInfo(currentAccount);
    } else {
      $("#txtANo").val("");
      $("#txtDOB").val("");
      alert("invalild credientials");
    }

    // Combine the message into one string
    // alert(
    //   `jQuery is working perfectly!\nAccount No: ${accountNo}\nDOB: ${new Date(
    //     dobStr
    //   ).toLocaleDateString()}`
    // );
  });
  $("#txtTAccNo").get(0).addEventListener("input", funAccNo);

  // Hide all sections initially
  const sections = ["#divDeposit", "#divWithdraw", "#divTransfer"];
  sections.forEach((id) => $(id).hide());

  function showSection(sectionIdToShow) {
    sections.forEach((id) => {
      if (id === sectionIdToShow) {
        $(id).show();
      } else {
        $(id).hide();
      }
    });
  }

  // Event bindings
  $("#btnDeposit").click(() => showSection("#divDeposit"));
  $("#btnWithdraw").click(() => showSection("#divWithdraw"));
  $("#btnTransfer").click(() => showSection("#divTransfer"));

  $("#login").hide();

  function displayInfo(account) {
    $("#lblAccountNo").text(account.accountNum);
    $("#lblAccountHName").text(account.name);
    $("#lblDob").text(account.dob);
    $("#lblBalance").text(account.balance);
    showTransactionHistory(account);
  }
  function showTransactionHistory(account) {
    $("#transactionTableBody").html("");
    account.transactionHistory.forEach((history) => {
      console.log(history);
      const txDate = new Date(history.transactionDate);
      const timeString = txDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      const formattedDate = txDate.toLocaleDateString("en-US", {
        weekday: "long", // e.g., Monday
        year: "numeric", // e.g., 2025
        month: "long", // e.g., July
        day: "numeric", // e.g., 24
      });
      let tr = $(`<tr>
        <td>${history.transactionId}</td>
        <td>${formattedDate}</td>
        <td>${timeString}</td>
        <td>${history.transactionStatus}</td>
        <td>${history.transactionRemark}</td>
        <td>${history.transactionDesc}</td>
        </tr>`);
      $("#transactionTableBody").append(tr);
    });
  }

  $("#btnLogout").click(() => {
    if (confirm("are you sure to logout")) {
      $("#loginForm").show();
      $("#login").hide();
    } else {
      return;
    }
  });
  $("#btnDepositAmount").click(() => {
    let amount = Number($("#txtDepositAmount").val()); // रक्कम वाचतो आणि Number मध्ये convert करतो
    $("#txtDepositAmount").val("");
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    currentAccount.balance = Number(amount) + Number(currentAccount.balance);
    // खात्याचा balance अपडेट करतो

    let transaction = new Transaction(
      "success", // स्थिती: यशस्वी
      "Amount Deposited", // संक्षिप्त remark
      `₹${amount} deposited successfully. Your available balance is ₹${currentAccount.balance}.` // युजरला दिसणारा संदेश
    );

    currentAccount.transactionHistory.unshift(transaction); // transactionHistory मध्ये नवीन transaction सुरुवातीला टाकतो
    displayInfo(currentAccount);
  });
  $("#btnWithdrawAmount").click(() => {
    let amount = Number($("#txtWithdrawAmount").val());
    $("#txtWithdrawAmount").val("");

    if (isNaN(amount) || amount <= 0) {
      alert("⚠️ Please enter a valid amount greater than 0.");
      return;
    }

    if (amount <= currentAccount.balance) {
      currentAccount.balance -= amount;

      alert(
        `✅ ₹${amount} withdrawn successfully.\n💰 Remaining Balance: ₹${currentAccount.balance}`
      );

      let transaction = new Transaction(
        "success", // स्थिती: यशस्वी
        "Amount Withdraw",
        `✅ ₹${amount} withdrawn successfully.\n💰 Remaining Balance: ₹${currentAccount.balance}`
      );

      currentAccount.transactionHistory.unshift(transaction);
      
    } else {
      alert(
        `❌ Insufficient balance. Your current balance is ₹${currentAccount.balance}`
      );

      let transaction = new Transaction(
        "failed", // स्थिती: अयशस्वी
        "Insufficient balance",
        `❌ Insufficient balance. Your current balance is ₹${currentAccount.balance}`
      );

      currentAccount.transactionHistory.unshift(transaction);
    }
    displayInfo(currentAccount);
  });
});
