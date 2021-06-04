#!/usr/bin/env bash
logfile=http.log
port=443

local="$(cd "$(dirname "$0")"; pwd)"
cd "$local"

function start() {
    stop >/dev/null
    python3 server.py $port >> "$local"/$logfile 2>&1 &
    echo "For logs see the file $logfile"
}

function stop() {
    pid=$(ss -lntp sport $port | grep -oE 'pid=[0-9]+')
    pid=${pid:4}
    if [ ! -z $pid ]; then
        kill $pid
    else
        echo "Process not found"
    fi
}

case "$1" in
    "stop" | "kill")
	stop
	;;
    *)
	start
	;;
esac

