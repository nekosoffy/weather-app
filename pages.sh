#!/bin/sh

git commit -am "Save uncommited changes (WIP)"
git branch --delete --force gh-pages
git checkout --orphan gh-pages
git add -f dist
git commit -m "build: update GitHub pages"
git push -f origin gh-pages && git checkout -
git filter-branch -f --prune-empty --subdirectory-filter dist && git push -f origin gh-pages && git checkout -