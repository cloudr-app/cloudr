interface Obj {
  [key: string]: string
}

export interface FunctionsEvent {
  path: string
  httpMethod: string
  queryStringParameters: Obj
  multiValueQueryStringParameters: Obj
  headers: Obj
  multiValueHeaders: Obj
  isBase64Encoded: boolean
}

export type Handler = (
  event: FunctionsEvent
) => Promise<{ statusCode: number; body?: string }>
