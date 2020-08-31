# 清华常用信息/服务汇总

## 快速选课入口

[选课登录（校内或 SSLVPN）（选课时段内有效）](http://zhjwxk.cic.tsinghua.edu.cn/xklogin.do)

## 文件内容
- [services.md](services.md)
    - 清华服务使用指北（主要面向 Linux 用户）
        - SSLVPN
        - 上网认证
            - （自动）认证
            - 远端服务器代认证
            - Tsinghua-Secure
        - 清华云盘
        - ISATAP 
            - 获取IPv6挂PT
        - WIN 10 激活
- [info.md](info.md)
    - INFO重要信息集合
        - 校历
            - 2019-2020 学年 春夏
            - 2020-2021 学年 
        - 本科专业培养方案
        - 学校宣传资料
        - 选课时间表
        - 选课快捷方式
        - 选课系统相关说明
        - 历年本科生开课目录
        - 清华大学迎新系统
        - 注册标志（用于学生火车票）
        - 校内校车
        - 校内地图
- [utils.md](utils.md)
    - 一些脚本和工具
        - 一键评教
        - 选课冲突标记

## 知道某个重要信息，但 repo 中未列出？

欢迎贡献！请 PR！

需要注意的是本 repo 中使用了 pre-commit hook，请安装，并在有 bash 与 python3 的环境中
进行 commit。

在 pre-commit hook 的作用下，README.md 是自动生成的，故如果需要在 README.md 中修改，
请在 aux 文件夹下进行。

所有文件宽松执行一行八十字符（汉字字符宽度为两字符）的格式。
