"""Server-side spatial engine: a metric model of the plan, RF path loss,
findings, and compact outputs for AI assistants (LLM tools, the `query`
service).

Everything here except `model.async_build_model` and `links_adapter` is
pure Python with no Home Assistant imports, so it can be tested on its own
and reasoned about without a running instance.
"""
