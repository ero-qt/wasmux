import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { describe, expect, test } from "vitest";

// wasmux makes a hard guarantee: nothing leaves the user's device.
// this file is the test-time gate that keeps that guarantee true.
// any time someone adds a network or storage primitive in production source,
// one of these tests fails and the regression is caught before merge.

interface Ban {
  readonly name: string;
  readonly pattern: RegExp;
}

// network primitives: production source must not initiate any i/o.
const BANNED_NETWORK: readonly Ban[] = [
  { name: "fetch(", pattern: /\bfetch\s*\(/ },
  { name: "XMLHttpRequest", pattern: /\bXMLHttpRequest\b/ },
  { name: "new WebSocket", pattern: /\bnew\s+WebSocket\b/ },
  { name: "new EventSource", pattern: /\bnew\s+EventSource\b/ },
  { name: ".sendBeacon", pattern: /\.sendBeacon\s*\(/ },
  { name: "importScripts(", pattern: /\bimportScripts\s*\(/ },
];

// storage primitives: only OPFS is allowed, and only under explicit user save.
const BANNED_STORAGE: readonly Ban[] = [
  { name: "localStorage", pattern: /\blocalStorage\b/ },
  { name: "sessionStorage", pattern: /\bsessionStorage\b/ },
  { name: "document.cookie", pattern: /\bdocument\.cookie\b/ },
  { name: "indexedDB", pattern: /\bindexedDB\b/i },
  { name: "caches.* (Cache API)", pattern: /\bcaches\.(open|match|delete|keys|has)\s*\(/ },
];

// sensor/hardware APIs: every one of these triggers a permission prompt.
const BANNED_HARDWARE: readonly Ban[] = [
  { name: "navigator.geolocation", pattern: /\bnavigator\.geolocation\b/ },
  { name: "navigator.bluetooth", pattern: /\bnavigator\.bluetooth\b/ },
  { name: "navigator.usb", pattern: /\bnavigator\.usb\b/ },
  { name: "navigator.serial", pattern: /\bnavigator\.serial\b/ },
  { name: "navigator.hid", pattern: /\bnavigator\.hid\b/ },
  { name: "navigator.serviceWorker", pattern: /\bnavigator\.serviceWorker\b/ },
];

const ALL_BANNED: readonly Ban[] = [...BANNED_NETWORK, ...BANNED_STORAGE, ...BANNED_HARDWARE];

// this test file references every banned token by name to define it. don't scan it.
const SKIP = new Set<string>([join("src", "privacy.test.ts")]);

function* walkSource(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const s = statSync(path);

    if (s.isDirectory()) {
      yield* walkSource(path);
      continue;
    }

    const ext = extname(path);
    if (ext === ".ts" || ext === ".tsx") {
      yield path;
    }
  }
}

const SOURCES = [...walkSource("src")].filter((p) => !SKIP.has(p));

describe("privacy: no banned APIs in production source", () => {
  for (const ban of ALL_BANNED) {
    test(`no \`${ban.name}\` anywhere in src/`, () => {
      const offenders: string[] = [];

      for (const file of SOURCES) {
        const content = readFileSync(file, "utf8");
        if (ban.pattern.test(content)) {
          offenders.push(relative(".", file));
        }
      }

      expect(offenders).toEqual([]);
    });
  }
});

describe("security: production _headers file", () => {
  const raw = readFileSync("public/_headers", "utf8");

  function hasHeader(name: string, value: string): boolean {
    const pattern = new RegExp(`^\\s+${name}:\\s*${value.replace(/[()]/g, "\\$&")}`, "im");
    return pattern.test(raw);
  }

  test("Cross-Origin-Opener-Policy is same-origin", () => {
    expect(hasHeader("Cross-Origin-Opener-Policy", "same-origin")).toBe(true);
  });

  test("Cross-Origin-Embedder-Policy is require-corp", () => {
    expect(hasHeader("Cross-Origin-Embedder-Policy", "require-corp")).toBe(true);
  });

  test("Cross-Origin-Resource-Policy is same-origin", () => {
    expect(hasHeader("Cross-Origin-Resource-Policy", "same-origin")).toBe(true);
  });

  test("frame-ancestors 'none' is set as HTTP header (not only meta)", () => {
    expect(hasHeader("Content-Security-Policy", "frame-ancestors 'none'")).toBe(true);
  });

  test("Referrer-Policy is no-referrer", () => {
    expect(hasHeader("Referrer-Policy", "no-referrer")).toBe(true);
  });

  test("X-Content-Type-Options is nosniff", () => {
    expect(hasHeader("X-Content-Type-Options", "nosniff")).toBe(true);
  });

  test("Permissions-Policy denies geolocation", () => {
    expect(raw).toContain("geolocation=()");
  });

  test("Permissions-Policy denies camera", () => {
    expect(raw).toContain("camera=()");
  });

  test("Permissions-Policy denies microphone", () => {
    expect(raw).toContain("microphone=()");
  });
});

describe("privacy: CSP in index.html", () => {
  const html = readFileSync("index.html", "utf8");
  const cspMatch = html.match(/<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"/i);
  const csp = (cspMatch?.[1] ?? "").replace(/\s+/g, " ").trim();

  function directive(name: string): string[] {
    const m = csp.match(new RegExp(`(?:^|;)\\s*${name}\\s+([^;]+)`));
    return m?.[1] ? m[1].trim().split(/\s+/) : [];
  }

  test("CSP meta tag is present", () => {
    expect(csp).not.toBe("");
  });

  test("default-src is 'self'", () => {
    expect(directive("default-src")).toEqual(["'self'"]);
  });

  test("connect-src restricts outbound to self + blob:", () => {
    expect(directive("connect-src").sort()).toEqual(["'self'", "blob:"]);
  });

  test("object-src is 'none'", () => {
    expect(directive("object-src")).toEqual(["'none'"]);
  });

  test("base-uri is 'none'", () => {
    expect(directive("base-uri")).toEqual(["'none'"]);
  });

  test("frame-ancestors is 'none'", () => {
    expect(directive("frame-ancestors")).toEqual(["'none'"]);
  });

  test("form-action is 'none'", () => {
    expect(directive("form-action")).toEqual(["'none'"]);
  });

  test("script-src has no 'unsafe-inline' and no 'unsafe-eval' (wasm-unsafe-eval is fine)", () => {
    const values = directive("script-src");
    expect(values).not.toContain("'unsafe-inline'");
    expect(values).not.toContain("'unsafe-eval'");
  });

  test("no remote origins in any fetch directive", () => {
    const fetchDirectives = [
      "default-src",
      "script-src",
      "style-src",
      "img-src",
      "media-src",
      "font-src",
      "connect-src",
      "worker-src",
      "manifest-src",
    ];

    for (const name of fetchDirectives) {
      for (const value of directive(name)) {
        expect(value, `${name} contains remote origin "${value}"`).not.toMatch(/^https?:/);
      }
    }
  });
});
