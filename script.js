'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2021-11-18T21:31:17.178Z',
    '2021-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2021-08-09T23:36:17.929Z',
    '2021-08-15T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-27T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////

// Functions

//✅✅✅✅✅✅✅✅

const formatMovementDates = function (date) {
  const calDaysPassed1 = (date1, date2) =>
    Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  const days2 = calDaysPassed1(new Date(), date);
  if (days2 === 0) return 'today';
  if (days2 === 1) return 'Yesterday';
  if (days2 <= 7) return `${days2} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
  //
  return new Intl.DateTimeFormat(locale).format(date);
};

// Functions

//✅✅✅✅✅✅✅✅

const numFormatAll = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
// Functions

//✅✅✅✅✅✅✅✅
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  console.log(acc.movements);
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    /* we are using loop over two array simultaneously */
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDates(date, acc.locale);

    /* number internationalizing of number */
    // const formatMovNum = new Intl.NumberFormat(acc.locale, {
    //   style: 'currency',
    //   currency: acc.currency,
    // }).format(mov);

    console.log(displayDate);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        
        <div class="movements__value">${numFormatAll(
          mov,
          acc.locale,
          acc.currency
        )}</div>

      </div>
    `;
    /* /* <div class="movements__value">${mov.toFixed(2)}€</div>  */
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//✅✅✅✅✅✅✅✅
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${numFormatAll(
    acc.balance,
    acc.locale,
    acc.currency
  )}`;
};

//✅✅✅✅✅✅✅✅
const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  //labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumIn.textContent = `${numFormatAll(incomes, acc.locale, acc.currency)}`;

  //✅✅✅✅✅✅✅✅
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  //labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;
  labelSumOut.textContent = `${numFormatAll(
    Math.abs(out),
    acc.locale,
    acc.currency
  )}`;

  //✅✅✅✅✅✅✅✅
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  //labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumInterest.textContent = `${numFormatAll(
    interest,
    acc.locale,
    acc.currency
  )}`;
};

//✅✅✅✅✅✅✅✅
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

//✅✅✅✅✅✅✅✅
const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

//✅✅✅✅✅✅✅✅
const startLoutOutTimer = function () {
  let time = 100;
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    //time--; // at this position log out at 1 sec
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }
    time--;
  };

  tick(); // this is for to start timer immediately after login
  const timer = setInterval(tick, 1000);
  // we we decleared function with in setinterval it does not call imediately
  // there is 1 sec delay
  return timer;
};
///////////////////////////////////////
// Event handlers
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
let currentAccount, timer;

/* currentAccount = account2;
updateUI(currentAccount);
containerApp.style.opacity = 100; */

let locale = navigator.language;
//console.log(locale);
// labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(now);

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    // creates dates
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year}, ${hour}:${min}`;

    // Experimenting API
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long',
    };
    console.log(currentAccount);
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);
    if (timer) clearInterval(timer);
    timer = startLoutOutTimer();
    // Update UI
    updateUI(currentAccount);
  }
});
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    timer = startLoutOutTimer();
  }
});
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  // const amount = Number(inputLoanAmount.value);
  const amount = Math.floor(inputLoanAmount.value);
  /*  as bank takes value in proper decimal */

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    // set timer
    setTimeout(function () {
      currentAccount.movements.push(amount);

      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
      // reset after any activity
      clearInterval(timer);
      timer = startLoutOutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
//➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖➖
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ Numbers ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/
/*  JavaScript,
all numbers are presented internally as floating point numbers. 
numbers are represented internally
in a 64 base 2 format.So that means that numbers are always stored
in a binary format.So basically, they're only composed of zeros and ones.
Now, in this binary form,it is very hard to represent some fractions
that are very easy to represent in the base 10 system that we are used to.
So base 10 is basically the numbers from zero to nine,
while binary is base 2 and so that's the numbers zero and one.
Okay? So as I was saying, there are certain numbers
that are very difficult to represent in base 2.
And one example of that is the fraction 0.1.*/
console.log('23');
console.log(Number('23'));
console.log(23 === 23.0); // true
console.log(1 / 10); // 0.1
console.log((0.1 * 3) / 10); // 0.030000000000000006
console.log(0.1 + 0.2 === 0.3); // false
// this is error in JS

// conversion
console.log(Number('23'));
console.log(+'23');

// Parsing
console.log(Number('30px')); // NaN
console.log(Number.parseInt('30px')); // 30 (a number)
console.log(Number.parseInt('e23')); // NaN

console.log(Number.parseFloat('2.5md')); // 2.5
console.log(Number.parseInt('2.5md')); // 2
console.log(Number.parseFloat('   2.5md    '));
console.log(parseFloat('2.5md')); // older way

console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number(+'20x')); // NaN
console.log(Number.isNaN(+'20x')); // true
console.log(Number.isNaN(23 / 0)); // false

/*  above methods is not a good number */
// we use this for value is a number
console.log(Number.isFinite(20)); //true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite('20x')); // false
console.log(Number.isFinite(+'20x')); // false
console.log(Number.isInteger(+'20x')); // false
console.log(Number.isInteger(23 / 0)); // false

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ Rounding Number and MAth ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/

console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 2)); // 5
console.log(8 ** (1 / 3)); // 2

