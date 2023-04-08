from typing import Dict, Any, List
from dataclasses import dataclass

@dataclass
class GeocodeFeature:
    id: str
    type: str
    place_type: List[str]
    relevance: float
    text: str
    place_name: str
    center: List[float]


@dataclass
class GeocodeResponse:
    type: str
    query: List[str]
    features: List[GeocodeFeature]
