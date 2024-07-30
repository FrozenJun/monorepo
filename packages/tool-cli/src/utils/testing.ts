import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing'
import { join } from 'path'

export interface AppRes {
  runner: SchematicTestRunner
  tree: UnitTestTree
}

export function createMousseRunner() {
  return new SchematicTestRunner('schematics', join(__dirname, '../collection.json'))
}

export async function createMousseApp(): Promise<AppRes> {
  const runner = createMousseRunner()
  const tree = await runner.runSchematicAsync('empty').toPromise()
  return { runner, tree }
}