console.log(Math.max(5, 1, 88, 3, 44, 22, 32)); // 88
console.log(Math.max(5, 1, '88', 3, 44, 22, 32)); // 88
console.log(Math.max(5, 1, '88x', 3, 44, 22, 32)); // NaN
console.log(Math.min(5, 1, 88, 3, 44, 22, 32)); // 1
console.log(Math.min(5, 1, 88, '3', 44, 22, 32)); //1
console.log(Math.min(5, 1, 88, '3mn', 44, 22, 32)); // NaN

console.log(Math.PI * Number.parseFloat('10px') ** 2);
console.log(Math.trunc(Math.random() * 6) + 1); // give no b/w 1 to 6

console.log(Math.round(23.3)); //23
console.log(Math.round(23.9)); //24

console.log(Math.ceil(23.3)); //24
console.log(Math.ceil(23.9)); //24

console.log(Math.floor(23.3)); //23
console.log(Math.floor(23.9)); //23
console.log(Math.floor('23.9')); //23

console.log(Math.floor(-23.9)); // -24
console.log(Math.trunc(-23.9)); // -23

// rounding decimals nubers
console.log((2.7).toFixed(0)); // 3
console.log((2.7).toFixed(3)); // 2.700
/* this method return a string */

console.log((2.7345).toFixed(2)); // 2.73
console.log(+(2.7345).toFixed(2)); // 2.73 (/* this value is a number */)
/* keep in mind

Does this here works
in a similar way than the string methods?
So this is a number, so it's a primitive, right?
And primitives actually don't have methods.
And so behind the scenes, JavaScript will do boxing.
And boxing is to basically transform this
to a number object, then call the method on that object.
And then once the operation is finished
it will convert it back to a primitive, okay? */

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ Rounding Number and MAth ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/

console.log(5 % 3); // 2 ( 2 is the reminder )
console.log(5 / 3); // 1.6666666666666667

/* for checking no is even or not */
const isEven = n => n % 2 === 0;
console.log(isEven(8)); // true
console.log(isEven(9)); // false
console.log(isEven(13)); // false
console.log(isEven(18)); // true

/*  lets apply this on our bank app */
labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (mov, i) {
    if (i % 2 === 0) mov.style.backgroundColor = 'orangered';
    if (i % 3 === 0) mov.style.backgroundColor = 'blue';
    console.log('clicked');
  });
});

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ BigInt ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/

console.log(2 ** 53 - 1); // 9007199254740991
console.log(2 ** 53 + 1); // 9007199254740992

