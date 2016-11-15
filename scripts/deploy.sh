#!/bin/bash
set -e

branch=dev

repo="git@github.com:gaspaio/sangoku.git"
workdir="$( cd "$( dirname "${BASH_SOURCE[0]}"   )" && pwd   )/.."
codedir="$workdir/docker-code"

if [ -d "$codedir" ]; then
  git fetch -C $codedir -q --depth 1 --update-shallow --prune
  git checkout -C $codedir -q origin/${!branch}
else
  git clone -b ${!branch} --depth 1 -q $repo $codedir
fi

