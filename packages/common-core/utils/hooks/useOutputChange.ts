export const useOutputChange = (state: Record<string, any>) => {
  const onOutputChange = (stateName: string, output: Record<string, any>) => {
    state[stateName] = output
  }

  return {
    onOutputChange,
  }
}
