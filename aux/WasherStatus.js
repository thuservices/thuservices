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

  const params = {}
  const req_url = new URL(request.url)
  const queryString = req_url.search.slice(1).split('&')
  queryString.forEach(item => {
    const kv = item.split('=')
    if (kv[0]) {
      if (kv[0] in params) {
        params[kv[0]].push(kv[1] || true)
      } else {
        params[kv[0]] = [kv[1] || true]
      }
    }
  })
  
  //console.log(JSON.stringify(params))

  kws = ["紫荆2号楼"]
  if("s" in params)
    kws = params["s"]

  var allResults = Array()
  var results
  for (i=0;i<kws.length;i++) {
    const init = {
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cookie": "mopenid=",
      },
      method: "POST",
      body: "regionId=3&searchKws="+kws[i]+"&pageSize=50&pageNo=1",
    }
    const response = await fetch(url, init)
    results = await gatherResponse(response)
    const curTime = new Date().getTime()
    for (j=0;j<results.result.length;j++)
      if (results.result[j]['lastUpdateTime'] >= curTime - 86400 * 7 * 1000) // remove broken washers
        allResults.push(results.result[j])
  }

  results.result = allResults
  results.totalCount = allResults.length
  results.pageSize < results.totalCount ? results.pageSize = results.totalCount : 0

  results["result"].sort((a,b) => a["washerName"].localeCompare(b["washerName"]))

  if("j" in params){
    return new Response(JSON.stringify(results, null, 2), {
        headers: {
          "content-type": "application/json;charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
        }
      })
  }
  
  // console.log(results.result)
  
  html_str = "<html><body>"
  if(results["totalCount"]!=0){
    const len = results["totalCount"]
    for(i=0;i!=len;++i){
      status_str = "<div>" + results["result"][i]["washerName"] + ": "
      if(results["result"][i]["runingStatus"]!=48){
        status_str += "运行中..."
        status_str += " 剩余"+results["result"][i]["remainRunning"]+"分钟"
      }else{
        status_str += "空闲！"
      }
      status_str += "</div>"
      html_str += status_str
    }
  }else{
    html_str += "无搜索结果"
  }
  html_str += "</body></html>"
  const initR = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
      "Access-Control-Allow-Origin": "*",
    },
  }
  return new Response(html_str, initR)
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.request))
})
