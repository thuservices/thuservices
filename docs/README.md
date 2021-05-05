# 清华常用信息/服务汇总

## 快速选课入口

[选课登录（校内或 SSLVPN）（选课时段内有效）](http://zhjwxk.cic.tsinghua.edu.cn/xklogin.do)

## 文件内容
- [info.md](info.md)
    - INFO重要信息集合
        - 校历
            - 2020-2021学年 
        - 本科专业培养方案
        - 学校宣传资料
            - INFO 版本
            - 主页版本
        - 选课时间表
        - 选课快捷方式
        - 选课系统相关说明
        - 期末考试时间/地点查询
        - 历年本科生开课目录
        - 清华大学迎新系统
        - 注册标志（用于学生火车票）
        - 校内校车
        - 校内地图（静态版）
        - 清华大学调查问卷系统
        - 清华紫荆码
        - eduroam
        - cksqs 查询GPA
        - 清华大学后勤综合服务平台
            - 校内各单位（包括校医院）电话号码
            - 校医院各科室挂号
            - 校园地图（动态版）
            - 网上报修
            - 客房服务
            - 订车服务
        - 邮编、邮寄地址及邮条
        - 清华大学校园一卡通自助查询系统
        - ACM/IEEE/知网等论文下载（Shibboleth或OpenAthens）
- [services.md](services.md)
    - 清华服务使用指北（主要面向 Linux 用户）
        - SSLVPN
        - 上网认证
            - 校园网基础知识
            - 命令行认证 自动认证
                - 命令行认证
                - 自动认证
            - 远端服务器代认证
            - 远端服务器网页认证
            - Tsinghua-Secure
            - Tsinghua-Secure 仅校内登录方式
        - 校园网特性讨论
            - 二层隔离/邻居发现隔离
                - IPv4
                - IPv6
            - 低端口阻断
            - 动态 IP
                - IPv6 静态后缀或短 IPv6 地址
                - 尝试获取某一特定IPv4、IPv6地址
            - 不符合 RFC 的 DHCPv6
            - 30分钟无流量掉准入
            - 掉准出后无法准出
            - 准入后（仅校内登录后）无法准出
        - 清华云盘
            - 魔改 Terminal 客户端
            - Chrome 提醒下载的文件危险
        - ISATAP 
            - 获取IPv6挂PT
        - WIN 10 激活
        - 正版操作系统与软件下载
            - ITS
            - TUNA
- [templates.md](templates.md)
    - LaTeX 等模板
        - 《如何使用 LaTeX 排版论文》讲稿
        - ThuThesis
        - THU-Beamer-Theme
        - 清华大学中文Beamer 模板
        - TsinghuaBeamear
        - Report Presentation for Tsinghua University
        - THU coursework Template
        - 清华大学近代物理实验报告模版
        - THU Letter of Recommendation Template
        - A Simple Tsinghua Letterhead Template
        - CV-tsinghua-template
- [utils.md](utils.md)
    - 一些脚本和工具
        - 选课冲突标记
        - INFO 网络学堂 Telegram 消息推送
        - 全校洗衣机状态
            - 全校洗衣机状态 - iOS 快捷方式
            - 全校洗衣机状态 - Telegram Bot 二哈
            - 洗衣监控与提醒 - 微信小程序
        - INFO GPA 计算器
        - 清华大学GPA查询
        - 清华大学一体化平台视频自动播放
        - 学堂在线视频自动播放
        - 学堂在线字幕下载器
        - 清华教学参考书爬取
        - 课程地点分享
        - 清华大学计算机系课程攻略
        - 校园网认证工具汇总
        - INFO/网络学堂 APP/插件
        - 注册标志（用于火车票）
        - 寝室电费查询
        - 清华上下课铃声
        - 随机选择校内餐厅
        - 华清大学课程攻略共享计划

## 知道某个重要信息，但repo中未列出？

欢迎贡献！请 [PR](https://github.com/ZenithalHourlyRate/thuservices/pulls)！

需要注意的是[本 repo](https://github.com/ZenithalHourlyRate/thuservices) 中使用了 [pre-commit hook](https://github.com/ZenithalHourlyRate/thuservices/blob/master/pre-commit)，请[安装](https://git-scm.com/book/zh/v2/%E8%87%AA%E5%AE%9A%E4%B9%89-Git-Git-%E9%92%A9%E5%AD%90)，并在有 bash 与 python3 的环境中进行 commit。

在 pre-commit hook 的作用下，README.md 是自动生成的，故如果需要在 README.md 中修改，请在 [aux 文件夹](https://github.com/ZenithalHourlyRate/thuservices/tree/master/aux)下进行。

由于 Windows 文件系统的限制，文件夹名不能为 aux，请在非Windows环境（WSL也可以）下克隆该项目。

### 编译

```
python3 -m pip install --user -r requirements.txt # 安装 Python 依赖包
mkdocs serve # 直接在本地 serve，或者：
mkdocs build --clean # 生成于 site/ 文件夹中
```
