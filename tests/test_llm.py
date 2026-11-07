"""The LLM tools platform (llm.py), with homeassistant.helpers.llm,
homeassistant.components.llm and probatio stubbed: off by default, prefixed
names tagged with the integration, Home Assistant API only, and harmless on
a Home Assistant without the LLM platform.

    python3 -m unittest discover -s tests
"""

from __future__ import annotations

import asyncio
import dataclasses
import sys
import types
import unittest

import stubs

PKG = "sc_llm_test"


class _Schema:
    def __init__(self, schema):
        self.schema = schema

    def __call__(self, data):
        for key in self.schema:
            if isinstance(key, _Required) and key.name not in data:
                raise ValueError(f"missing {key.name}")
        return dict(data)


class _Required:
    def __init__(self, name):
        self.name = name


@dataclasses.dataclass
class _ToolResult:
    data: dict
    error: bool = False


class _Tool:
    name: str
    title = None
    description = None
    integration = None


@dataclasses.dataclass
class _LLMTools:
    tools: list
    prompt: str | None = None


def _load(with_llm: bool, settings: dict, run_tool=None):
    for name in [m for m in sys.modules if m.startswith(PKG)] + ["probatio", "homeassistant.components.llm", "homeassistant.helpers.llm"]:
        sys.modules.pop(name, None)
    stubs.stub("homeassistant")
    stubs.stub("homeassistant.core", HomeAssistant=object, callback=lambda f: f)
    stubs.stub("homeassistant.components")
    stubs.stub("homeassistant.helpers")
    if with_llm:
        stubs.stub("probatio", Schema=_Schema, Required=_Required, Optional=lambda n: n, In=lambda v: v)
        stubs.stub("homeassistant.components.llm", LLMTools=_LLMTools)
        stubs.stub(
            "homeassistant.helpers.llm",
            LLM_API_HOME_ASSISTANT="homeassistant",
            LLMContext=object,
            Tool=_Tool,
            ToolAnnotations=lambda **kw: types.SimpleNamespace(**kw),
            ToolInput=object,
            ToolResult=_ToolResult,
        )
    stubs.new_package(PKG)
    stubs.stub(f"{PKG}.const", DOMAIN="spatial_context")
    stubs.stub(f"{PKG}.storage", cached_settings=lambda hass: settings)
    stubs.new_package(f"{PKG}.spatial")

    class NotFound(LookupError):
        pass

    async def default_run(hass, tool, args):
        return {"tool": tool, "args": args}

    stubs.stub(f"{PKG}.spatial.ai", NotFound=NotFound, async_run_tool=run_tool or default_run)
    return stubs.load(PKG, "llm"), NotFound


class LLMToolsTest(unittest.TestCase):
    def test_off_by_default(self) -> None:
        llm, _ = _load(True, {"llm_tools_enabled": False})
        self.assertIsNone(llm.async_get_tools(object(), object(), "homeassistant"))
        llm, _ = _load(True, {})
        self.assertIsNone(llm.async_get_tools(object(), object(), "homeassistant"))

    def test_enabled_tools_are_prefixed_and_tagged(self) -> None:
        llm, _ = _load(True, {"llm_tools_enabled": True})
        result = llm.async_get_tools(object(), object(), "homeassistant")
        names = [tool.name for tool in result.tools]
        self.assertEqual(
            names,
            [
                "spatial_context__summary",
                "spatial_context__device_context",
                "spatial_context__path",
                "spatial_context__weak_links",
                "spatial_context__room",
            ],
        )
        for tool in result.tools:
            self.assertEqual(tool.integration, "spatial_context")
            self.assertTrue(tool.annotations.read_only)
            self.assertFalse(tool.annotations.open_world)
            self.assertTrue(tool.description)
        self.assertIn("ordinal", result.prompt)

    def test_only_the_admin_api(self) -> None:
        llm, _ = _load(True, {"llm_tools_enabled": True})
        self.assertIsNone(llm.async_get_tools(object(), object(), "assist"))

    def test_a_call_runs_the_tool_and_reports_lookup_errors(self) -> None:
        calls = []

        async def run(hass, tool, args):
            calls.append((tool, args))
            if args.get("device") == "missing":
                raise not_found("No device matches 'missing'")
            return {"ok": True}

        llm, not_found = _load(True, {"llm_tools_enabled": True}, run)
        tools = {t.name: t for t in llm.async_get_tools(object(), object(), "homeassistant").tools}
        context_tool = tools["spatial_context__device_context"]
        ok = asyncio.run(context_tool.async_call(object(), types.SimpleNamespace(tool_args={"device": "d1"}), object()))
        self.assertEqual(ok.data, {"ok": True})
        bad = asyncio.run(context_tool.async_call(object(), types.SimpleNamespace(tool_args={"device": "missing"}), object()))
        self.assertTrue(bad.error)
        self.assertIn("missing", bad.data["error"])
        self.assertEqual(calls[0], ("device_context", {"device": "d1"}))

    def test_without_the_llm_platform_nothing_breaks(self) -> None:
        llm, _ = _load(False, {"llm_tools_enabled": True})
        self.assertIsNone(llm.async_get_tools(object(), object(), "homeassistant"))


if __name__ == "__main__":
    unittest.main()
