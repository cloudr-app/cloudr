import { Handler } from "./types"

import ytdl from "ytdl-core"

export const handler: Handler = async event => {
  const { queryStringParameters: query } = event

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
