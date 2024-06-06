#!/usr/bin/env node

for (let i = 1; i <= 20; i++) {
  let string = "";

  if (i % 3 === 0) {
    string += "Fizz";
  }
  if (i % 5 === 0) {
    string += "Buzz";
  }
  string ||= i.toString();
  console.log(string);
}
