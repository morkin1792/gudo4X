#!/usr/bin/env bash
logfile=http.log
port=443

local="$(cd "$(dirname "$0")"; pwd)"
cd "$local"

function start() {
    stop >/dev/null && sleep 2
    python3 server.py $port >> $logfile 2>&1 &
    echo "For logs see the file $logfile"
}

function get_pid() {
    pid=$(ss -lntp sport $port | grep -oE 'pid=[0-9]+')
    pid=${pid:4}
    echo $pid
}

function stop() {
    pid=$(get_pid)
    if [ ! -z $pid ]; then
        kill $pid
    else
        echo "Process not found"
    fi
}

function clean() {
    cd "$local"
    rm logs/* 2>/dev/null
    rm $logfile 2>/dev/null
    if [ ! -z $(get_pid) ];then
        start
    fi	
}

case "$1" in
    "stop" | "kill")
	stop
	;;
    "clean" | "clear")
	clean
	;;
    *)
	start
	;;
esac

