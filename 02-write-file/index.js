const readline = require('node:readline');
const { stdin, stdout } = process;
const fs = require('fs');
const path = require('path');

const read = readline.createInterface({ input: stdin, output: stdout});
const writeToFile = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('For exit type key word "exit" or press Ctrl+C\n')
stdout.write('Enter your phrases below:\n');
read.on('line', (line) => {
  if (line.toString().trim() === 'exit') {
    read.close();
  } else {
    writeToFile.write(`${line}\n`)
  }
})
read.on('close', () => {
  stdout.write(`Thanks! We wrote your phrases on ${path.join(__dirname, 'text.txt')} file`);
  process.kill(0);
})



// const { stdin, stdout } = process;
// const fs = require('fs');
// const path = require('path');

// const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

// stdout.write('For exit type key word "exit" or press Ctrl+C\n')
// stdout.write('Enter your phrases below:\n');
// stdin.on('data', (data) => {
//   if (data.toString().trim() === 'exit') {
//     process.exit();
//   } else {
//     output.write(data)
//   }
// });
// process.on('exit', () => {
//   stdout.write(`Thanks! We wrote your phrases on ${path.join(__dirname, 'text.txt')} file`);
//   process.kill(0);
// });
// process.on('SIGINT', () => {
//   stdout.write(`Thanks! We wrote your phrases on ${path.join(__dirname, 'text.txt')} file`);
//   process.kill(0);
// });
