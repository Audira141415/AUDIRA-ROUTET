import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("App Updater APIs", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.unstubAllEnvs();
  });

  it("GET /api/version returns version status and isElectron flag", async () => {
    process.env.ELECTRON_MODE = "1";
    const { GET } = await import("../../src/app/api/version/route.js");
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("currentVersion");
    expect(data).toHaveProperty("hasUpdate");
    expect(data.isElectron).toBe(true);
  });

  it("POST /api/version/update triggers IPC in Electron mode", async () => {
    process.env.ELECTRON_MODE = "1";
    const processSendSpy = vi.fn();
    global.process.send = processSendSpy;

    const { POST } = await import("../../src/app/api/version/update/route.js");
    const response = await POST();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.message).toContain("Triggered update in desktop app");
    expect(processSendSpy).toHaveBeenCalledWith({ type: "ELECTRON_TRIGGER_UPDATE" });

    delete global.process.send;
  });
});
