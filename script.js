'use strict';
// data

const account1 = {
    owner: 'Deepali Agarwal',
    movements: [2000, -400, 3000, -1000, 1500, 2000, -20, 50],
    interestRate: 0.4,
    pin: 1111,
    movementsDates: [
        "2022-03-02T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-07-26T17:01:17.194Z",
        "2020-07-28T23:36:17.929Z",
        "2020-08-01T10:51:36.790Z",
      ],
      currency: "INR",
      locale: "hi-IN",
};

const account2 = {
    owner: 'Aditya Tripathi',
    movements: [5000, 400, -3000, 1200, 1700, -2000, 200, 60],
    interestRate: 0.3,
    pin: 2222,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
      ],
      
      currency: "INR",
      locale: "hi-IN",
};

const account3 = {
    owner: 'Shailesh Verma',
    movements: [200, 400, 3000, 1000, -1500],
    interestRate: 0.5,
    pin: 3333,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z"
      ],
      
      currency: "EUR",
      locale: "pt-PT",
};

const account4 = {
    owner: 'Shivani Sharma',
    movements: [1300, -400, 4000, -1000],
    interestRate: 0.4,
    pin: 4444,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z"
      ],
      
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

const username = document.querySelector('.user_login');
const psswrd = document.querySelector('.user-psswrd');
const loginBtn = document.querySelector('.login_btn');
const welcomeMessage = document.querySelector('.Message');
const labelDate = document.querySelector('.date');
const body = document.querySelector('.app');
const movements = document.querySelector('.movements');
const balance_value = document.querySelector('.balance_value');
const inValue = document.querySelector('.summary_in');
const outValue = document.querySelector('.summary_out');
const interestValue = document.querySelector('.summary_interest');
const sortBtn = document.querySelector('.btn-sort');

const transferAcc = document.querySelector('.form_input_to');
const transferAmount = document.querySelector('.form_input_amount');
const transferBtn = document.querySelector('.form_btn_transfer');

const loanBtn = document.querySelector('.form_btn_loan');
const loanAmount = document.querySelector('.form_input_loan_amount');

const closeBtn = document.querySelector('.form_btn_close');
const closeUser = document.querySelector('.close_user');
const closePin = document.querySelector('.close_pin');

const labelTimer = document.querySelector('.timer');

let currentAccount;

// const date = new Date();
// const day = `${now.getDate()}`.padStart(2,0);
// const month = `${now.getMonth()+1}`.padStart(2,0);
// const year = now.getFullYear();
// const hour = now.getHours();
// const min = now.getMinutes();

// labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;
const now = new Date();
const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year:'numeric',
    // month:'long',
    // year: '2-digit'
}
const datebar = acc => {
    
// const locale = navigator.language;
// console.log(locale);

labelDate.textContent = new Intl.DateTimeFormat(acc.locale, options).format(now);
}
const createUserNames = accs => {
    accs.forEach(acc => {
        acc.username = acc.owner.toLowerCase().split(' ').map(name => name[0]).join('');
    });
};

createUserNames(accounts);

const updateDetails = function(acc) {
    dispMovements(currentAccount, false);
totalBalance(currentAccount);
summaryBalance(currentAccount);
}
const startTimer = function() {
    

    const tick = function() {
        const min = `${Math.floor(t/60).toFixed(0)}`.padStart(2,0);
        const sec = `${t%60}`.padStart(2, 0);
        labelTimer.textContent = `${min}:${sec}`;
        if(t===0){
            clearInterval(timer);
                body.style.opacity = '0';
                welcomeMessage.textContent = `Log In to get started!`;
        }
        t--;
    }
    let t = 600;
    tick();
    const timer = setInterval(tick, 1000);
    return timer;
}

let timer;
let deposit = 0;
let withdrawal = 0;

const calcDate = (movementDate, locale) => {
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1)/(1000*60*60*24));
    const daysPassed = calcDaysPassed(new Date(), movementDate);
    console.log(daysPassed);
    if(daysPassed === 0) return `Today`;
    if(daysPassed === 1) return `Yesterday`;
    if(daysPassed <= 7) return `${daysPassed} days ago`;
    // const dateS = new Date(movementDate);
    //     const day = `${dateS.getDate()}`.padStart(2,0);
    //     const month = `${dateS.getMonth()+1}`.padStart(2,0);
    //     const year = `${dateS.getFullYear()}`;
    //     return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(movementDate);
}

