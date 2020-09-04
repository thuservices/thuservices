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

async function handleRequest() {
  const init = {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "cookie": "mopenid=",
    },
    method: "POST",
    body: "regionId=3&searchKws=26号楼2层&pageSize=15&pageNo=1",
  }
  const response = await fetch(url, init)
  const results = await gatherResponse(response)
  console.log(results)
  // console.log(results.result)
  
  status_str = results["result"][0]["washerName"] + ": "
  if(results["result"][0]["runingStatus"]!=48){
    status_str += "运行中..."
    status_str += " 剩余"+results["result"][0]["remainRunning"]+"分钟"
  }else{
    status_str += "空闲！"
  }
  html_str = "<html><body><div>"+status_str+"</div></body></html>"
  const initR = {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
  }
  return new Response(html_str, initR)
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest())
})
