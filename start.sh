#!/usr/bin/env bash
local="$(cd "$(dirname "$0")"; pwd)"

function check() {
    (curl -ki --max-time 3 https://akah.me/health 2>/dev/null >&2) || bash "$local"/run.sh
}

function stop() {
    pid="$(ps -elf | grep $0 | grep -v $$ | awk '{print $4}' | head -1)"
    if [ ! -z "$pid" ]; then
	#echo $pid
        kill "$pid"
    fi
    bash "$local"/run.sh stop
}

function start() {
    stop >/dev/null
    while [ 1 ];do
        check && sleep 30
    done
}

eval $1

