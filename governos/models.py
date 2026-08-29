from typing import Literal

from pydantic import BaseModel, Field


class Node(BaseModel):
    id: str
    name: str
    type: Literal["file", "class", "function", "import", "module"]
    filepath: str
    start_line: int | None = None
    end_line: int | None = None
    docstring: str | None = None
    metadata: dict[str, str] = Field(default_factory=dict)


class Edge(BaseModel):
    source: str
    target: str
    type: Literal["contains", "calls", "inherits", "imports"]
    metadata: dict[str, str] = Field(default_factory=dict)


class GraphData(BaseModel):
    nodes: list[Node]
    edges: list[Edge]
    metadata: dict[str, str] = Field(default_factory=dict)
