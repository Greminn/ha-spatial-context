"""Tests for which devices and entities can be placed (placeable_rules.py).

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import unittest

import stubs

stubs.new_package("sc_placeable_test")
rules = stubs.load("sc_placeable_test", "placeable_rules")

DOMAINS = frozenset({"light", "sensor", "switch"})


class DeviceIsPlaceableTest(unittest.TestCase):
    def test_a_normal_device_is_placeable(self) -> None:
        self.assertTrue(rules.device_is_placeable(None, {("hue", "abc")}))

    def test_a_service_device_is_not(self) -> None:
        self.assertFalse(rules.device_is_placeable("service", {("hassio", "core_samba")}))

    def test_the_openthread_border_router_app_is(self) -> None:
        self.assertTrue(
            rules.device_is_placeable("service", {("hassio", "core_openthread_border_router")})
        )

    def test_another_service_with_the_same_domain_is_not(self) -> None:
        self.assertFalse(
            rules.device_is_placeable("service", {("hassio", "core_openthread_border_router_2")})
        )

    def test_an_identifier_with_extra_parts_still_matches(self) -> None:
        self.assertTrue(
            rules.device_is_placeable(
                "service", [("hassio", "core_openthread_border_router", "extra")]
            )
        )


class EntityDomainIsPlaceableTest(unittest.TestCase):
    def test_a_listed_domain_is_placeable(self) -> None:
        self.assertTrue(rules.entity_domain_is_placeable("light", "hue", DOMAINS))

    def test_an_update_entity_is_not_placeable_on_its_own(self) -> None:
        self.assertFalse(rules.entity_domain_is_placeable("update", "hue", DOMAINS))
        self.assertFalse(rules.entity_domain_is_placeable("update", None, DOMAINS))

    def test_the_yellow_firmware_update_is_placeable(self) -> None:
        self.assertTrue(
            rules.entity_domain_is_placeable("update", "homeassistant_yellow", DOMAINS)
        )

    def test_other_domains_on_the_yellow_stay_hidden(self) -> None:
        self.assertFalse(
            rules.entity_domain_is_placeable("button", "homeassistant_yellow", DOMAINS)
        )


if __name__ == "__main__":
    unittest.main()
