
export class ApiError extends Error {

  constructor(message, { status, data, endpoint } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status ?? null;
    this.data = data ?? null;
    this.endpoint = endpoint ?? null;
  }
}


export class NetworkError extends ApiError {
  constructor(message = "Network error. Please check your connection and try again.", options = {}) {
    super(message, options);
    this.name = "NetworkError";
  }
}

export class TimeoutError extends ApiError {
  constructor(message = "Request timed out. Please try again.", options = {}) {
    super(message, options);
    this.name = "TimeoutError";
  }
}

export class AuthenticationError extends ApiError {
  constructor(message = "Authentication required. Please log in.", options = {}) {
    super(message, { ...options, status: options.status ?? 401 });
    this.name = "AuthenticationError";
  }
}

export class ValidationError extends ApiError {
  constructor(message = "Validation failed.", options = {}) {
    super(message, options);
    this.name = "ValidationError";
  }
}

export class ServerError extends ApiError {
  constructor(message = "An unexpected server error occurred. Please try again later.", options = {}) {
    super(message, options);
    this.name = "ServerError";
  }
}

