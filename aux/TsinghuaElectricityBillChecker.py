#!/usr/bin/env python3

# MIT License
# 
# Copyright (c) 2021 Fugoes
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import requests
import bs4
import argparse
import time

parser = argparse.ArgumentParser()
parser.add_argument('--name', type=str, required=True)
parser.add_argument('--password', type=str, required=True)
parser.add_argument('--influxdb', action='store_true')
args = parser.parse_args()

session = requests.session()

res = session.get('http://myhome.tsinghua.edu.cn')
res.encoding = 'gbk'
soup = bs4.BeautifulSoup(res.text, features='html.parser')
inputs = soup.find_all('input', recursive=True)

keys = [
    'net_Default_LoginCtrl1$lbtnLogin.x',
    '__VIEWSTATEGENERATOR',
    '__VIEWSTATE',
    'Home_Img_ActivityCtrl1$hfScript',
    'Home_Vote_InfoCtrl1$Repeater1$ctl01$hfID',
    'net_Default_LoginCtrl1$lbtnLogin.y',
    'net_Default_LoginCtrl1$txtUserName',
    'Home_Vote_InfoCtrl1$Repeater1$ctl01$rdolstSelect',
    'Home_Img_NewsCtrl1$hfJsImg',
    'net_Default_LoginCtrl1$txtSearch1',
    'net_Default_LoginCtrl1$txtUserPwd'
]

data = dict()

for key in keys:
    data[key] = None

for x in inputs:
    if x['name'] in set(keys):
        try:
            if data[x['name']] is None:
                data[x['name']] = x['value']
        except KeyError:
            pass

data['net_Default_LoginCtrl1$lbtnLogin.x'] = '22'
data['net_Default_LoginCtrl1$lbtnLogin.y'] = '12'
data['net_Default_LoginCtrl1$txtSearch1'] = ''
data['net_Default_LoginCtrl1$txtUserName'] = args.name
data['net_Default_LoginCtrl1$txtUserPwd'] = args.password

for k in data.keys():
    if data[k] == None:
        data[k] = ''
    data[k] = data[k].encode('gbk')

res = session.post('http://myhome.tsinghua.edu.cn/default.aspx', data=data)
res = session.get('http://myhome.tsinghua.edu.cn/Netweb_List/Netweb_Home_electricity_Detail.aspx')
res.encoding = 'gbk'
soup = bs4.BeautifulSoup(res.text, features='html.parser')
reading = soup.find('span', {'id': 'Netweb_Home_electricity_DetailCtrl1_lblele'}).text

# InfluxDB Line Protocol
if args.influxdb:
    print('tsinghua_electricity_bill,user={} reading={} {}'.format(args.name, reading, time.time_ns()))
else:
    print(reading)
