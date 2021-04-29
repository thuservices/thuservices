/*
 * MIT License
 * 
 * Copyright (c) 2020-2021 zrt, Zenithal, mcfx, dramforever
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * 
 */

/**
 * Example someHost is set up to take in a JSON request
 * Replace url with the host you wish to send requests to
 * @param {string} someHost the host to send the request to
 * @param {string} url the URL to send the request to
 */
const someHost = "https://hisun.cleverschool.cn"
const url = someHost + "/washWeChat/member/washer/list"
/**
 * gatherResponse awaits and returns a response body as a string.
 * Use await gatherResponse(..) in an async function to get the response body
 * @param {Response} response
 */
async function gatherResponse(response) {
  const { headers } = response
  return await response.json()

  // const contentType = headers.get("content-type") || ""
  // if (contentType.includes("application/json")) {
  //   return JSON.stringify(await response.json())
  // }
  // else if (contentType.includes("application/text")) {
  //   return await response.text()
  // }
  // else if (contentType.includes("text/html")) {
  //   return await response.text()
  // }
  // else {
  //   return await response.text()
  // }
}

async function handleRequest(request) {

  const params = Object.create(null)
  const req_url = new URL(request.url)
  const queryString = Array.from(req_url.searchParams)
  queryString.forEach(kv => {
    if (kv[0]) {
      if (kv[0] in params) {
        params[kv[0]].push(kv[1] || true)
      } else {
        params[kv[0]] = [kv[1] || true]
      }
    }
  })

  //console.log(JSON.stringify(params))

  const allKws = "s" in params ? params["s"] : ["紫荆2号楼"]

  const allResults = []
  let results
  for (const kws of allKws) {
    const init = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "mopenid=",
      },
      method: "POST",
      body: "regionId=3&searchKws=" + kws + "&pageSize=50&pageNo=1",
    }
    const response = await fetch(url, init)
    results = await gatherResponse(response)
    const curTime = Date.now()
    for (const result of results.result)
      if (result.lastUpdateTime >= curTime - 86400 * 7 * 1000) // remove broken washers
        allResults.push(result)
  }

  results.result = allResults
  results.totalCount = allResults.length
  results.pageSize < results.totalCount ? results.pageSize = results.totalCount : 0

  // fix clerical errors
  const replaceMap = new Map([
    [ /^清华大学|4G$/, "" ],
    [ /紫[荆金荊](:?公寓)?/, "紫荆" ],
    [ /紫荆1号楼([14])号机/, "紫荆1号楼1层$1号机" ],
    [ /层([34])号楼/, "层$1号机" ],
    [ "紫荆5号码", "紫荆5号楼" ],
    [ "三号院", "3号院" ],
    [ "七号楼", "7号楼" ],
  ])
  for (const result of results.result)
    for (const [regexp, str] of replaceMap)
      result.washerName = result.washerName.replace(regexp, str)

  // sort
  results.result.sort((a, b) => a.washerName.localeCompare(b.washerName))

  // JSON
  if ("j" in params) {
    return new Response(JSON.stringify(results, null, 2), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      }
    })
  }

  // console.log(results.result)

  // HTML
  const mergeableResults = []
  const mergedResults = []
  for (const result of results.result) (
    result.runingStatus === 48 &&
    /紫荆\d+号楼\d+层\d+号机/.test(result.washerName)
      ? mergeableResults
      : mergedResults
  ).push(result)

  const buildings = []
  for (const result of mergeableResults) {
    const nums = result.washerName.match(/\d+/g).map(str => Number.parseInt(str))
    nums.reduce((parent, child) => {
      if (!parent[child])
        parent[child] = []
      return parent[child]
    }, buildings)
  }
  buildings.forEach((floors, i) => {
    const buliding = "紫荆" + i + "号楼"
    floors.forEach((washers, i) => {
      const floor = i + "层"
      const washer = washers.map((_, i) => i).filter(i => Number.isInteger(i)).join(", ") + "号机"
      mergedResults.push({washerName: buliding + floor + washer, runingStatus: 48})
    })
  })

  mergedResults.sort((a, b) => a.washerName.localeCompare(b.washerName))

  if ("p" in params) {
    // text/plain
    const plain_str =
      results.totalCount > 0
        ? mergedResults.map(result =>
            result.washerName + ": " + (
              result.runingStatus !== 48
                ? "运行中... 剩余" + result.remainRunning + "分钟"
                : "空闲！"
            )
          ).join("\n")
        : "无搜索结果"
    const initR = {
      headers: {
        "Content-Type": "text/plain;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
    return new Response(plain_str, initR)
  } else {
    // text/html
    const html_str = "<!DOCTYPE html>" + (
      results.totalCount > 0
        ? "<ul>" + mergedResults.map(result =>
            "<li>" + result.washerName + ": " + (
              result.runingStatus !== 48
                ? "运行中... 剩余" + result.remainRunning + "分钟"
                : "空闲！"
            ) + "</li>"
          ).join("") + "</ul>"
        : "无搜索结果"
    )
    const initR = {
      headers: {
        "Content-Type": "text/html;charset=UTF-8",
        "Access-Control-Allow-Origin": "*",
      },
    }
    return new Response(html_str, initR)
  }
}

addEventListener("fetch", event => event.respondWith(handleRequest(event.request)))
