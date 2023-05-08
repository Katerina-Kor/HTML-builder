const path = require('path');
const fs = require('fs');
const promises = require('fs/promises');
const { constants } = require('fs');

function buildPage() {

  function createHtmlFile() {
    let template = '';
    const regExp = /\{\{(.+?)\}\}/gi;
    const readTemplate = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    readTemplate.on('data', (chunk) => template += chunk);

    readTemplate.on('end', () => {
      let arr;
      let myArray = [];
      while ((arr = regExp.exec(template)) !== null) {
        myArray.push([arr[0], arr[1]]);
      }

      myArray.forEach(item => {
        promises.readFile(path.join(__dirname, 'components', `${item[1]}.html`), 'utf-8')
        .then(
          data => {
            template = template.replace(item[0], data);
            promises.mkdir(path.join(__dirname, 'project-dist'), {recursive: true});
            const writeStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'index.html'));
            writeStream.on('open', () => {
            writeStream.write(template);
      })
          },
          error => {
            if(error) throw Error;
          }
        )
      });
    });
  }

  function createStyleFile() {
    const targetDir = path.join(__dirname, 'styles');
    const targetFile = path.join(__dirname, 'project-dist', 'style.css');
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

  function copyDir(dirName, copyDirName) {

    const copyDirProm = promises.mkdir(copyDirName, {recursive: true});
    copyDirProm.catch(error => console.log(error));

    const initialDirFiles = promises.readdir(dirName);
    initialDirFiles.then(
      result => {
        result.forEach(file => {
          let filePath = path.join(dirName, file);
          fs.stat(filePath, (err, res) => {
            if(err) throw Error;
            if(res.isDirectory()) {
              copyDir(filePath, path.join(copyDirName, file));
            } else {
              let src = path.join(dirName, file);
              let dest = path.join(copyDirName, file);
              promises.copyFile(src, dest);
            }
          })
        })
      },
      error => console.log(error)
    )
  }

  createHtmlFile();
  createStyleFile();
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist', 'assets'));
}

buildPage();