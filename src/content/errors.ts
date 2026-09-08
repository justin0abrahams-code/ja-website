export class ContentRepositoryError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class ContentConfigurationError extends ContentRepositoryError {}

export class ContentFetchError extends ContentRepositoryError {}

export class ContentValidationError extends ContentRepositoryError {}
