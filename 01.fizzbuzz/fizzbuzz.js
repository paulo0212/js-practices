#!/usr/bin/env node

let message = "";

for (let i = 1; i <= 20; i++) {
  if (i % 3 === 0) {
    message += "Fizz";
  }
  if (i % 5 === 0) {
    message += "Buzz";
  }
  message ||= i;
  console.log(message);
  message = "";
}
