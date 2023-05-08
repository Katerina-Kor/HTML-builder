const promises = require('fs/promises');
const path = require('path');

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
    },
    error => console.log(error)
  )
}

copyDir(path.join(__dirname, 'files'));
