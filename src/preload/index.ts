import { contextBridge, ipcRenderer } from 'electron'
import { GetNotes } from '../shared/types'

if (!process.contextId) {
  throw new Error('contextIsolation must be enabled in ')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
  })
} catch (error) {
  console.error('Failed to expose contextBridge:', error)

}