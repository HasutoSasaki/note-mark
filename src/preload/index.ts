import { contextBridge } from 'electron'

if (!process.contextId) {
  throw new Error('contextIsolation must be enabled in ')
}

try {
  contextBridge.exposeInMainWorld('context', {
    //TODO
  })
} catch (error) {
  console.error('Failed to expose contextBridge:', error)

}