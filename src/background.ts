/**
 * Background Service Worker for Screenshot Beautifier
 */

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "DOWNLOAD_IMAGE") {
    const { url, filename } = message.payload

    console.log("Background capturing download request:", filename)

    chrome.downloads.download({
      url: url,
      filename: filename,
      conflictAction: "uniquify",
      saveAs: false
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        console.error("Download failed in background:", chrome.runtime.lastError.message)
        sendResponse({ success: false, error: chrome.runtime.lastError.message })
      } else {
        console.log("Download started:", downloadId)
        sendResponse({ success: true, downloadId })
      }
    })

    return true // Keep channel open for async response
  }
})
