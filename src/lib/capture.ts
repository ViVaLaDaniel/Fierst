/**
 * Capture the current active tab
 */
export async function captureTab(): Promise<string | null> {
  return new Promise((resolve) => {
    if (typeof chrome === "undefined" || !chrome.tabs || !chrome.tabs.captureVisibleTab) {
      console.error("Chrome Tab Capture API not available")
      resolve(null)
      return
    }

    // Capture the visible area of the current active tab in the current window
    chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        console.error("Capture failed:", chrome.runtime.lastError.message)
        resolve(null)
      } else {
        resolve(dataUrl)
      }
    })
  })
}
