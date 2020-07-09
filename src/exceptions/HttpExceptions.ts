class HttpExceptions extends Error {
  public status: number;
  public message: string;
  constructor (status?: number, message?: string) {
    super(message)
    this.status = status || 500
    this.message = message || 'Something went wrong'
  }
}

export default HttpExceptions
