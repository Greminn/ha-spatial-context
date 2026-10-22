"""Tests for the name a room shows (room_names.py).

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import unittest

import stubs

stubs.new_package("sc_room_names_test")
names = stubs.load("sc_room_names_test", "room_names")

AREAS = {"lounge": "Lounge"}


class RoomDisplayNameTest(unittest.TestCase):
    def test_a_typed_name_wins(self) -> None:
        self.assertEqual(names.room_display_name("Den", "lounge", AREAS), "Den")

    def test_an_empty_name_follows_the_area(self) -> None:
        self.assertEqual(names.room_display_name("", "lounge", AREAS), "Lounge")

    def test_a_blank_name_follows_the_area(self) -> None:
        self.assertEqual(names.room_display_name("  ", "lounge", AREAS), "Lounge")

    def test_a_missing_name_follows_the_area(self) -> None:
        self.assertEqual(names.room_display_name(None, "lounge", AREAS), "Lounge")

    def test_an_area_rename_shows_straight_away(self) -> None:
        self.assertEqual(
            names.room_display_name("", "lounge", {"lounge": "Living Room"}),
            "Living Room",
        )

    def test_no_area_and_no_name_gets_a_plain_label(self) -> None:
        self.assertEqual(names.room_display_name("", None, AREAS), "Room")

    def test_a_deleted_area_gets_a_plain_label(self) -> None:
        self.assertEqual(names.room_display_name("", "gone", AREAS), "Room")


if __name__ == "__main__":
    unittest.main()
