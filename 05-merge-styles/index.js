const path = require('path');
const promises = require('fs/promises');
const fs = require('fs');
const { constants } = require('fs');

function createBundle() {
  const targetDir = path.join(__dirname, 'styles');
  const targetFile = path.join(__dirname, 'project-dist', 'bundle.css');
  fs.access(targetFile, constants.F_OK, (err) => {
    if(!err) fs.truncate(targetFile, (err) => {
      if(err) throw Error;
    })
  })

  const dirFiles = promises.readdir(targetDir);

  dirFiles.then(
    result => {
      result.forEach(file => {
        const filePath = path.join(targetDir, file);

        fs.stat(filePath, (err, res) => {
          if(err) throw Error;
          if(!(res.isDirectory()) && (path.extname(file) == '.css')) {
            const readStream = fs.createReadStream(filePath, 'utf-8');
            readStream.on('data', (data) => fs.appendFile(targetFile, data, (err) => {
              if(err) throw Error;
            }));
          }
        })
      })
    },
    error => {
      if(error) throw Error;
    }
  )
  
}

createBundle();