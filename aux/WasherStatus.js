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

const MAP = {
"清华大学紫荆1号楼6层2号机":"he10000002",
"清华大学紫荆1号楼6层1号机":"he10000003",
"清华大学紫荆1号楼5层2号机":"he10000004",
"清华大学紫荆1号楼5层4号机":"he10000005",
"清华大学紫荆1号楼4层3号机":"he10000006",
"清华大学紫荆1号楼4层4号机":"he10000007",
"清华大学紫荆1号楼3层3号机":"he10000008",
"清华大学紫荆1号楼3层5号机":"he10000009",
"清华大学紫荆1号楼2层1号机":"he10000010",
"清华大学紫荆1号楼2层3号机":"he10000011",
"清华大学紫荆1号楼1层1号机":"he10000012",
"清华大学紫荆1号楼1层5号机":"he10000013",
"清华大学紫荆13号楼2层1号机":"he10000014",
"清华大学紫荆3号楼3层3号机":"he10000015",
"清华大学紫荆13号楼5层3号机":"he10000016",
"清华大学紫荆10号楼5层2号机":"he10000017",
"清华大学紫荆10号楼5层1号机":"he10000018",
"清华大学紫荆10号楼3层2号机":"he10000019",
"清华大学紫荆10号楼3层3号机":"he10000020",
"清华大学紫荆10号楼2层2号机":"he10000021",
"清华大学紫荆9号楼4层2号机":"he10000022",
"清华大学紫荆9号楼4层3号机":"he10000023",
"清华大学紫荆9号楼5层2号机":"he10000024",
"清华大学紫荆9号楼5层3号机":"he10000025",
"清华大学紫荆9号楼6层1号机":"he10000026",
"清华大学紫荆9号楼2层2号机":"he10000027",
"清华大学紫荆9号楼2层3号机":"he10000028",
"清华大学紫荆15号楼14层西1号机":"he10000029",
"清华大学紫荆15号楼13层西1号机":"he10000030",
"清华大学紫荆15号楼12层西2号机":"he10000031",
"清华大学紫荆15号楼11层西2号机":"he10000032",
"清华大学紫荆15号楼8层西2号机":"he10000033",
"清华大学紫荆15号楼4层西1号机":"he10000034",
"清华大学紫荆15号楼2层西2号机":"he10000035",
"清华大学紫荆15号楼6层东1号机":"he10000036",
"清华大学紫荆15号楼9层东1号机":"he10000037",
"清华大学紫荆15号楼5层西1号机":"he10000038",
"清华大学紫荆8号楼2单元6层2号机":"he10000039",
"清华大学紫荆8号楼3单元4层2号机":"he10000040",
"清华大学紫荆8号楼3单元4层1号机":"he10000041",
"清华大学紫荆5号楼6层1号":"he10000042",
"清华大学紫荆5号楼6层4号机":"he10000043",
"清华大学紫荆5号楼5层2号机":"he10000044",
"清华大学紫荆5号楼2层4号机":"he10000045",
"清华大学紫荆4号楼2层2号机":"he10000046",
"清华大学紫荆4号楼2层4号机":"he10000047",
"清华大学紫荆4号楼3层3号机":"he10000048",
"清华大学紫荆4号楼4层2号机":"he10000049",
"清华大学紫荆6号楼6层3号":"he10000050",
"清华大学紫荆6号楼5层4号":"he10000051",
"清华大学紫荆6号楼4层1号":"he10000052",
"清华大学紫荆6号楼4层2号":"he10000053",
"清华大学南区36号楼1层1号":"he10000054",
"清华大学南区36号楼1层2号":"he10000055",
"清华大学南区36号楼2层1号":"he10000056",
"清华大学南区36号楼3层1号":"he10000057",
"清华大学南区36号楼4层1号":"he10000058",
"清华大学南区36号楼5层1号":"he10000059",
"清华大学南区36号楼6层1号":"he10000060",
"清华大学南区36号楼7层1号":"he10000061",
"清华大学南区35号楼5层东1号":"he10000062",
"清华大学南区35号楼3层东1号":"he10000063",
"清华大学南区35号楼1层东1号":"he10000064",
"清华大学南区34号楼5层西":"he10000065",
"清华大学南区14西5层1号":"he10000066",
"清华大学南区14西4层2号":"he10000067",
"清华大学南区14西3层2号":"he10000068",
"清华大学南区14西6层1号":"he10000069",
"清华大学南区14西2层":"he10000078",
"清华大学南区14西1层2号":"he10000079",
"清华大学南区14东6层2号":"he10000080",
"清华大学南区14东5层1号":"he10000081",
"清华大学南区14东4层2号":"he10000082",
"清华大学南区14东3层1号":"he10000083",
"清华大学南区14东2层1号":"he10000084",
"清华大学南区14东1层1号":"he10000085",
"清华大学南区32号楼7层":"he10000086",
"清华大学南区32号楼5层1号":"he10000087",
"清华大学南区32号楼6层1号":"he10000088",
"清华大学南区32号楼4层1号":"he10000089",
"清华大学南区32号楼4层2号":"he10000090",
"清华大学南区32号楼3层1号":"he10000091",
"清华大学南区32号楼2层1号":"he10000092",
"清华大学南区32号楼1层1号":"he10000093",
"清华大学南区32号楼1层2号":"he10000094",
"清华大学紫荆4号楼6层3号":"he10000095",
"清华大学紫荆4号楼6层4号":"he10000096",
"清华大学紫荆4号楼5层1号机":"he10000097",
"清华大学紫荆4号楼5层2号":"he10000098",
"清华大学紫荆4号楼1层3号":"he10000099",
"清华大学紫荆4号楼1层2号":"he10000100",
"清华大学紫荆5号楼4层1号":"he10000101",
"清华大学紫荆5号楼4层2号":"he10000102",
"清华大学紫荆5号楼2层3号":"he10000103",
"清华大学紫荆5号楼2层1号":"he10000104",
"清华大学紫荆5号楼1层2号":"he10000105",
"清华大学紫荆5号楼1层4号":"he10000106",
"清华大学紫荆8号楼2单元4层1号":"he10000107",
"清华大学紫荆8号楼2单元3层2号机":"he10000108",
"清华大学紫荆8号楼3单元6层2号机":"he10000109",
"清华大学紫荆8号楼3单元5层1号":"he10000110",
"清华大学紫荆8号楼2层3单元1号":"he10000111",
"清华紫荆8号楼2层2单元2号机":"he10000112",
"清华大学紫荆6号楼3层2号机":"he10000113",
"清华大学紫荆6号楼2层1号机":"he10000115",
"清华大学紫荆6号楼2层3号机":"he10000116",
"清华大学紫荆6号楼1层3号机":"he10000117",
"清华大学紫荆6号楼1层4号机":"he10000118",
"清华大学紫荆6号楼3层3号机":"he10000119",
"清华大学紫荆3号楼5层1号机":"he10000120",
"清华大学紫荆3号楼5层2号机":"he10000121",
"清华大学紫荆7号楼5层东1号机":"he10000122",
"清华大学紫荆7号楼2单元4层":"he10000123",
"清华大学紫荆7号楼2单元3层":"he10000124",
"清华大学紫荆7号2层2单元1号":"he10000125",
"清华大学紫荆7号楼2单元1层":"he10000126",
"清华大学紫荆14号楼14层东":"he10000127",
"清华大学紫荆14号13层西2号机":"he10000128",
"清华大学紫荆14号12层西2号机":"he10000129",
"清华大学紫荆14号楼11层1号":"he10000130",
"清华大学紫荆14号楼10层2号":"he10000131",
"清华大学紫荆14号楼9层1号":"he10000132",
"清华大学紫荆14号楼8层1号":"he10000133",
"清华大学紫荆14号楼7层1号":"he10000134",
"清华大学紫荆14号楼6层1号":"he10000135",
"清华大学紫荆14号楼5层1号":"he10000136",
"清华大学紫荆14号楼2层1号":"he10000137",
"清华大学紫荆14号楼4层2号":"he10000138",
"清华大学紫荆14号楼3层2号":"he10000139",
"清华大学紫荆14号楼1层1号":"he10000140",
"清华大学紫荆12号楼5层1号":"he10000141",
"清华大学紫荆12号楼4层2号":"he10000142",
"清华大学紫荆12号楼3层2号":"he10000143",
"清华大学紫荆12号楼6层1号":"he10000144",
"清华大学紫荆11号楼6层3单元2号":"he10000145",
"清华大学紫荆11号楼5层3单元2号":"he10000146",
"清华大学紫荆11号楼4层3单元2号":"he10000147",
"清华大学紫荆11号楼3层3单元2号":"he10000148",
"清华大学紫荆11号楼1层3单元1号":"he10000149",
"清华大学紫荆17号楼12层1号":"he10000150",
"紫荆1号楼2层5号":"he10000151",
"紫荆5号楼2层2号":"he10000152",
"清华大学紫荆2号楼6层2号机":"he10000153",
"清华大学紫荆2号楼5层4号机":"he10000154",
"清华大学紫荆2号楼4层3号机":"he10000155",
"清华大学紫荆2号楼3层3号机":"he10000156",
"清华大学紫荆2号楼2层3号机":"he10000157",
"清华大学紫荆2号楼1层2号机":"he10000158",
"清华大学紫荆3号楼1层5号机":"he10000159",
"清华大学紫荆3号楼1层4号机":"he10000160",
"清华大学紫荆3号楼1层3号机":"he10000161",
"清华大学紫荆3号楼1层2号机":"he10000162",
"清华大学紫荆3号楼1层1号机":"he10000163",
"清华大学紫荆16号楼14层1号机":"he10000164",
"清华大学紫荆16号楼13层1号机":"he10000165",
"清华大学紫荆16号楼12层1号机":"he10000166",
"清华大学紫荆16号楼11层2号机":"he10000167",
"清华大学紫荆16号楼10层2号机":"he10000168",
"清华大学紫荆16号楼9层1号机":"he10000169",
"清华大学紫荆16号楼8层1号机":"he10000170",
"清华大学紫荆16号楼5层1号机":"he10000171",
"清华大学紫荆1号楼6层5号机":"he10000172",
"清华大学紫荆1号楼5层1号机":"he10000173",
"清华大学紫荆1号楼4层1号机":"he10000174",
"清华大学紫荆1号楼3层1号机":"he10000175",
"清华大学紫荆1号楼2层4号机":"he10000176",
"清华大学紫荆1号楼1层3号机":"he10000177",
"清华大学紫荆15号楼10层东1号机":"he10000178",
"清华大学紫荆15号楼7层东2号机":"he10000179",
"清华大学紫荆15号楼3层东2号机":"he10000180",
"清华大学紫荆9号楼2层3单元1号":"he10000181",
"清华大学紫荆13号楼3层1号":"he10000182",
"清华大学紫荆17号楼13层东":"he10000183",
"清华大学紫荆17号楼11层东2号机":"he10000184",
"清华大学紫荆17号楼9层东":"he10000185",
"清华大学紫荆17号楼7层东1号机":"he10000186",
"清华大学紫荆17号楼5层东1号机":"he10000187",
"清华大学紫荆17号楼3层东":"he10000188",
"清华大学紫荆11号楼6层1号机":"he10000189",
"清华大学紫荆11号楼5层1号机":"he10000190",
"清华大学紫荆11号楼4层1号机":"he10000191",
"清华大学紫荆12号楼6层2号机":"he10000192",
"清华大学紫荆12号楼5层1号机":"he10000193",
"清华大学紫荆12号楼4层1号机":"he10000194",
"清华大学紫荆12号楼3层1号机":"he10000195",
"清华大学紫荆5号楼5层1号机":"he10000196",
"清华大学紫荆18号楼10层西":"he10000197",
"清华大学紫荆18号楼9层西":"he10000198",
"清华大学紫荆18号楼8层西":"he10000199",
"清华大学紫荆18号楼7层西":"he10000200",
"清华大学紫荆18号楼6层西":"he10000201",
"清华大学紫荆18号楼4层西":"he10000202",
}

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
    const response = await fetch("https://hisun.cleverschool.cn/washWeChat/member/washer/list", init)
    results = await gatherResponse(response)
    const curTime = Date.now()
    for (const result of results.result)
      if (result.lastUpdateTime >= curTime - 86400 * 7 * 1000) { // remove broken washers
        result.remainRunning =  "运行中... 剩余" + result.remainRunning + "分钟"
        allResults.push(result)
      }
  }

  // New Washers
  const matchedNewWashers = []
  for (const washerName in MAP)
    for (const kws of allKws)
      if (washerName.includes(kws))
        matchedNewWashers.push(MAP[washerName])

  const newWasherRequests = []
  for (const washerMac of matchedNewWashers) {
    const init = {
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({"data":washerMac}),
    }
    newWasherRequests.push(fetch("https://api.cleverschool.cn/washapi4/washMac/doGetWashMacByCode.json", init))
  }
  await Promise.all(newWasherRequests).then(async (newWashers) => {
    for (const newWasher of newWashers) {
      const result = await gatherResponse(newWasher)
      const resultData = result.data
      resultData.washerName = "（新）" + result.data.location
      resultData.runingStatus = result.code === null ? 48 : 51
      resultData.remainRunning = result.errorMsg
      // FIXME: should remove broken washers as above!
      allResults.push(resultData)
    }
  });

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
                ? result.remainRunning
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
                ? result.remainRunning
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

