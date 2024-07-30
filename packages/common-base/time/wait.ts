export async function waitUntilExist(fn: () => boolean, maxWaitTime = 10000, intervalTime = 300) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (fn() || maxWaitTime < 0) {
          clearInterval(interval)
          resolve(true)
        }
        maxWaitTime = maxWaitTime - intervalTime
      }, intervalTime)
    })
  }