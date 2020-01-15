#!/usr/bin/env bash
​
# AOZ run script for Linux, MacOS
# By Andy Naimoli
​
# This script wants a web file (usually an .html one) to display
# given as the first and only argument.
# It has a list of possibile commands to run to open it.
ME="$0"
​
# Possible commands for preview (order is priority):
CMDS=("xdg-open" "sensible-browser" "x-www-browser" "gnome-open" "open")
​
# Check syntax:
NC=$#
if [[ $NC -ne 1 ]]; then
	echo "?No target set. Usage: ${ME} <TARGET>"
	exit 1
fi
ARG="$1"
​
# Target file:
FILE="${ARG}"
​
# Command:
RUN=""
for CMD in "${CMDS[@]}"; do
	type "${CMD}" 1>/dev/null 2>&1; res=$?                          # check if command exists...
	if [[ (-z "${RUN}") && (${res} -eq 0) ]]; then RUN="${CMD}"; fi # ...and store it.
done
​
# Run:
if [[ -z "${RUN}" ]]; then
	echo "?No available command found to run preview..."
	exit 2
else
	"${RUN}" "${FILE}"
fi