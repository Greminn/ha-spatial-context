#!/bin/bash
# Run every test suite and say plainly if any failed (piping a test into `tail` hides its exit code).
# Needs python3. No Home Assistant install and no private data. With `voluptuous` installed
# (pip install voluptuous) the WebSocket save-limit tests run too; without it they are skipped.
cd "$(dirname "$0")/.." || exit 1
python3 -m unittest discover -s tests
code=$?
echo "fail=$([ $code -eq 0 ] && echo 0 || echo 1)"
exit $code
