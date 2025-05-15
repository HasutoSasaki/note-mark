import { contextBridge, ipcRenderer } from 'electron'
import { GetNotes, ReadNote } from '../shared/types'

if (!process.contextId) {
  throw new Error('contextIsolation must be enabled in ')
}

try {
  contextBridge.exposeInMainWorld('context', {
    locale: navigator.language,
    getNotes: (...args: Parameters<GetNotes>) => ipcRenderer.invoke('getNotes', ...args),
    readNote: (...args: Parameters<ReadNote>) => ipcRenderer.invoke('readNote', ...args),
  })
} catch (error) {
  console.error('Failed to expose contextBridge:', error)

}