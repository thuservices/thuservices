#!/usr/bin/env python3

import os

files = sorted([f for f in os.listdir('./') if os.path.isfile(f) and '.md' in f and not 'README.md' in f])

for f in files:
    with open(f,'r') as fp:
        print('- [{}]({})'.format(f,f))
        for line in fp:
            if '#' in line[0] and '# ' in line:
                # first we need to guanantee the line begin with #, as section title
                # then we need to avoid some cases such as shebang
                # FIXME: comment line in code begin with '# ' may still be added
                # into README, we may skip code blocks to solve this issue
                print(line.rstrip('\n').replace('# ','#- ').replace('#','    '))
