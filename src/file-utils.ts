import * as fs from 'fs';
import * as path from 'path';

export const walk = (dir: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
};

export const deleteFolderIfExists = (folderPath: string) => {
  if (fs.existsSync(folderPath)) {
    fs.unlinkSync(folderPath);
  }
};

export const createFolder = (folderPath: string) => {
  fs.mkdirSync(folderPath);
};

const copyFileSync = (source: string, target: string) => {
  let targetFile = target;
  // if target is a directory a new file with the same name will be created
  if (fs.existsSync(target)) {
    if (fs.lstatSync(target).isDirectory()) {
      targetFile = path.join(target, path.basename(source));
    }
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
};

export const copyFolderRecursiveSync = (source: string, target: string) => {
  let files = [];

  // check if folder needs to be created or integrated
  const targetFolder = path.join(target, path.basename(source));
  if (!fs.existsSync(targetFolder)) {
    fs.mkdirSync(targetFolder);
  }
  // copy
  if (fs.lstatSync(source).isDirectory()) {
    files = fs.readdirSync(source);
    files.forEach(file => {
      const curSource = path.join(source, file);
      if (fs.lstatSync(curSource).isDirectory()) {
        copyFolderRecursiveSync(curSource, targetFolder);
      } else {
        copyFileSync(curSource, targetFolder);
      }
    });
  }
};

export const readFileContent = (filePath: string) => {
  return fs.readFileSync(filePath).toString();
};

export const createFileAndWriteContent = (
  filePath: string,
  content: string
) => {
  fs.openSync(filePath, 'w');
  fs.writeFileSync(filePath, content);
};
