import * as ts from 'typescript'
import { Change, InsertChange, NoopChange } from './change'

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 * @param node
 * @param kind
 * @param max The maximum number of items to return.
 * @param recursive 递归查找， 即使该类型已经找到，也会递归查找直到最后一个子node
 * @return all nodes of kind, or [] if none is found
 */
export function findNodes(
  node: ts.Node,
  kind: ts.SyntaxKind,
  max = Infinity,
  recursive = false
): ts.Node[] {
  if (!node || max == 0) {
    return []
  }

  const arr: ts.Node[] = []
  if (node.kind === kind) {
    arr.push(node)
    max--
  }
  if (max > 0 && (recursive || node.kind !== kind)) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach((node) => {
        if (max > 0) {
          arr.push(node)
        }
        max--
      })

      if (max <= 0) {
        break
      }
    }
  }

  return arr
}

/**
 * Add Import `import { symbolName } from fileName` if the import doesn't exit
 * already. Assumes fileToEdit can be resolved and accessed.
 * @param fileToEdit (file we want to add import to)
 * @param symbolName (item to import)
 * @param fileName (path to the file)
 * @param isDefault (if true, import follows style for importing default exports)
 * @return Change
 */
export function insertImport(
  source: ts.SourceFile,
  fileToEdit: string,
  symbolName: string,
  fileName: string,
  isDefault = false,
  initPos = 0
): Change {
  const rootNode = source
  const allImports = findNodes(rootNode, ts.SyntaxKind.ImportDeclaration).filter(
    (node) => !node.decorators
  ) // 防止scss中的@import被错误的识别
  // 获取当前import语句，判断是否有和当前fileName相同的import
  const relevantImports = allImports.filter((node) => {
    // StringLiteral在这里就是fileName（from后面的值）
    const importFiles = node
      .getChildren()
      .filter((child) => child.kind === ts.SyntaxKind.StringLiteral)
      .map((n) => (n as ts.StringLiteral).text)
    return importFiles.filter((file) => file === fileName).length === 1
  })

  if (relevantImports.length > 0) {
    return new NoopChange()
  }

  const useStrict = findNodes(rootNode, ts.SyntaxKind.StringLiteral).filter(
    (n: ts.Node) => (n as ts.StringLiteral).text === 'use strict'
  )
  let fallbackPos = initPos
  if (useStrict.length > 0) {
    fallbackPos = useStrict[0].end
  }
  const open = isDefault ? '' : '{ '
  const close = isDefault ? '' : ' }'
  const insertAtBeginning = allImports.length === 0 && useStrict.length === 0
  const separator = insertAtBeginning ? '' : '\n'
  const toInsert =
    `${separator}import ${open}${symbolName}${close}` +
    ` from '${fileName}'${insertAtBeginning ? '\n' : ''}`
  return insertAfterLastOccurrence(allImports, toInsert, fileToEdit, fallbackPos)
}

/**
 * Insert `toInsert` after the last occurence of `ts.SyntaxKind[nodes[i].kind]`
 * or after the last of occurence of `syntaxKind` if the last occurence is a sub child
 * of ts.SyntaxKind[nodes[i].kind] and save the changes in file.
 *
 * @param nodes insert after the last occurence of nodes
 * @param toInsert string to insert
 * @param file file to insert changes into
 * @param fallbackPos position to insert if toInsert happens to be the first occurence
 * @param syntaxKind the ts.SyntaxKind of the subchildren to insert after
 * @return Change instance
 * @throw Error if toInsert is first occurence but fall back is not set
 */
export function insertAfterLastOccurrence(
  nodes: ts.Node[],
  toInsert: string,
  file: string,
  fallbackPos: number,
  syntaxKind?: ts.SyntaxKind
): Change {
  let lastItem: ts.Node | undefined
  for (const node of nodes) {
    if (!lastItem || lastItem.getStart() < node.getStart()) {
      lastItem = node
    }
  }
  if (syntaxKind && lastItem) {
    lastItem = findNodes(lastItem, syntaxKind).sort(nodesByPosition).pop()
  }
  if (!lastItem && fallbackPos == undefined) {
    throw new Error(`tried to insert ${toInsert} as first occurence with no fallback position`)
  }
  const lastItemPosition: number = lastItem ? lastItem.getEnd() : fallbackPos
  return new InsertChange(file, lastItemPosition, toInsert)
}

/**
 * Helper for sorting nodes.
 * @return function to sort nodes in increasing order of position in sourceFile
 */
function nodesByPosition(first: ts.Node, second: ts.Node): number {
  return first.getStart() - second.getStart()
}

/**
 * 获取text的缩进
 *
 * @param text 某项的fullText
 */
export function getTextIndentation(text: string) {
  if (text.match(/^\r?\n/)) {
    return text.match(/^\r?\n(\r?)\s*/)![0]
  } else {
    return ` ` // 不存在换行缩进时提供一个空格
  }
}

/**
 * 获取属性名为objectField的对象属性的node
 *
 * @param node ts.ObjectLiteralExpression
 * @param objectField 对象属性名称
 */
export function getObjectField(
  node: ts.ObjectLiteralExpression,
  objectField: string
): ts.ObjectLiteralElement[] {
  return (
    node.properties
      .filter((prop) => ts.isPropertyAssignment(prop))
      // Filter out every fields that's not "objectField". Also handles string literals
      // (but not expressions).
      .filter((prop: ts.Node) => {
        const name = (prop as ts.PropertyAssignment).name
        return (ts.isIdentifier(name) || ts.isStringLiteral(name)) && name.getText() === objectField
      })
  )
}

/**
 * 获取source中的所有node
 * @param sourceFile The source file object.
 * @returns {Observable<ts.Node>} An observable of all the nodes in the source.
 */
export function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[] {
  const nodes: ts.Node[] = [sourceFile]
  const result = []

  while (nodes.length > 0) {
    const node = nodes.shift()

    if (node) {
      result.push(node)
      if (node.getChildCount(sourceFile) >= 0) {
        nodes.unshift(...node.getChildren())
      }
    }
  }

  return result
}

/**
 * 确认一个import是否早就存在
 */
export function isImported(
  source: ts.SourceFile,
  classifiedName: string,
  importPath: string
): boolean {
  const allNodes = getSourceNodes(source)
  const matchingNodes = allNodes
    .filter((node) => node.kind === ts.SyntaxKind.ImportDeclaration)
    .filter(
      (imp: ts.Node) =>
        (imp as ts.ImportDeclaration).moduleSpecifier.kind === ts.SyntaxKind.StringLiteral
    )
    .filter((imp: ts.Node) => {
      return ((imp as ts.ImportDeclaration).moduleSpecifier as ts.StringLiteral).text === importPath
    })
    .filter((imp: ts.Node) => {
      if (!(imp as ts.ImportDeclaration).importClause) {
        return false
      }
      const nodes = findNodes(
        (imp as ts.ImportDeclaration).importClause!,
        ts.SyntaxKind.ImportSpecifier
      ).filter((n) => n.getText() === classifiedName)

      return nodes.length > 0
    })

  return matchingNodes.length > 0
}
