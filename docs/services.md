# 清华服务使用指北（主要面向 Linux 用户）

本文将重点关注清华一些服务在 Linux 机器，包括远端服务器上的使用说明

以及校园专供 Windows 10 的激活指南


## DNS/NTP

```
166.111.8.28
166.111.8.29
2402:f000:1:801::8:28
2402:f000:1:801::8:29
```

按照校园网建议，在配置 DNS 和 NTP 时，至少要使用校园网提供的服务。

## SSLVPN

在 Linux 机器上没有 PULSE SECURE 客户端，除了可以使用 WEB VPN 外，也可使用 `openconnect` 来做到连接清华VPN。

若是 Debian 系，包括 Ubuntu，可以使用

```bash
$ apt-get install openconnect
```

若是 Arch Linux，可以使用

```bash
$ pacman -S openconnect
```

安装此软件。其余发行版请自行查阅相应源。

安装完毕后，使用

```bash
$ openconnect --juniper https://sslvpn.tsinghua.edu.cn
```

输入帐号和密码后即连接上校园网，可以访问校内服务（INFO/USEREG）。

值得注意的是，与清华无关的流量依旧按照原有路由发出，此行为与 Windows 下不同。（此项需求证）

## 上网认证

### 校园网基础知识

[清华大学校园网使用简介](https://its.tsinghua.edu.cn/helpsystem/train/CampusNetworkLectureNotes201909.pdf)（由于网页升级链接已失效，可参阅本站的[备份](file/CampusNetworkLectureNotes201909.pdf)）

[准入上网使用说明](http://166.111.5.8/commsoft/helpsystem/wirednetwork/RealNameAuthentication20190121.pdf)（本站[备份](file/RealNameAuthentication20190121.pdf)）

[清华大学校园网有线局域网用户准入系统使用说明（问与答）](https://its.tsinghua.edu.cn/helpsystem/wirednetwork/RealNameAuthenticationFAQ20190614.pdf)（由于网页升级链接已失效，可参阅本站的[备份](file/RealNameAuthenticationFAQ20190614.pdf)）

上述文件太长不看版：在校园网中上网分为两步，一步是准入，另一步是准出。

没有准入与准出时，机器只能 ping 通 `166.111.8.28` 与 `2402:f000:1:801::8:28`，如果你有相应 v4 与 v6 地址。校内其他地址不通。

对于 IPv4 而言，当有准入而没有准出时，机器可以 ping 通校内机器，但不能 ping 通校外机器，即不能上外网。只有当有准入而且有准出时，机器可以连接外网。

对于 IPv6 而言，v6 只有准入这一步，有了准入，即可以连接外网。

对于 2 层接入的机器（紫荆宿舍网，教学楼无线网络，一些院系的网络），v4 认证与 v6 认证是联动进行的，即当 v4 准入时，v6 同时也准入。对于 3 层接入的机器（一些院系的网络），v4 与 v6 需要分别准入。

`Tsinghua-Secure` 使用的是另一套认证系统。

### 命令行认证 自动认证

参见 [utils.md](utils.md) 中的认证工具汇总。

以下参考 [GoAuthing](https://github.com/z4yx/GoAuthing)

#### 命令行认证

该软件实现了七个主要功能，分别是

```bash
auth-thu auth # v4准入
auth-thu deauth # 解除v4准入
auth-thu auth -6 # v6准入
auth-thu deauth -6 # 解除v6准入
auth-thu login # v4准出
auth-thu logout # 解除v4准出
auth-thu online # 保持机器在线
```

普通用户将其放在家目录下，作为命令行工具使用，即可满足大部分认证需求。

已知问题：在用户通过`auth-thu auth -C`（仅准入）后调用`auth-thu login`（仅准出），准出会失败。

#### 自动认证

对于系统管理员来说，可能存在服务器实现自动认证的需求。

下载好文件以后请合理放置在相应目录（如 /usr/local/bin）下，同时将配置文件放在合理目录下，即可使用

要做到自动 **准出**，需将其中附带的 `goauthing.service` 或 `goauthing@.service` 放置 `/etc/systemd/system/` 文件夹下 ，并调整相应内容以符合程序文件以及配置文件的路径，使用

``` bash
$ systemctl enable goauthing.service
```

启动相应服务，即可达到自动认证的目的。如果要实现账户信息储存在用户家目录中而不是 `/etc` 中，可以参考 `goauthing@.service`。

如果要实现 `v6` 的自动准入，可参考 `goauthing6.service` 和 `goauthing6@.service`。如果只要 v4 的自动准入，需要将 `goauthing.service` 中的 `auth` 变为 `auth -C`，且删除 `login` 一行。

如果有打包者将此打包，请 PR。目前在 AUR 中已存在 `auth-thu` 包。

### 远端服务器代认证

（从笔者的经历来看，usereg 的对准入准出成功和失败的反馈较少，建议采用命令行以及网页认证，而只将 usereg 作为状态面板使用）

在某些服务器上无法使用浏览器打开 [net.tsinghua.edu.cn](https://net.tsinghua.edu.cn) 来认证，只能使用 [命令行工具](### 命令行认证 自动认证) 或「准入代认证」的方式来实现准入。

对于代认证，需要先知道服务器的 IPv4 地址，形如 `166.111.x.x` 或 `59.66.x.x` 或 `101.x.x.x`，之后打开 [usereg.tsinghua.edu.cn](https://usereg.tsinghua.edu.cn) 「准入代认证」部分，填入 IP 即可准入，在准入时可以选择是否打开准出。

对于某些三层接入的机器，如果要实现 v6 的准入，也可在「准入代认证」中实现准入。

对于有些服务器存在准入但没有准出的情况，可以使用「连线其他 IP」实现准出。 

关于准入与准出的问题，欢迎 PR。

关于 IPv4 和 IPv6 在准入准出上线与掉线时的表现，以及校内二层接入/三层接入的表现，欢迎 PR

### 远端服务器网页认证

有时 `usereg` 中的信息并不准确，如果此时还能 `ssh` 登录机器，除了之前提到的「命令行认证」外，还可以在登录时使用选项

```
ssh -D <port> host
```

这样在本地会搭建一个以 `<port>` 为端口的 socks5 代理，如果在浏览器中使用该代理，即可与往常一样实现网页认证。

尤其要注意的是，不能直接访问 auth4/auth6 来进行认证（参考问与答），需要通过跳转的方式来访问 auth4/auth6 以获取正确的 ac\_id. 一般情况下可以访问 info/learn 来跳转，也可通过 3.3.3.3 和 [3:3:3::3] 来跳转。后者对于三层接入的用户来说是一个较为方便的访问 auth6 的方案。

### Tsinghua-Secure

如果是校内环境，首先连接 `Tsinghua-Secure无线网使用指南` 进入 [usereg.tsinghua.edu.cn](https://usereg.tsinghua.edu.cn) , 登录后在 `自注册及修改口令处` 设置 Tsinghua-Secure 使用的密码，此密码不需要与 info 密码相同。

设置好后，可以使用 `NetworkManager` 连接该 Wifi，可以参考 its 的文档 [清华大学无线校园网 802.1x 认证登录客户端配置说明](https://its.tsinghua.edu.cn/info/1333/2318.htm)（本站[备份](file/tsinghua-secure-config.pdf)）

也可使用 `wpa_supplicant` 完成相应 wifi 连接。安装 `wpa_supplicant`，编辑 `/etc/wpa_supplicant/wpa_supplicant-nl80211-XXXX.conf`， 其中 `XXXX` 是本机网卡名称，输入以下配置

```
ctrl_interface=/var/run/wpa_supplicant
update_config=1

network={
        ssid="Tsinghua-Secure"
        proto=RSN
        key_mgmt=WPA-EAP
        pairwise=CCMP
        eap=PEAP
        identity="username"
        password="password"
        phase2="auth=MSCHAPV2"
        priority=9
}     
```

其中 `username` 与 `password` 为自己帐号相应信息。之后输入

```
$ systemctl enable --now wpa_supplicant-nl80211@XXXX.service
```

即可连接。

注：本配置由[orv](http://hep.tsinghua.edu.cn/~orv)贡献。

### Tsinghua-Secure 仅校内登录方式

我们注意到，连接 Tsinghua-Secure 后获取的 IPv4 地址会自动进入准出表中，有可能在未预期的情况下挤占掉线已有的准出设备。

经过测试发现，如果在登录时使用的 username 为「username@tsinghua」（例如lh14@tsinghua），那么其登录行为与「仅校内登录」一样。这种情况下v4只有准入，v6有准入与准出。

在使用该方式认证后，笔者测试可以通过「net.tsinghua.edu.cn」进行准出，但有线网中这个行为不一样。

## 校园网特性讨论

### 二层隔离/邻居发现隔离

校园网的一大特性，是二层隔离/邻居发现隔离。对于v4来说，是前者；对于v6来说，是后者。这个机制为了安全而设计，但对不少开发者/使用者来说较为不方便。

这个特性本质上是核心交换机对广播域进行了划分，甚至使得只有一个客户端与网关在一个广播域中。

#### IPv4

当我们分配到例如 59.66.130.xx/24 的 IP 时，如果我们想连接 59.66.130.yy/24，我们可能会发现无法连接。注意到这两个在一个 /24 中，即一个二层中，这种情况下两台机器会通过ARP发现对方，但在学校的一些机制下，ARP不能工作。

这种情况下，需要在两台机器上增加以下路由。

```bash
ip r a 59.66.130.0/24 via 59.66.130.1
ip r a 59.66.130.1 dev eth0
```

需要根据实际情况修改相应参数。

#### IPv6

紫荆的 IPv6 不存在该问题，由于其地址是 /128 的。

当我们在一个 Tsinghua-Secure 下时，我们会通过 SLAAC 分配地址，即大家的地址都在一个同一个 /64 下，当互相之间想通信时，需要通过 NDP 进行发现。由于校园网的一些机制，NDP可能不会成功。

这种情况下，需要在两台机器上增加以下路由

```bash
ip r a 2402:f000:2:b801::/64 via fe80::xxxx dev wlan0
```
参数需要根据实际情况确认，第一个为 /64 的前缀，可以参考获得的地址或者参考 RA 来书写，第二个为网关的 LL 地址，与默认路由中显示的地址相同，第三个为无线网卡。

### 低端口阻断

按照前面的「使用简介」文档，IPv4 对 0到1024，8000到8100，3389 以及 9100 端口进行阻断。

### 动态 IP

对于动态IP，我们可以使用 DDNS 解决，各大提供商，例如 DNSPod，dns.he.net，cloudflare 都提供了该服务。

以 dns.he.net 为例，先增加一个 A/AAAA 记录，并选择使用 DDNS，创建好后创建更新 Token，记为 T。我们书写以下脚本

```
#!/bin/sh
curl -4 "https://domain.example.com:T@dyn.dns.he.net/nic/update?hostname=domain.example.com"
```
注意Token为其中的T。其余参数按照需要修改。

并用 cron 定期执行该脚本，例如每五分钟一次。可以参考 https://crontab.guru/ 命令获取具体阐释。

#### IPv6 静态后缀或短 IPv6 地址

我们知道，在 SLAAC 下（常见于Tsinghua-Secure），IPv6 地址的后64位可以由客户端自行决定，这时我们可以配置静态后缀，乃至短后缀，如果一个机器只在一个地点下，几乎可以认为前缀固定（需要验证）。

（吐槽：token 这套工具，几乎不在标准里面被提及，文档也少（IPv6 的文档本来就少），还是很小众的东西；毕竟谁需要静态后缀呢，同一个子网下的机器，与其使用静态后缀进行通信（没错，没有只有后缀的路由项，所以到网内另一台机器需要时刻加上前缀），不如配一个静态的私有地址）

往常我们分配到的 IPv6 较复杂，这是因为使用了 EUI64 或者隐私扩展，对于EUI64，可以在地址中发现 `ff:fe` 的字段。

我们可以通过 iproute2 或传统套件配置静态后缀，后者的使用方法请谷歌，前者的方法在此给出。

```bash
ip token set ::114:514:1919:810/64 dev wlan0
```

在运行此命令 **之前**，我们需要注意，我们需要将网卡的 `forwarding` 关闭（ **在配置时** ，配置后可以打开转发），并打开 `accept_ra` 与 `autoconf`，并将其他 dhcp 客户端的 v6 功能关闭。

（吐槽：dhcpcd 虽然说是个 dhcp 客户端，它把 SLAAC 的事情也接管了，就很恼。按照传统只需要开了 `accept_ra` 与 `autoconf`，Linux 内核就会自动配置v6地址。如果 `forwarding=1`时，我们需要使 `accept_ra=2`）

```bash
sysctl net/ipv6/conf/wlan0/accept_ra=1
sysctl net/ipv6/conf/wlan0/autoconf=1
sysctl net/ipv6/conf/wlan0/forwarding=0
```

以上命令的一些参数请按需替换。我们可以将以上命令放在启动脚本中，使得自动配置 token。

#### 尝试获取某一特定IPv4、IPv6地址

你校对于DHCP请求（v4与v6术语不同，不严谨表述）中的特定地址请求是宽容的。

dhcpcd 配置

```dhcpcd.conf
interface enp3s0
request 59.66.190.254
ia_na 64:1a:ff:ff/2402:f000:4:3:888:1926:8:17
```

配置中某些信息已经经过编辑，请参考 man page 与实际网络环境来进行配置。

以下附上一些 log，来探究该配置生效的过程。笔者认为，需要在旧 lease 失效或旧地址被人抢占后该配置才能使用。

```
Apr 02 07:00:21 Zenith dhcpcd[497]: enp3s0: IAID 64:1a:ff:ff
Apr 02 07:00:22 Zenith dhcpcd[497]: enp3s0: soliciting a DHCP lease (requesting 59.66.190.254)
Apr 02 07:00:22 Zenith dhcpcd[497]: enp3s0: offered 59.66.190.254 from 166.111.8.9
Apr 02 07:00:22 Zenith dhcpcd[497]: enp3s0: probing address 59.66.190.254/24
Apr 02 07:00:22 Zenith dhcpcd[497]: enp3s0: confirming prior DHCPv6 lease
Apr 02 07:00:32 Zenith dhcpcd[497]: enp3s0: failed to confirm prior DHCPv6 address
Apr 02 07:00:32 Zenith dhcpcd[497]: enp3s0: adding default route via fe80::9629:2fff:fe37:xxxx
Apr 02 07:00:33 Zenith dhcpcd[497]: enp3s0: ADV 2402:f000:4:3:888:1926:8:17/128 from fe80::9629:2fff:fe37:xxxx
Apr 02 07:00:34 Zenith dhcpcd[497]: enp3s0: REPLY6 received from fe80::9629:2fff:fe37:ffff
Apr 02 07:00:34 Zenith dhcpcd[497]: enp3s0: adding address 2402:f000:4:3:888:1926:8:17/128
```

### 院系网（三层接入）的 IPv6

有些院系网是三层接入的校园网在网内配置的是 SLAAC。

一些机器（例如 Windows 的默认设置和一些 Linux 的默认设置）配置了隐私扩展后，在 SLAAC 环境下其 IPv6 地址会不断改变，由于学校的准入是对 IPv6 地址进行的，具体表现就是在用 auth6 准入 IPv6 一段时间后就失去了准入，需要重新登录 auth6。

一种方法是关掉 IPv6 隐私临时地址（可 Google 查阅相关资料），另一种方式是使用自动准入客户端，例如前面提到的 auth-thu 的 goauthing6.service

### 不符合 RFC 的 DHCPv6

你校的 DHCPv6 server 会不承认某些 DUID，对于这样的 DHCP 请求会不予回应。即使向学校反映该问题，学校尝试让厂商修复后，该问题仍然存在。

根据相关人士消息，只有 DUID Type 1，也就是 DUID-LLT 被承认，以下给出 dhcpcd 的相应配置方式。

首先将 `/etc/dhcpcd.conf` 中的 `duid` 打开，同时保证没有开启 `clientid`。然后我们检查下列文件

```
$ cat /var/lib/dhcpcd/duid
00:01:00:01:26:53:6d:9d:ff:ff:ff:ff:ff:ff
```

若以 `00:01` 开头，则表明为 DUID-LLT，否则（或文件不存在）需要改为上述格式。同时需要检查一下最后的 `ff:ff:ff:ff:ff:ff` 是否为相关网卡的MAC地址，如果不是需要更改为相应地址。

**更新**的测试发现，我们并不知道你校的 DHCPv6 是如何工作的，其如何工作完全是玄学。有的开启了 Anonymize 即可使用，有的开启了也尝试失败。

一些体验可以参考 <https://nya.rs/posts/zijing-dhcpv6/>

### 30分钟无流量掉准入

根据之前提到的《准入上网使用说明》，计算机长时间（目前为 30 分钟）不使用网络时，认证系统会关闭其网络连接；服务器如有必要可每 10 分钟 ping 1 次 ping.tsinghua.edu.cn。

### 掉准出后无法准出

某些长久运行的机器可能掉准出，即无法连接校外网。这种情况下，不少同学可能在 usereg 或命令行中尝试 **准出** ，但是发现准出不成功。 **在 usereg 上，即使显示机器在准出表中，在机器上也无法访问校外网** 。我们认为这是校园网的某些设备的状态同步可能出现了问题。

对于这种问题，有一种可能的解决尝试，就是先将登出 **准入** ，然后再准入并准出，这样可能会刷新学校某些机器的状态，从而使得准出能成功。注意！登出准入是非常危险的操作！您可能会经历 ssh 断线，从而与机器永久失联！请在充分了解该操作的意义与知道如何在登出准入后恢复准入的情况下操作！

### 准入后（仅校内登录后）无法准出

上文中我们提到了 Tsinghua-Secure 仅校内登录的方法，命令行（请查阅相关参数）与网页端（准入界面的仅校内复选框）也有相应的仅校内登录方案。但是有同学观测到在仅校内登录后，通过 net.tsinghua.edu.cn 来进行准出无法准出，usereg 准出也无法成功。这与上面的问题一样应该也是某些设备状态的问题，目前无解。

### 未准入时其他机器能 ping 通，但不能 ssh

不能 ssh 是预策略（参考本章校园网基础知识一节中的《清华大学校园网有线局域网用户准入系统使用说明（问与答）》）决定的

能 ping 通也是预策略决定的，不过这一点没有文档；即，未准入时放行 ICMP reply 包。

## 清华云盘

建议使用 [seafile.com/download](https://seafile.com/download) 中的 Linux 客户端，而不是 Terminal 客户端，因为 Terminal 客户端需要独立密码，此密码不同于 INFO 密码，不能获得，故不能通过 Terminal 客户端登录。

由于手动安装软件的方式是不为推崇的，请使用包管理器获取相应软件。对 Arch Linux 用户，Linux 客户端就是

```bash
pacman -S seafile-client
```

而非 `pacman -S seafile`，此包为 Terminal 客户端。其余发行版请自行找到对应包。

### 使用 Terminal 客户端

Terminal 客户端在 8.0.4 版本后以后支持使用 Token 进行同步，你可以在 [install_linux_client](https://help.seafile.com/syncing_client/install_linux_client/) 中找到大部分发行版 AMD64 架构的源，如果你所使用的包管理器中 `seafile` 或 `seafile-cli` 版本号低于 `8.0.4`，可以安装并参考后面替换部分文件的方法，也可以直接手动编译最新版。

#### 获取 Token

在浏览器中登录清华云盘，Cookie 中的 `seahub_auth` 应该为 `用户名（学号@tsinghua.edu.cn）@Token` 的模式，最后一段即为 Token 。每个账户的 Token 是唯一的，并且不会过期。

在能正常运行 `seaf-cli` 后，可以使用命令行进行同步操作

```
seaf-cli init -d ~
seaf-cli start
seaf-cli sync -l <library-id> -s https://cloud.tsinghua.edu.cn -d <place-directory> -T <token>
seaf-cli desync -d <existing-folder>
```

#### 替换部分文件实现 Token 登录

`seaf-cli` 实质上是通过 `pysearpc` 与 `seaf-daemon` 通讯，因此大部分发行版默认源中较低版本的 `seafile` 在只替换 `seaf-cli` 的情况下也能正常工作。这里提供一种安装 Terminal 客户端后替换 `seaf-cli` 实现 Token 登录的简单办法。

```
git clone https://github.com/haiwen/seafile
cd seafile
cp app/seaf-cli /usr/bin/seaf-cli
chmod +x /usr/bin/seaf-cli
cp -r python/seafile $(python3 -m site --user-site)
```

#### 编译 Terminal 客户端

具体的编译流程可以参考 [build_seafile](https://manual.seafile.com/build_seafile/linux/)，但要注意几点：

- 下载并编译每个仓库中的最新源码或最新的 release
- 可以忽略文档中的 `ccnet` 部分，仓库已经消失并且不存在相关依赖
- make 有概率失败，可以多来几次
- 如果安装完成后 `seaf-cli` 报错，例如 `No module named 'seafile'` 可以参考上一节手动复制 `seafile` 包

### Chrome 提醒下载的文件危险

此现象可能是奇妙同学的奇妙操作导致 Chrome 讲清华云盘域名标记，进而所有文件下载都会提醒可能有危险并阻止。

请忽略此提醒。当然，如果您下载的真的是奇妙的文件，请您自查。

## ISATAP（已停止）

目前，该服务已停止。
  
参考 [ipv6.tsinghua.edu.cn](https://ipv6.tsinghua.edu.cn)。另有 [AUR 包 thu-isatap](https://aur.archlinux.org/packages/thu-isatap) 供参考。

目前只有校内公网IPv4的可使用该服务，校外不可。注意 `166.111.21.1` 这个IP是不会回应ping包的。

### 获取IPv6挂PT

由于在家中使用 SSLVPN 后可获得校内公网 IP，可以使用 ISATAP 获取清华 IPv6 地址，以达到挂 PT 的功能，此处不做详细展开。

## WIN 10 激活

在 Linux 下使用该命令获取相关 cmd 指令

```
$ dig -t TXT win10.harrychen.xyz +short
```

或在 Windows 下使用

```
cmd> nslookup -q=TXT win10.harrychen.xyz
```

然后在连上 sslvpn 的情况下执行该脚本即可激活

## 正版操作系统与软件下载

### ITS

访问 <https://its.tsinghua.edu.cn> 登录后即可获得 Win10，杀毒软件，WPS，MS Visio，MS Visual Studio，MATLAB 等正版软件的下载方式

### TUNA

访问 <https://mirrors.tuna.tsinghua.edu.cn> ，点击获取下载链接即可。
