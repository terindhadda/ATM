/*var init_savings_balance = getSavingsBalance();
var init_chequing_balance = getChequingBalance();
var account_num = getAccountNum();

*/
function init_money(users){
    setSavingsBalance(init_savings_balance);
    setChequingBalance(init_chequing_balance);
    setAccountNum(account_num);
}

function getSavingsBalance(){
    var users = getSessionStorage();
    return users['savingsBalance'];
}

function getPIN(){
    var users = getSessionStorage();
    return users['accountPin'];
}


function getChequingBalance(){
    var users = getSessionStorage();
    return users['chequingBalance'];
}

function getChequingTransactions(){
    var users = getSessionStorage();
    return users['chequingTransactions'];
}

function getSavingsTransactions(){
    var users = getSessionStorage();
    return users['savingsTransactions'];
}

function setSavingsBalance(amt){
    var users = getSessionStorage();
    users['savingsBalance'] = amt;
    updateSessionStorage(users);
}

function setPIN(PIN){
    var users = getSessionStorage();
    users['accountPin'] = PIN;
    updateSessionStorage(users);
}

function setChequingBalance(amt){
    var users = getSessionStorage();
    users['chequingBalance'] = amt;
    updateSessionStorage(users);
}

function updateSessionStorage(user){

    sessionStorage.setItem("User", JSON.stringify(user));
}

function getSessionStorage(){
    return JSON.parse(sessionStorage.getItem('User'));
}

function getAccountNum(){
    var users = getSessionStorage();
    return users['accountNumber'];
}

function setAccountNum(num){
    var users = getSessionStorage();
    users['accountNumber'] = num;
    updateSessionStorage(users);
}


function depositMoneyUpdate(amt, action){
    if (amt < 0) {
        alert("You cannot deposit less than zero dollars!");
        return false;
    }
    if (amt == 0) {
        alert("You cannot deposit zero dollars!");
        return false;
    }
    if (action == "CHQ"){
        //update chequing
        old_amt = parseFloat(getChequingBalance());
        new_amt = old_amt + parseFloat(amt);

        setChequingBalance(new_amt);
        addTransaction(amt, action, '+');
        location.href = 'depositEnvelope.html' ;
    } else {
        //update savings
        old_amt = parseFloat(getSavingsBalance());
        new_amt = old_amt + parseFloat(amt);

        setSavingsBalance(new_amt);
        addTransaction(amt, action, '+');
        location.href = 'depositEnvelope.html' ;
    }
}

function withdrawMoneyUpdate(amt, action, storage){
    if (amt < 0) {
        alert("You cannot withdraw less than zero dollars!");
        return false;
    }
    if (amt == 0) {
        alert("You cannot withdraw zero dollars!");
        return false;
    }
    if (amt.split('.').length > 2 || amt.match(/[a-zA-Z,\/#!$%\^&\*;:{}=\-_`~()]/g)){
        alert("Invalid Amount inputted!");
        return false;
    }

    if (action == "CHQ"){
        //update chequing
        old_amt = parseFloat(getChequingBalance());
        new_amt = old_amt - parseFloat(amt);
        console.log(new_amt)

        if (amt > getChequingBalance()){
            alert("You cannot withdraw more money than you have in your chequing account!, You tried to withdraw $" +amt+ ' but you only have $' + getChequingBalance());
            return false;
        } else {
            setChequingBalance(new_amt);
            addTransaction(amt, action, '-');
            location.href = 'moneyPrinted.html' ;
        }
    } else {
        //update savings
        old_amt = parseFloat(getSavingsBalance());
        new_amt = old_amt - parseFloat(amt);

        if (amt > getSavingsBalance()){
            alert("You cannot withdraw more money than you have in your savings account!");
            return false;
        } else {
            setSavingsBalance(new_amt);
            addTransaction(amt, action, '-');
            location.href = 'moneyPrinted.html' ;
        }
    }
}

function addTransaction(amount, action, plusOrMinus){
    var users = getSessionStorage();

    if (action == "CHQ") {
        if (plusOrMinus == "+") {
            transaction = [Date(), 0, amount, getChequingBalance()]
        } else {
            transaction = [Date(), amount, 0, getChequingBalance()]
        }
        console.log(transaction);
        users['chequingTransactions'].push(transaction);
    }else{
            if (plusOrMinus == "+")
            {
                transaction = [Date(),0,amount,getSavingsBalance()]
            }else{
                transaction = [Date(),amount,0,getSavingsBalance()]
            }
        users['savingsTransactions'].push(transaction);
    }
    updateSessionStorage(users)
}

function transferMoney(from_acc ,to_acc , amt){
    if (from_acc == to_acc){
        alert("Sorry, you cannot transfer money from and to the same account");
        return false;
    }

    if (from_acc.split('-')[0] == "CHQ" && to_acc.split('-')[0]== "SAV"){
        if (amt > getChequingBalance()){
            alert("Sorry, you cannot transfer more money than you have in your chequing account!");
            return false;
        }
        depositMoneyUpdate(amt, "SAV");
        withdrawMoneyUpdate(amt, "CHQ");
    } else {
        if (amt > getSavingsBalance()){
            alert("Sorry, you cannot transfer more money than you have in your saving account!");
            return false;
        }
        depositMoneyUpdate(amt, "CHQ");
        withdrawMoneyUpdate(amt, "SAV");

    }
    location.href = 'transferProcessed.html' ;
}
