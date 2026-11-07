"""Helpers for loading the integration's modules without Home Assistant.

Each test builds its own throwaway package, registers small stand-ins for the
Home Assistant and sibling modules the file under test imports, then loads the
real file into that package.
"""

from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path

PKG_DIR = Path(__file__).resolve().parent.parent / "custom_components" / "spatial_context"


def stub(name: str, **attrs: object) -> types.ModuleType:
    """Register a stand-in module, replacing any earlier one.

    Every stub can act as a package (``__path__``), and it is set as an
    attribute of its parent when the parent is registered, so test files that
    stub ``homeassistant`` and then import ``homeassistant.x`` behave the same
    whichever test file ran first.
    """
    module = types.ModuleType(name)
    module.__path__ = []  # type: ignore[attr-defined]
    module.__dict__.update(attrs)
    sys.modules[name] = module
    parent, _, child = name.rpartition(".")
    if parent and parent in sys.modules:
        setattr(sys.modules[parent], child, module)
    return module


def new_package(name: str) -> types.ModuleType:
    package = stub(name)
    package.__path__ = []  # type: ignore[attr-defined]
    return package


def load(package: str, name: str) -> types.ModuleType:
    """Load custom_components/spatial_context/<name>.py as <package>.<name>."""
    spec = importlib.util.spec_from_file_location(f"{package}.{name}", PKG_DIR / f"{name}.py")
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


class Unauthorized(Exception):
    """homeassistant.exceptions.Unauthorized (and the base of UnknownUser)."""

    def __init__(self, context=None, *args, **kwargs) -> None:
        super().__init__()
        self.context = context


class UnknownUser(Unauthorized):
    pass


class HomeAssistantError(Exception):
    pass


SupportsResponse = types.SimpleNamespace(NONE="none", OPTIONAL="optional", ONLY="only")


def stub_ha_core(**core_attrs: object) -> None:
    """The Home Assistant modules most files import: the package itself,
    ``core`` (with every ``SupportsResponse`` value) and ``exceptions``.
    Shared so that two test files never register incompatible versions."""
    stub("homeassistant")
    stub(
        "homeassistant.core",
        **{
            "HomeAssistant": object,
            "ServiceCall": object,
            "CALLBACK_TYPE": object,
            "SupportsResponse": SupportsResponse,
            "callback": lambda f: f,
            **core_attrs,
        },
    )
    stub(
        "homeassistant.exceptions",
        Unauthorized=Unauthorized,
        UnknownUser=UnknownUser,
        HomeAssistantError=HomeAssistantError,
    )


def stub_ha_services(register_admin_service=None) -> None:
    """What services.py imports besides core/exceptions: the helpers package
    with ``config_validation`` and ``service.async_register_admin_service``
    (``register_admin_service`` replaces the latter; the default registers
    the handler wrapped in Home Assistant's admin check)."""

    def ensure_list(value):
        if value is None:
            return []
        return value if isinstance(value, list) else [value]

    if register_admin_service is None:

        def register_admin_service(hass, domain, service, service_func, schema=None, **kwargs):
            async def admin_handler(call):
                if call.context.user_id:
                    user = await hass.auth.async_get_user(call.context.user_id)
                    if user is None:
                        raise UnknownUser(context=call.context)
                    if not user.is_admin:
                        raise Unauthorized(context=call.context)
                return await service_func(call)

            hass.services.async_register(domain, service, admin_handler, schema, **kwargs)

    helpers = sys.modules.get("homeassistant.helpers")
    if helpers is None:
        stub("homeassistant.helpers")
    stub("homeassistant.helpers.config_validation", ensure_list=ensure_list)
    stub("homeassistant.helpers.service", async_register_admin_service=register_admin_service)


class FakeHass:
    """Just enough of HomeAssistant: a data dict, a config folder, an executor."""

    def __init__(self, config_dir: Path | str = ".") -> None:
        self.data: dict = {}
        self.stored: dict = {}
        self._config_dir = Path(config_dir)
        self.config = types.SimpleNamespace(path=lambda *parts: str(self._config_dir.joinpath(*parts)))

    async def async_add_executor_job(self, func, *args):
        return func(*args)
