const {
    contextBridge,
    ipcRenderer
} = require('electron');

contextBridge.exposeInMainWorld('API', {
    getData: (query) => ipcRenderer.invoke('get-data', query),
    postData: (url, data) => ipcRenderer.invoke('post-data', url, data),
    putData: (url, data) => ipcRenderer.invoke('put-data', url, data),
    patchData: (url, data) => ipcRenderer.invoke('patch-data', url, data)

    //     // getData: (query) => ipcRenderer.invoke('get-data', query),
    //     // editItem: (item) => ipcRenderer.invoke('edit-item', item),
    //     // deleteItem: (item) => ipcRenderer.invoke('delete-item', item),
    //     // addItem: (newItem) => ipcRenderer.invoke('add-item', newItem),
    //     // showConfirmDialog: (message) => ipcRenderer.invoke('show-confirm-dialog', message),
    //     // // showEditPrompt: (message, defaultValue) => ipcRenderer.invoke('show-edit-prompt', message, defaultValue),
    //     // loadInitialData: () => ipcRenderer.invoke('load-initial-data'),
    //     // getAIResponse: (prompt) => ipcRenderer.invoke('get-ai-response', prompt),
    //     // onDataUpdatedByTool: (callback) => ipcRenderer.on('data-updated-by-tool', callback),
    //     // publishToSupabase: () => ipcRenderer.send('publish')
});