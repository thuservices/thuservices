#!/usr/bin/env python3

import os
import sys

files = sorted(
    [
        f
        for f in os.listdir("./docs/")
        if os.path.isfile(f"./docs/{f}") and ".md" in f and not "README.md" in f
    ]
)

if len(sys.argv) == 1:
    prefix = ""
else:
    prefix = sys.argv[1]

for f in files:
    with open(f"./docs/{f}", "r") as fp:
        print("- [{}]({}{})".format(f, prefix, f))
        for line in fp:
            if "#" in line[0] and "# " in line:
                # first we need to guanantee the line begin with #, as section title
                # then we need to avoid some cases such as shebang
                # FIXME: comment line in code begin with '# ' may still be added
                # into README, we may skip code blocks to solve this issue
                print(line.rstrip("\n").replace("# ", "#- ").replace("#", "    "))
