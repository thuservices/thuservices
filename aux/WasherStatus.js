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
    if (kv[0]) params[kv[0]] = kv[1] || true
  })
  
  //console.log(JSON.stringify(params))

  kws = "紫荆2号楼"
  if("s" in params)
    kws = params["s"]

  const init = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cookie": "mopenid=",
    },
    method: "POST",
    body: "regionId=3&searchKws="+kws+"&pageSize=50&pageNo=1",
  }
  const response = await fetch(url, init)
  const results = await gatherResponse(response)
  //console.log(results)
  //console.log(request.url)

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
    len = results["totalCount"]
    if(len > results["pageSize"])
      len = results["pageSize"]
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