console.log(979723975932573296593759362957392659362);
/* 9.797239759325733e+38 */
console.log(979723975932573296593759362957392659362n);

/* 979723975932573296593759362957392659362n  */
console.log(BigInt(979723975932573296593759362957392659362));

console.log(20n > 15); // true
console.log(20n === 20); // false
console.log(typeof 20n); // bigint
console.log(20n == '20'); // true

/*  Math operation not applicable with BigInt  */
// Division
console.log(11n / 3n);
console.log(10 / 3);

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ Creating Date and Time ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/

// create a Date
const now2 = new Date(); // Sat Aug 14 2021 09:13:02 GMT+0530 (India Standard Time)
console.log(2);
const now1 = new Date('Aug 15 2021 09:13:02');
console.log(now1); // Sun Aug 15 2021 09:13:02 GMT+0530 (India Standard Time)

console.log(new Date(1989, 10, 7, 4, 0, 0));
/* Tue Nov 07 1989 04:00:00 GMT+0530 (India Standard Time) */
/*  we get Nov instead of Oct as month is in zero based as noramal happen in js */

console.log(new Date(0));
/* Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time) */
console.log(new Date(3 * 24 * 60 * 60 * 1000));
/*  not working as this will result 3 * 24 * 60 * 60 * 1000=259200000 */
const future = new Date(1989, 10, 8, 19, 15, 34);
console.log(future);
/* Wed Nov 08 1989 19:15:34 GMT+0530 (India Standard Time) */
console.log(future.getFullYear()); // 1989
console.log(future.getMonth()); // 10
console.log(future.getDate()); // 8
console.log(future.getDay()); // 3 (in week day no)
console.log(future.toISOString()); // 1989-11-08T13:45:34.000Z
console.log(future.getTime()); // 626535934000
console.log(future.getSeconds()); // 34

console.log(Date.now()); // 1628914283365
future.setFullYear(2040);
console.log(future);
/* Thu Nov 08 2040 19:15:34 GMT+0530 (India Standard Time) */

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ calculations with dates ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/

// const future = new Date(1989, 10, 8, 19, 15, 34);
console.log(+future); // 2235995134000

const calDaysPassed = (date1, date2) =>
  Math.abs(date1 - date2) / (1000 * 60 * 60 * 24);
const days1 = calDaysPassed(new Date(2023, 3, 4), new Date(2023, 3, 24));
console.log(days1);

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/*♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦ Internationallizing Dates ♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦*/
/* The Intl.DateTimeFormat object enables language-sensitive date and time formatting. 
Creates a new Intl.DateTimeFormat object.*/

/* The Intl.NumberFormat object enables language-sensitive number formatting.
Intl.NumberFormat()
Creates a new NumberFormat object. 
var number = 3500;

console.log(new Intl.NumberFormat().format(number));
// → '3,500' if in US English locale*/

const num = 38845567.23;
const options = {
  style: 'currency',
  currency: 'EUR',
  unit: 'mile-per-hour',
  useGrouping: false,
};
console.log('US:    ', new Intl.NumberFormat('en-US').format(num));
/* US:     38,845,567.23 */
console.log(
  'Germany:    ',
  new Intl.NumberFormat('de-DE', options).format(num)
);
/* Germany:     38.845.567,23 mi/h */

/* apply that to our app */

//♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦♦
/* 177. Timers: setTimeout and setInterval */

// set time out
const ingredients = ['olives', 'spinesh'];
const pizzaOrder = setTimeout(
  (ing1, ing2) => console.log(`Here is your pizza with ${ing1} and ${ing2} 🍕`),
  3000,
  ...ingredients
);
if (ingredients.includes('spinesh')) clearTimeout(pizzaOrder);

// Setinterval
setTimeout(() => {
  setInterval(() => {
    const now = new Date();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const hour = now.getHours();
    const min = now.getMinutes();
    console.log();
  }, 1000);
}, 1000);
