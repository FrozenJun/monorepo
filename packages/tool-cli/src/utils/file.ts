import { Tree } from '@angular-devkit/schematics/src/tree/interface'
import * as ts from 'typescript'
import { SchematicsException } from '@angular-devkit/schematics'

export function readIntoSourceFile(host: Tree, sourcePath: string): ts.SourceFile {
  const text = host.read(sourcePath)
  if (text === null) {
    throw new SchematicsException(`文件${sourcePath}不存在。`)
  }
  const sourceText = text.toString('utf-8')

  return ts.createSourceFile(sourcePath, sourceText, ts.ScriptTarget.Latest, true)
}

export function readIntoSourceText(host: Tree, sourcePath: string): string {
  const text = host.read(sourcePath)
  if (text === null) {
    throw new SchematicsException(`文件${sourcePath}不存在。`)
  }
  return text.toString('utf-8')
}

export function computeRelativePathByAbsolutePaths(sourcePath: string, targetPath: string) {
  const sourcePaths = sourcePath.split('/')
  const targetPaths = targetPath.split('/')
  let path = ''
  let isEndMatch = false
  sourcePaths.forEach((p, index) => {
    if (!isEndMatch && p === targetPaths[index]) {
      targetPaths.shift()
    } else {
      isEndMatch = true
      path += '../'
    }
  })
  path += targetPaths.join('/')
  return path
}
