import { contextBridge } from 'electron'

if (!process.contextId) {
  throw new Error('contextIsolation must be enabled in ')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
  })
} catch (error) {
  console.error('Failed to expose contextBridge:', error)

}