"""Tests for the services (services.py): both are registered through Home
Assistant's admin-service helper, so a non-administrator calling them is
refused by Home Assistant itself (#67).

Runs without Home Assistant installed — the helper is a stand-in that
records how each service was registered.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import types
import unittest

import stubs


def _setup() -> tuple[dict, list]:
    registered: dict = {}
    plain: list = []

    def register_admin(hass, domain, service, func, *args, **kwargs):
        registered[service] = {"domain": domain, "func": func, **kwargs}

    def register_plain(domain, service, *args, **kwargs):
        plain.append(service)

    async def get_map(hass):
        return {"floors": []}

    async def network_map(hass, force_refresh=False):
        return None

    stubs.stub("homeassistant")
    stubs.stub(
        "homeassistant.core",
        HomeAssistant=object,
        ServiceCall=object,
        SupportsResponse=types.SimpleNamespace(ONLY="only"),
    )
    stubs.stub("homeassistant.helpers")
    stubs.stub(
        "homeassistant.helpers.service",
        async_register_admin_service=register_admin,
    )
    stubs.new_package("sc_services_test")
    stubs.stub("sc_services_test.const", DOMAIN="spatial_context")
    stubs.stub("sc_services_test.export", async_get_map_data=get_map)
    stubs.stub("sc_services_test.zigbee_mesh", async_get_network_map=network_map)
    services = stubs.load("sc_services_test", "services")

    hass = types.SimpleNamespace(
        services=types.SimpleNamespace(async_register=register_plain)
    )
    asyncio.run(services.async_setup_services(hass))
    return registered, plain


class AdminOnlyServicesTest(unittest.TestCase):
    def test_both_services_are_admin_only(self) -> None:
        registered, plain = _setup()
        self.assertEqual(set(registered), {"get_map", "refresh_zigbee_mesh"})
        self.assertEqual(plain, [])

    def test_get_map_still_returns_a_response(self) -> None:
        registered, _ = _setup()
        self.assertEqual(registered["get_map"]["supports_response"], "only")
        result = asyncio.run(registered["get_map"]["func"](object()))
        self.assertEqual(result, {"floors": []})


if __name__ == "__main__":
    unittest.main()
