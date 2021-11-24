/* MIT License

Copyright (c) 2020-2021 zrt, Zenithal, mcfx, dramforever, stevenlele, RainSlide

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

/// Code for Debugging this script with Node.js, without Miniflare
/// START

// Uncomment the line below to use fetch() under Node.js
// import nodeFetch from "node-fetch";

// debugRequest: { url: string }
const debugRequest = {
  // those two url below should match the same buildings
  // url: "https://0.0.0.0/?j&s=南区5号楼"
  url: "https://0.0.0.0/?j&s=南区5号楼东&s=南区5号楼西"
}

const _fetch = typeof fetch === "function"
? fetch
: nodeFetch

const _Response = typeof Response === "function"
? Response
: function (body, init) {
  return Object.assign(this, { body, init })
}

const _addEventListener = typeof addEventListener === "function"
? addEventListener
: (type, listener) => type === "fetch" && listener({
  request: debugRequest,
  respondWith: response => response.then(console.log)
})

/// END


/// Constants

// apiPrefix: string
const apiPrefix = "https://api.cleverschool.cn/washapi4/device/"

// issuesUrl: string
const issuesUrl = "https://github.com/ZenithalHourlyRate/thuservices/issues"

// htmlTitleSuffix: string
const htmlTitleSuffix = " - 全校洗衣机状态"

// defaultResponseHeaders: { name: (value: string), ... }
const defaultResponseHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Content-Security-Policy": "default-src: 'self'; script-src 'none'",
  "Content-Type": `text/plain; charset=UTF-8` // fallback
}


/// Functions

// paramsToOptions(params: URLSearchParams): { searches: Set, type: string }
const paramsToOptions = params => {

  const parseSearches = searches => Array.from(
    new Set(searches.map(search => search.trim()))
  )

  return {
    searches:
      params.has("s") ? parseSearches(params.getAll("s")) : ["紫荆2号楼"],
    type:
      params.has("j") ? "json" :
      params.has("p") ? "plain" :
      "html"
  }

}

// washApi(name, data, fallback = []): Promise
const washApi = async (name, data, fallback = []) => _fetch(
  `${apiPrefix}${name}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  }
).then(response => response.json()
).then(json => {
  if (typeof json === "object" && json !== null && "data" in json) {
    return json.data;
  } else {
    console.error({name, data, json})
    throw "washApi(): Response json is malformed"
  }
}).catch(e => {
  console.error(e);
  return fallback;
})

// Can we cache the buildings?

// getBuildings(): buildings: [ { text: string, value: string }, ... ]
const fetchBuildings = async () => {

  const buildings = await washApi("tower", {})

  return buildings.filter(
    building => (
      building.text !== "请选择楼号" &&
      building.value !== "0"
    )
  )

}

// gatherRequests(buildings, searches): requests
const gatherRequests = (buildings, searches) => {

  // e(msg): msg
  const e = msg => {
    console.error(msg, { buildings, searches })
    return msg
  }

  if (buildings.length === 0) {
    throw e("buildings.length === 0")
  } else if (searches.length === 0) {
    throw e("searches.length === 0")
  } else {
    return buildings.filter(
      building => searches.some(
        search => building.text.includes(search)
      )
    ).map(
      building => washApi("status", { towerKey: building.value })
    )
  }

}

// getResult(requests): result
const getResult = async requests => {

  const result = []

  await Promise.allSettled(requests).then(
    buildings => buildings.forEach(
      building => (
        building.status === "fulfilled"
        ? result.push(building.value)
        : console.warn(
          "getResult(): a Promise is not fulfilled",
          { result, building, buildings }
        )
      )
    )
  )

  return result.flat(1);

}

// resultParsers: { type: (result => parsedResult: string), ... }
const resultParsers = (() => {

  // noResultStr: string
  const noResultStr = "无搜索结果"

  // htmlEntities: [ [ char: string, entity: string ], ... ]
  const htmlEntities = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&apos;"]
  ]

  // $(tagName: string, text: string): html: string
  const $ = (tagName, text) => `<${tagName}>${
    htmlEntities.reduce((str, []) => str.replaceAll(char, entity), text)
  }</${tagName}>`

  // title(text: string): html: string
  const title = text => $("title", `${text}${htmlTitleSuffix}`)

  // washerToStr(washer): washerStr: string
  const washerToStr = washer => [
    washer.tower + washer.floorName, washer.macUnionCode, washer.status
  ].join(" ")

  return {
    json: result => JSON.stringify({ result, totalCount: result.length }, null, 2),
    plain: result => (
      result.length > 0
      ? result.map(washerToStr).join("\n")
      : noResultStr
    ),
    html: result => "<!DOCTYPE html>" + (
      result.length > 0
      ? (
        title(`${result.length} 条结果`) + "\n" +
        $("ul", result.map(
          washer => $("li", washerToStr(washer))
        ).join("\n"))
      )
      : title(noResultStr) + noResultStr
    )
  }

})()

// mimeTypeMap: new Map([ [ type: string, mimeType: string ], ... ])
const mimeTypeMap = new Map([
  ["json", "application/json"],
  ["plain", "text/plain"],
  ["html", "text/html"]
])

// newResponse(body, mimeType: string): Response
// wrapper for new Response()
const newResponse = (body, mimeType) => new _Response(
  body, {
    headers: Object.assign(
      {}, defaultResponseHeaders, {
        "Content-Type": `${mimeType}; charset=UTF-8`
      }
    )
  }
)

// createResponse(result, type: string): Response
const createResponse = (result, type) => {

  const mimeType = mimeTypeMap.get(type)

  if (mimeType !== undefined) {
    // build response body with result parsers, return Response
    return newResponse(resultParsers[type](result), mimeType)
  } else {
    console.error("createResponse(): Unknown type", { result, type })
    return newResponse(
      `Error: Unknown type: ${type}, please report this error to ${issuesUrl}`,
      "text/plain"
    )
  }

}

// handleRequest(request: Request): Response
const handleRequest = async request => {

  const params = new URL(request.url).searchParams
  const { searches, type } = paramsToOptions(params)

  const buildings = await fetchBuildings()
  const requests = gatherRequests(buildings, searches)
  const result = await getResult(requests)

  return createResponse(result, type)

}

_addEventListener("fetch", e => e.respondWith(handleRequest(e.request)))
