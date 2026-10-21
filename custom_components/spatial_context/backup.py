"""A copy of the saved layout for each Spatial Context version that has run.

The whole layout (every floor, the property view, the settings) lives in one
file, and a release that changes how it is read or written has nothing to fall
back on if it gets that wrong. So the first time a version starts, before it
touches anything, the file is copied next to itself as
`spatial_context.layout.backup-<version>`. The three most recent copies are
kept. Restoring one is a file copy over `spatial_context.layout` with Home
Assistant stopped.
"""

from __future__ import annotations

import logging
import re
import shutil
from pathlib import Path

_LOGGER = logging.getLogger(__name__)

KEEP_BACKUPS = 3


def backup_before_upgrade(
    storage_file: Path, version: str, keep: int = KEEP_BACKUPS
) -> Path | None:
    """Copy `storage_file` for `version` unless that version already has a
    copy, then drop all but the `keep` newest. Returns the new copy, or None
    when nothing was copied (no file yet, already backed up, or a failure,
    which is logged and never raised: a backup must not stop Home Assistant
    starting)."""
    try:
        if not storage_file.is_file():
            return None
        safe_version = re.sub(r"[^0-9A-Za-z.+-]", "_", version)
        target = storage_file.with_name(f"{storage_file.name}.backup-{safe_version}")
        if target.exists():
            return None
        shutil.copyfile(storage_file, target)
        backups = sorted(
            storage_file.parent.glob(f"{storage_file.name}.backup-*"),
            key=lambda path: (path.stat().st_mtime_ns, path.name),
        )
        for old in backups[:-keep]:
            old.unlink(missing_ok=True)
        _LOGGER.info("Backed up the Spatial Context layout to %s", target.name)
        return target
    except OSError:
        _LOGGER.warning("Couldn't back up the Spatial Context layout", exc_info=True)
        return None