const formatNum = (acc, val) => {
    return new Intl.NumberFormat(acc.locale, {
        style: 'currency',
        currency: acc.currency,
    }).format(val);
}
const dispMovements = (acc, sort) => {
    movements.innerHTML=``;
    
    const movs = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
    movs.forEach((mov, i) => {

        const date = calcDate(new Date(acc.movementsDates[i]), acc.locale);
        const formattedMov = formatNum(acc, mov);
        let html = ``;
        if(mov >= 0){
            deposit++;
            html = `<div class="movement_row">
            <div class="movement_type movement_deposit">${deposit} deposits</div>
            <div class="movement_date">${date}</div>
            <div class="movement_value">${formattedMov}</div>
            </div>`;
    }
        else if(mov < 0){
            withdrawal++;
            html = `<div class="movement_row">
            <div class="movement_type movement_withdrawal">${withdrawal} withdrawals</div>
            <div class="movement_date">${date}</div>
            <div class="movement_value">${formattedMov}</div>
            </div>`;
        }
        movements.insertAdjacentHTML('afterbegin', html);
    });
};


const totalBalance = acc => {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov);
    const formattedBal = formatNum(acc, acc.balance);
    balance_value.textContent = `${formattedBal}`;
    
}


const summaryBalance = (acc) => {
    const incoming = acc.movements.filter(mov => mov > 0).reduce((sum, curr) => sum + curr, 0);
    const outgoing = acc.movements.filter(mov => mov < 0).reduce((sum, curr) => sum - curr, 0);
    const interest = acc.movements.filter(mov => mov > 0).map(deposit => (deposit*acc.interestRate)/100).filter(int => int >= 1).reduce((sum, int) => sum + int, 0);

    
    inValue.textContent = `${formatNum(acc, incoming)}`;
    outValue.textContent = `${formatNum(acc, outgoing)}`;
    interestValue.textContent = `${formatNum(acc, interest)}`;
};


const deposits = account1.movements.filter(mov => mov > 0);

// const balance = account1.movements.reduce((sum, cur, i, arr) => sum + cur, 0);
// console.log(balance);
loginBtn.addEventListener('click', function(e){
    e.preventDefault();
    currentAccount = accounts.find(acc =>acc.username === username.value);
    if(currentAccount != undefined && currentAccount.pin === Number(psswrd.value)){
    body.style.opacity = '1';
    welcomeMessage.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]} !`;

    username.value = psswrd.value = '';
    if(timer){
        clearInterval(timer);
        timer = startTimer();
    }
    // psswrd.blur();
    updateDetails(currentAccount);
    datebar(currentAccount);
    timer = startTimer();
}
});

transferBtn.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(transferAmount.value);
    const acc = accounts.find(accs => accs.username === transferAcc.value);
    transferAmount.value = transferAcc.value = '';
    if(amount > 0 && currentAccount.balance >= amount && acc != undefined){
        currentAccount.movements.push(-amount);
        acc.movements.push(amount);
        currentAccount.movementsDates.push(new Date());
        acc.movementsDates.push(new Date());
        updateDetails(currentAccount);
        clearInterval(timer);
    timer = startTimer();
    }
    
});

// loan is granted only when there is atleast one deposit with atleast 10% of the requested loan.
loanBtn.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Math.floor(loanAmount.value);
    if(amount > 0 && currentAccount.movements.some(mov => mov >= 0.1*amount)){
        currentAccount.movements.push(Number(amount));
        currentAccount.movementsDates.push(new Date());
        updateDetails(currentAccount);
    }
    loanAmount.value = '';
    clearInterval(timer);
    timer = startTimer();
});

closeBtn.addEventListener('click', function(e){
    e.preventDefault();
    if(currentAccount.username === closeUser.value && currentAccount.pin === Number(closePin.value)){
        const index = accounts.findIndex(acc => acc.username === currentAccount.username);
        accounts.splice(index, 1);
        body.style.opacity = 0;
        welcomeMessage.textContent = `Log In to get started!`;
    }
    closeUser.value = closePin.value = '';

});
let sortCurr = false;
sortBtn.addEventListener('click', function(e){
    sortCurr = !sortCurr;
    e.preventDefault();
    dispMovements(currentAccount, sortCurr);
});

// const allAccountAmount = accounts.map(acc => acc.movements).flat().reduce((sum, curr) => acc + mov, 0);
