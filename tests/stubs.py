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
    module = types.ModuleType(name)
    module.__dict__.update(attrs)
    sys.modules[name] = module
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


class FakeHass:
    """Just enough of HomeAssistant: a data dict, a config folder, an executor."""

    def __init__(self, config_dir: Path | str = ".") -> None:
        self.data: dict = {}
        self.stored: dict = {}
        self._config_dir = Path(config_dir)
        self.config = types.SimpleNamespace(path=lambda *parts: str(self._config_dir.joinpath(*parts)))

    async def async_add_executor_job(self, func, *args):
        return func(*args)
