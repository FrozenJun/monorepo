declare namespace _ {
  interface LoDashStatic {
    defaultsDeepSafe(
      object: Record<string, any>,
      ...sources: Record<string, any>[]
    ): Record<string, any>
    assignWithObjectDeep(
      object: Record<string, any>,
      source: Record<string, any>
    ): Record<string, any>
    assignModelsWithObjectDeep(
      object: Record<string, any>,
      source: Record<string, any>,
      extraKeys?: string[]
    ): Record<string, any>
  }
  interface Object<T> {
    defaultsDeepSafe(...sources: Record<string, any>[]): _.Object<T>
    assignWithObjectDeep(source: Record<string, any>): _.Object<T>
    assignModelsWithObjectDeep(source: Record<string, any>, extraKeys?: string[]): _.Object<T>
  }
}
