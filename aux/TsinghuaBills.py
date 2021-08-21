#!/usr/bin/env python3

# MIT License
# 
# Copyright (c) 2021 Fugoes
# Copyright (c) 2021 bryango
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
import urllib3
import re

# login with https
login_page = 'https://m.myhome.tsinghua.edu.cn/weixin/weixin_user_authenticate.aspx'

targets = {
    'power': {
        'url': 'http://m.myhome.tsinghua.edu.cn/weixin/weixin_student_electricity_search.aspx',
        'id': 'weixin_student_electricity_searchCtrl1_lblele',
        'influxid': 'tsinghua_electricity_bill',
        'regex': (r'', '')  # (r'$','度')
    },
    'water': {
        'url': 'http://m.myhome.tsinghua.edu.cn/weixin/weixin_student_water_search.aspx',
        'id': 'weixin_student_water_searchCtrl1_lblele',
        'influxid': 'tsinghua_water_bill',
        'regex': (r'元', '')  # regex applied to the output
    }
}
choices = ['all'] + list(targets.keys())

parser = argparse.ArgumentParser()
parser.add_argument('--name', type=str, required=True)
parser.add_argument('--password', type=str, required=True)
parser.add_argument('--find', type=str, default='power', choices=choices)
parser.add_argument('--pretty', action='store_true', help='pretty print the response')
parser.add_argument('--influxdb', action='store_true')
args = parser.parse_args()

try:
    import requests_cache
    requests_cache.install_cache()
except Exception:
    pass

session = requests.session()
session.verify = False  # ignore certificate error
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

session.get('https://m.myhome.tsinghua.edu.cn/weixin/index.aspx')
res = session.get(login_page)
res.encoding = 'gbk'
soup = bs4.BeautifulSoup(res.text, features='html.parser')
inputs = soup.find_all('input', recursive=True)

keys = [
    '__VIEWSTATE',
    '__VIEWSTATEGENERATOR',
    '__EVENTVALIDATION',
    'weixin_user_authenticateCtrl1$txtUserName',
    'weixin_user_authenticateCtrl1$txtPassword',
    'weixin_user_authenticateCtrl1$btnLogin'
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

data['weixin_user_authenticateCtrl1$btnLogin'] = '%B5%C7%C2%BC'
data['weixin_user_authenticateCtrl1$txtUserName'] = args.name
data['weixin_user_authenticateCtrl1$txtPassword'] = args.password

for k in data.keys():
    if data[k] is None:
        data[k] = ''
    data[k] = data[k].encode('gbk')

if 'weixin_user_authenticateCtrl1$txtUserName' not in [
    x['name'] for x in inputs
]:
    pass  # already logged in!
else:
    res = session.post(login_page, data=data)

if args.find == 'all':
    args.pretty = True
else:
    targets = { args.find: targets[args.find] }

for key, target in targets.items():
    res = session.get(target['url'])
    res.encoding = 'gbk'
    soup = bs4.BeautifulSoup(res.text, features='html.parser')
    reading = soup.find('span', {'id': target['id']}).text
    target['reading'] = re.sub(*target['regex'], reading)

    # InfluxDB Line Protocol
    if args.influxdb:
        print('{},user={} reading={} {}'.format(
            target['influxid'], args.name, target['reading'], time.time_ns())
        )
    elif args.pretty:
        print(key, target['reading'], sep='\t')
    else:
        print(target['reading'])
