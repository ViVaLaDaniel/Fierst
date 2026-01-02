export {}

console.log("Background service worker loaded")

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "DOWNLOAD_IMAGE") {
    const { url, filename } = message

    console.log(`Received download request for: ${filename}`)

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: false,
      conflictAction: "uniquify"
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Background download failed:", chrome.runtime.lastError.message)
        sendResponse({ success: false, error: chrome.runtime.lastError.message })
      } else {
        console.log(`Download started with ID: ${downloadId}`)
        sendResponse({ success: true, downloadId })
      }
    })

    // Return true to indicate we wish to send a response asynchronously
    return true
  }
})
