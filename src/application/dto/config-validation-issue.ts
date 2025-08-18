interface ConfigValidationIssue {
  /**
   * Error code, e.g., "required", "type", "minimum"
   */
  code: string;

  /**
   * The specific property involved in the error
   */
  property: string;

  /**
   * Path to the property in the data
   */
  path: string;

  /**
   * Human-readable message
   */
  message: string;
}

export { ConfigValidationIssue };
