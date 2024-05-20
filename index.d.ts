type JSONRPC = {
  jsonrpc?: "2.0"
}

export type JSONRequest = JSONRPC & {
  method: string
  params: unknown[]
  id?: number
}

export type JSONResponse = JSONRPC & {
  result?: unknown
  error?: {
    code: number
    message: string
    data?: unknown
  }
  id: number
}
