const promises = require('fs/promises');
const path = require('path');
const fs = require('fs');
const { error } = require('console');

function copyDir(dirName) {
  const copyDirName = path.join(path.dirname(dirName), `${path.basename(dirName)}-copy`);

  const copyDir = promises.mkdir(copyDirName, {recursive: true});
  copyDir.catch(error => console.log(error));

  const initialDirFiles = promises.readdir(dirName);
  initialDirFiles.then(
    result => {
      result.forEach(file => {
        let src = path.join(dirName, file);
        let dest = path.join(copyDirName, file);
        promises.copyFile(src, dest);
      })
      promises.readdir(copyDirName).then(
        res => {
          res.forEach(file => {
            if(!result.includes(file)) fs.rm(path.join(copyDirName, file), (error) => {
              if(error) throw Error;
            })
          })
        }
      )
    },
    error => console.log(error)
  )
}

copyDir(path.join(__dirname, 'files'));