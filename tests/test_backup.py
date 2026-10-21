"""Tests for the per-version backup of the saved layout (backup.py).

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import os
import tempfile
import unittest
from pathlib import Path
from unittest import mock

import stubs

stubs.new_package("sc_backup_test")
backup = stubs.load("sc_backup_test", "backup")


class BackupTest(unittest.TestCase):
    def setUp(self) -> None:
        self._tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self._tmp.cleanup)
        self.file = Path(self._tmp.name) / "spatial_context.layout"
        self.file.write_text('{"floors": {}}')

    def _backups(self) -> list[str]:
        return sorted(p.name for p in self.file.parent.glob("*.backup-*"))

    def test_copies_the_file_for_a_version(self) -> None:
        result = backup.backup_before_upgrade(self.file, "0.16.0-beta.2")
        self.assertEqual(result, self.file.with_name("spatial_context.layout.backup-0.16.0-beta.2"))
        self.assertEqual(result.read_text(), '{"floors": {}}')

    def test_a_version_already_backed_up_is_left_alone(self) -> None:
        first = backup.backup_before_upgrade(self.file, "1.0.0")
        self.file.write_text('{"floors": {"a": {}}}')
        self.assertIsNone(backup.backup_before_upgrade(self.file, "1.0.0"))
        self.assertEqual(first.read_text(), '{"floors": {}}')

    def test_no_file_yet_means_nothing_to_back_up(self) -> None:
        self.file.unlink()
        self.assertIsNone(backup.backup_before_upgrade(self.file, "1.0.0"))
        self.assertEqual(self._backups(), [])

    def test_keeps_only_the_newest_few(self) -> None:
        for index, version in enumerate(["1.0.0", "1.1.0", "1.2.0", "1.3.0"]):
            made = backup.backup_before_upgrade(self.file, version)
            os.utime(made, (1_000_000 + index, 1_000_000 + index))
        self.assertEqual(
            self._backups(),
            [f"spatial_context.layout.backup-{v}" for v in ["1.1.0", "1.2.0", "1.3.0"]],
        )

    def test_version_text_cannot_escape_the_folder(self) -> None:
        made = backup.backup_before_upgrade(self.file, "../../etc/x")
        self.assertEqual(made.parent, self.file.parent)
        self.assertNotIn("/", made.name)

    def test_a_failed_copy_is_swallowed(self) -> None:
        with mock.patch.object(backup.shutil, "copyfile", side_effect=OSError("disk full")):
            with self.assertLogs("sc_backup_test.backup", level="WARNING"):
                self.assertIsNone(backup.backup_before_upgrade(self.file, "1.0.0"))


if __name__ == "__main__":
    unittest.main()
