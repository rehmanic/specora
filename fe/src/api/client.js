import useAuthStore from "@/store/authStore";
import { ApiError, AuthenticationError, NetworkError, TimeoutError, ValidationError, ServerError, } from "./errors";


const API_BASE = process.env.NEXT_PUBLIC_API_URL;
const DEFAULT_TIMEOUT_MS = 15_000;
const RETRY_DELAY_MS = 1_000;
const MAX_RETRIES = 1;
const RETRYABLE_STATUSES = new Set([502, 503, 504]);


if (!API_BASE) {
  throw new Error("Missing NEXT_PUBLIC_API_URL environment variable.");
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function parseResponse(res) {
  
  if (res.status === 204) {
    return {};
  }

  const text = await res.text();
  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (err) {
    return { _raw: text };
  }
}

function classifyHttpError(res, data, endpoint) {
  const message =
    data?.message ||
    `Request failed (${res.status})`;

  const opts = { status: res.status, data, endpoint };

  if (res.status === 401) {
    return new AuthenticationError(message, opts);
  }
  if (res.status === 400 || res.status === 422) {
    return new ValidationError(message, opts);
  }
  if (res.status >= 500 && res.status < 600) {
    return new ServerError(message, opts);
  }
  return new ApiError(message, opts);
}

// ─── Core request function ───────────────────────────────────────────────────

/**
 * @param {string}  endpoint  – path relative to API_BASE (e.g. "/users/all")
 * @param {object}  options
 * @param {string}  [options.method="GET"]
 * @param {*}       [options.body]       – will be sent as-is (caller stringifies)
 * @param {object}  [options.headers]    – extra headers merged on top of defaults
 * @param {boolean} [options.auth=true]  – set false to skip Authorization header
 * @param {number}  [options.timeout]    – ms before abort (default 15 000)
 * @param {string}  [options.cache]      – e.g. "no-store"
 * @param {AbortSignal} [options.signal] – caller-provided abort signal
 * @param {boolean} [options.raw=false]  – if true, return the raw Response object
 * @returns {Promise<*>}
 */
async function request(endpoint, options = {}) {
  const {
    method = "GET",
    body,
    headers: extraHeaders = {},
    auth = true,
    timeout = DEFAULT_TIMEOUT_MS,
    cache,
    signal: externalSignal,
    raw = false,
    _retryCount = 0,
  } = options;

  // ── Auth token ──────────────────────────────────────────────────────────
  const headers = {
    Accept: "application/json",
    ...extraHeaders,
  };

  if (auth) {
    const { token } = useAuthStore.getState();
    if (!token) {
      throw new AuthenticationError(
        "Not authenticated. Please log in.",
        { endpoint }
      );
    }
    headers.Authorization = `Bearer ${token}`;
  }

  // ── Timeout via AbortController ─────────────────────────────────────────
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // If the caller also provided a signal, abort when either fires.
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", () => controller.abort(), {
        once: true,
      });
    }
  }

  try {
    const fetchOptions = {
      method,
      headers,
      signal: controller.signal,
    };

    if (body !== undefined) {
      fetchOptions.body = body;
    }
    if (cache) {
      fetchOptions.cache = cache;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

    // ── Return raw Response for blob downloads etc. ────────────────────
    if (raw) {
      if (!res.ok) {
        const data = await parseResponse(res);
        throw classifyHttpError(res, data, endpoint);
      }
      return res;
    }

    const data = await parseResponse(res);

    if (!res.ok) {
      // Retry idempotent GET requests on transient server errors
      if (
        method === "GET" &&
        RETRYABLE_STATUSES.has(res.status) &&
        _retryCount < MAX_RETRIES
      ) {
        await sleep(RETRY_DELAY_MS);
        return request(endpoint, { ...options, _retryCount: _retryCount + 1 });
      }

      throw classifyHttpError(res, data, endpoint);
    }

    return data;
  } catch (err) {
    // Already one of our custom errors – re-throw as-is
    if (err instanceof ApiError) {
      throw err;
    }

    // AbortController timeout
    if (err.name === "AbortError") {
      throw new TimeoutError("Request timed out. Please try again.", {
        endpoint,
      });
    }

    // Network-level failure (offline, DNS, CORS, etc.)
    if (err instanceof TypeError) {
      throw new NetworkError(
        "Network error. Please check your connection and try again.",
        { endpoint }
      );
    }

    // Anything else – wrap so callers always get an Error instance
    throw new ApiError(
      err?.message || "An unexpected error occurred.",
      { endpoint }
    );
  } finally {
    clearTimeout(timeoutId);
  }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export const api = {
  /**
   * GET request.
   * @param {string} endpoint
   * @param {object} [options]
   */
  get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "GET" });
  },

  /**
   * POST request with JSON body.
   * @param {string} endpoint
   * @param {*}      [body]
   * @param {object} [options]
   */
  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "POST",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PUT request with JSON body.
   * @param {string} endpoint
   * @param {*}      [body]
   * @param {object} [options]
   */
  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * PATCH request with JSON body.
   * @param {string} endpoint
   * @param {*}      [body]
   * @param {object} [options]
   */
  patch(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...options.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  /**
   * DELETE request.
   * @param {string} endpoint
   * @param {object} [options]
   */
  delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: "DELETE" });
  },

  /**
   * Upload FormData (file uploads).
   * Does NOT set Content-Type — the browser sets it with the boundary.
   * @param {string}   endpoint
   * @param {FormData} formData
   * @param {object}   [options]
   */
  upload(endpoint, formData, options = {}) {
    return request(endpoint, {
      ...options,
      method: "POST",
      body: formData,
      // Do not set Content-Type for FormData; browser adds multipart boundary
    });
  },

  /**
   * Raw request — returns the native Response object.
   * Useful for blob downloads (PDF/DOCX export).
   * @param {string} endpoint
   * @param {object} [options]
   */
  raw(endpoint, options = {}) {
    return request(endpoint, { ...options, raw: true });
  },
};
