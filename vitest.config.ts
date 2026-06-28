import { defineConfig } from "vitest/config";

// Unit test untuk logika murni (harga, validasi). Lingkungan node sudah cukup;
// tidak perlu jsdom karena tidak menguji komponen React di sini.
export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
