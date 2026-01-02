import { db } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export interface LicenseInfo {
  licenseKey: string // In Stripe context, this could be the Purchase ID or Email
  email: string
  activatedAt: string
  isValid: boolean
}

const STORAGE_KEY = "sb_pro_license"

// Check if user has Pro license
export async function isProUser(): Promise<boolean> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY)
    const license = result[STORAGE_KEY] as LicenseInfo | undefined
    return license?.isValid === true
  } catch {
    return false
  }
}

// Get stored license info
export async function getLicenseInfo(): Promise<LicenseInfo | null> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY)
    const license = result[STORAGE_KEY] as LicenseInfo | undefined
    return license || null
  } catch {
    return null
  }
}

// Validate purchase with Firebase (checking if email exists in 'pros' collection)
export async function validateLicense(email: string): Promise<{
  valid: boolean
  email?: string
  error?: string
}> {
  try {
    // For development/testing
    if (email === "test@example.com") {
      return { valid: true, email: "test@example.com" }
    }

    const docRef = doc(db, "pros", email.toLowerCase().trim())
    const docSnap = await getDoc(docRef)

    if (docSnap.exists() && docSnap.data()?.isValid) {
      return {
        valid: true,
        email: email
      }
    }

    return { 
      valid: false, 
      error: "No active Pro license found for this email. Make sure you used the same email during checkout." 
    }
  } catch (error) {
    console.error("License validation failed:", error)
    return { valid: false, error: "Network error or Firebase not configured. Please try again." }
  }
}

// Activate license and store it
export async function activateLicense(email: string): Promise<{
  success: boolean
  error?: string
}> {
  const validation = await validateLicense(email)

  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  const licenseInfo: LicenseInfo = {
    licenseKey: email, // Use email as key
    email: email,
    activatedAt: new Date().toISOString(),
    isValid: true
  }

  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: licenseInfo })
    return { success: true }
  } catch (error) {
    console.error("Failed to store license:", error)
    return { success: false, error: "Failed to save license locally" }
  }
}

// Remove license
export async function deactivateLicense(): Promise<void> {
  await chrome.storage.sync.remove(STORAGE_KEY)
}
