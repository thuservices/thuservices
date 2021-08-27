/*
 * MIT License
 * 
 * Copyright (c) 2020-2021 zrt, Zenithal, mcfx, dramforever, stevenlele
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

async function gatherResponse(response) {
  return await response.json()
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

  // console.log(JSON.stringify(request))

  const allKws = "s" in params ? params["s"] : ["紫荆2号楼"]

  let allResults = []

  // New Washers
  const init = {
    headers: { "content-type": "application/json" },
    method: "POST",
    body: "{}",
  }
  const response = await fetch("https://api.cleverschool.cn/washapi4/device/tower", init)
  const buildings = await gatherResponse(response)
  const buildingRequests = []
  for (const building of buildings.data)
    for (const kws of allKws)
      if (building.text.includes(kws)) {
        const init = {
          headers: { "content-type": "application/json" },
          method: "POST",
          body: JSON.stringify({ towerKey: building.value }),
        }
        buildingRequests.push(fetch("https://api.cleverschool.cn/washapi4/device/status", init))
        break
      }
  await Promise.all(buildingRequests).then(async (buildings) => {
    for (const building of buildings) {
      const result = await gatherResponse(building)
      const resultData = result.data
      allResults = allResults.concat(resultData)
    }
  });

  const results = {
    result: allResults,
    totalCount: allResults.length,
  }

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
  if ("p" in params) {
    // text/plain
    const plain_str =
      results.totalCount > 0
        ? allResults.map(result =>
            result.tower + result.floorName + " " + result.macUnionCode + " " + result.status
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
        ? "<ul>" + allResults.map(result =>
            "<li>" + result.tower + result.floorName + " " + result.macUnionCode + " " + result.status + "</li>"
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

