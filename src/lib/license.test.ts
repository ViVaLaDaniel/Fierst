import { describe, it, expect, vi } from "vitest"
import { isProUser, validateLicense } from "./license"

// Mock chrome.storage.sync
const mockGet = vi.fn()
global.chrome = {
  storage: {
    sync: {
      get: mockGet
    }
  }
} as unknown as typeof chrome

describe("License Logic", () => {
  it("should return false for isProUser when no license is stored", async () => {
    mockGet.mockResolvedValueOnce({})
    const result = await isProUser()
    expect(result).toBe(false)
  })

  it("should return true for isProUser when a valid license is stored", async () => {
    mockGet.mockResolvedValueOnce({
      sb_pro_license: { isValid: true }
    })
    const result = await isProUser()
    expect(result).toBe(true)
  })

  it("should validate the test email as pro", async () => {
    const result = await validateLicense("test@example.com")
    expect(result.valid).toBe(true)
  })

  it("should handle failed validation for unknown emails", async () => {
    // Note: This would normally hit Firebase, so we expect failure if not configured
    const result = await validateLicense("unknown@example.com")
    expect(result.valid).toBe(false)
  })
})
