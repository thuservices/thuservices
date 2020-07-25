#!/usr/bin/env python3

import os

files = [f for f in os.listdir('./') if os.path.isfile(f) and '.md' in f and not 'README.md' in f]

for f in files:
    with open(f,'r') as fp:
        print('- [{}]({})'.format(f,f))
        for line in fp:
            if '#' in line[0]:
                print(line.rstrip('\n').replace('# ','#- ').replace('#','    '))
