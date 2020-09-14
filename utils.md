# 一些脚本和工具

## 一键评教

```js
$('input[name*=fs]').each(function(){$(this).val(Math.round(1+6*Math.random()))})
```

当你想要选课时，发现评教阻碍你？一键脚本帮你忙！

评教的主要困难在于打分，本脚本旨在一键为您将**一节课**的分全部打完，对于文字评论，
请自行动手。

使用方法：进入教评系统，**打开某一节课**，按下 F12，找到控制台(console)界面，
在控制台中复制粘贴上述脚本然后回车运行，相关分数即打好。需要注意的是，打分后
星星不会亮（无回显），这是正常现象，请放心填写文字评论后提交。

然后脚本中的 1 + 6可以调整为 5 + 2，3 + 4 等各种组合，可根据需要自行调整。
需要注意的是不能打 0 分，即至少有 1 分保底分（0 + 7 是不可行的），
然后对于 6 + 1 或 7 + 0，提交时会提醒评分过高，请自行把握。

credit: [Konano](https://github.com/Konano)

## 选课冲突标记

你还在为抢课时满怀期待提交选课，却发现时间冲突而错失选课吗？
你还在一边记忆已选课时间，一边对照开课列表而感到缓慢吗？
这个脚本帮你忙！

这个脚本检测你已经选好的课，自动将候选课中有冲突时间的课标红，使得你浏览
百万课程时速度有如神助。当鼠标在在标红的时间上悬停时，会显示所有与其冲突的课程。

需要注意的是，现在未对半学期课做完全支持，也就是说可能出现假的时间冲突；
同时在开课信息以及选课查询界面无法工作，只在选课操作界面工作。

本脚本在 aux/TsinghuaCourseConflictMarker.user.js 中，需要使用油猴安装。

或者可以通过访问[这里](https://greasyfork.org/en/scripts/408340-tsinghuacourseconflictmarker)
来一键获得脚本。

现在已经增加 webvpn 支持。

感谢 [CircuitCoder](https://github.com/CircuitCoder) 提供的技术指导
感谢 [SharzyL](https://github.com/SharzyL) 的建议与 DEBUG

## INFO 网络学堂 Telegram 消息推送

参见 [thu-weblearn-tgbot](https://github.com/Konano/thu-weblearn-tgbot) 以及
[thu-info-forwarder](https://github.com/Konano/thu-info-forwarder)。

在 Telegram 上已经存在 THU INFO CHANNEL，由于是私有频道，需要通过[邮件](mailto:i@zenithal.me)
获取邀请链接。

## 全校洗衣机状态

还在为了抢洗衣机而努力吗，还在跑上跑下却发现一个洗衣机都没有而痛苦吗，这个服务
帮你侦测洗衣机状态，足不出户而一键掌握全校洗衣机的动向！

源码在 repo 的 aux 目录中，需要自行填写 mopenid 使用。此项需要在微信端抓包获取。

目前部署在 cf workers 上，地址为 [https://washer.zenithal.workers.dev](https://washer.zenithal.workers.dev)

要实现搜索，我们需要加上参数，目前接受两种参数，「s」与「j」。「s」即为搜索的
字符串，一般接受的字符串为「x号楼y层」，前面可以冠名紫荆或南区。举例来说

```
https://washer.zenithal.workers.dev/?s=2号楼2层
```

会返回「紫荆2」与「南区12、32」的洗衣机运行情况。在该参数缺省的情况下，返回的是
「紫荆2号楼」的洗衣机运行情况。

另外也可以使用多个「s」参数，来获取多个关键词的搜索结果，比如

```
https://washer.zenithal.workers.dev/?s=紫荆3号楼&s=紫荆公寓3号楼&s=紫金公寓3号楼
```

会返回所有紫荆 3 号楼的洗衣机运行情况（部分洗衣机的名称中有 typo）。

对于「j」参数，我们只检查「j」是否存在，若存在，则返回原始的 json 数据，
此项供开发者使用。两个参数可同时使用。

### 全校洗衣机状态 - iOS 快捷方式
iOS 12 以上的用户可以透过此[链接](https://www.icloud.com/shortcuts/ffc9d9fff7e140ec9e5a92e5f7d16ae0)安装快捷方式以实现快速查询空闲洗衣机。目前仅支持精确度至楼层的查询。 

## INFO GPA 计算器

在 cksqs 失败后难以一键查询 GPA 吗，抑或需要割肉花 10 元才能得到 GPA 吗，
这种只保留了 3 位有效数字的 GPA，由于 [-0.005,0.005) 的舍入，让人感到极大的不确定性；
而对于手算 GPA 的同学，由于学年的增加，课程的增多，手算的难度也越来越高，每出一门课
就需要算一次 GPA，负担极重。

于是，我们提出自动的 GPA 计算功能，考虑到方便、好用等各种因素，我们与往常一样，
推出 userscript 来实现这一小功能。

本脚本只会读取「INFO-全部成绩」界面中存在的成绩（已经录入系统但没发布的，只能
通过 cksqs 或付费成绩单获取的，不在计算范围内），用新、旧算法将全部 GPA 与必限 GPA
计算出来（直接输出 double），并弹出通知提醒。

本脚本在 `aux/Tsinghua GPA Calculator.user.js` 中，需要使用油猴安装。

或者通过[这里](https://greasyfork.org/zh-CN/scripts/410960-tsinghua-gpa-calculator)
来获得。
