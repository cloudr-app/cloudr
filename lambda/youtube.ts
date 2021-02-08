import { Handler } from "./types"

import ytdl from "ytdl-core"

const origin = "https://cloudr.app"
export const handler: Handler = async event => {
  const { queryStringParameters: query } = event
  const headers = {
    "access-control-allow-origin": origin,
  }

  const reqOrigin = event.headers?.origin || ""
  if (reqOrigin.toLowerCase() !== origin)
    return {
      headers,
      statusCode: 401,
    }

  if (!ytdl.validateID(query.id))
    return {
      statusCode: 400,
    }

  try {
    const info = await ytdl.getInfo(query.id)

    let body: any

    if (query.q === "audio") {
      const format = [...info.formats].filter(f => !f.hasVideo && f.hasAudio).sort()[0]

      body = format
    } else {
      const { formats, videoDetails } = info
      body = { formats, videoDetails }
    }

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    }
  }
}
