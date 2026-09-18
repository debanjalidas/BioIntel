"""AI Vision Service for Species Identification.
Implements the swappable SpeciesIdentificationService interface with realistic multi-candidate classification.
"""

from abc import ABC, abstractmethod
from typing import List, Optional, Dict, Any
import random
import os
from pydantic import BaseModel


class SpeciesCandidate(BaseModel):
    species_id: Optional[int] = None
    common_name: str
    scientific_name: str
    category: str
    confidence: float
    habitat: str
    native_status: str
    conservation_status: str
    is_invasive: bool = False
    description: str
    image_url: Optional[str] = None


class SpeciesIdentificationResult(BaseModel):
    likely_species: str
    scientific_name: str
    category: str
    confidence: float
    verification_recommendation: str = "Human verification recommended"
    is_low_confidence: bool = False
    warning_message: Optional[str] = None
    candidates: List[SpeciesCandidate] = []
    evidence_quality: str = "Moderate"
    provider: str = "mock"


# Realistic species database for college campus biodiversity
CAMPUS_SPECIES_KNOWLEDGE = [
    {
        "common_name": "Common Myna",
        "scientific_name": "Acridotheres tristis",
        "category": "birds",
        "habitat": "Urban Canopy & Garden",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Medium-sized brown passerine bird with yellow eye patches, bill, and legs. Extremely common in Indian campus gardens.",
        "image_url": "/images/species/common_myna.jpg",
        "related": [
            ("Bank Myna", "Acridotheres ginginianus", 0.04),
            ("Jungle Myna", "Acridotheres fuscus", 0.02),
        ],
    },
    {
        "common_name": "Red-vented Bulbul",
        "scientific_name": "Pycnonotus cafer",
        "category": "birds",
        "habitat": "Botanical Garden & Scrub",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Vocal songbird easily identified by dark crest and bright crimson vent under tail. Consumes berries, nectar and small insects.",
        "image_url": "/images/species/red_vented_bulbul.jpg",
        "related": [
            ("Red-whiskered Bulbul", "Pycnonotus jocosus", 0.05),
            ("White-eared Bulbul", "Pycnonotus leucotis", 0.03),
        ],
    },
    {
        "common_name": "Indian Peafowl",
        "scientific_name": "Pavo cristatus",
        "category": "birds",
        "habitat": "Campus Woodlands & Lawns",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "National bird of India. Resident in protected university campus groves with spectacular iridescent blue-green plumage.",
        "image_url": "/images/species/indian_peafowl.jpg",
        "related": [
            ("Grey Francolin", "Francolinus pondicerianus", 0.03),
            ("Indian Junglefowl", "Gallus sonneratii", 0.02),
        ],
    },
    {
        "common_name": "Plain Tiger Butterfly",
        "scientific_name": "Danaus chrysippus",
        "category": "butterflies",
        "habitat": "Flower Gardens & Lawns",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Bright tawny butterfly with black margins and white spots. Feeds on Calotropis (milkweed) sap, unpalatable to birds.",
        "image_url": "/images/species/plain_tiger_butterfly.jpg",
        "related": [
            ("Striped Tiger", "Danaus genutia", 0.06),
            ("Common Crow Butterfly", "Euploea core", 0.03),
        ],
    },
    {
        "common_name": "Lantana Camara",
        "scientific_name": "Lantana camara",
        "category": "plants",
        "habitat": "Woodland Edge & Disturbed Soil",
        "native_status": "invasive",
        "conservation_status": "LC",
        "is_invasive": True,
        "description": "Highly aggressive invasive alien shrub with multi-colored floral clusters. Smothers native understory flora across campus edges.",
        "image_url": "/images/species/lantana_camara.jpg",
        "related": [
            ("Parthenium Weed", "Parthenium hysterophorus", 0.05),
            ("Siam Weed", "Chromolaena odorata", 0.03),
        ],
    },
    {
        "common_name": "Indian Honey Bee",
        "scientific_name": "Apis cerana indica",
        "category": "insects",
        "habitat": "Flowering Canopies & Botanical Garden",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Crucial indigenous pollinator essential for campus flora reproduction and wild fruit set. Highly sensitive to chemical sprays.",
        "image_url": "/images/species/indian_honey_bee.jpg",
        "related": [
            ("Little Honey Bee", "Apis florea", 0.05),
            ("Giant Honey Bee", "Apis dorsata", 0.02),
        ],
    },
    {
        "common_name": "Neem Tree",
        "scientific_name": "Azadirachta indica",
        "category": "plants",
        "habitat": "Avenue Plantation & Arboretums",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Resilient evergreen tree with pinnate leaves and medicinal neem seed oil. Key bio-filter for campus ambient air quality.",
        "image_url": "/images/species/neem_tree.jpg",
        "related": [
            ("Bakain / Persian Lilac", "Melia azedarach", 0.05),
            ("Curry Leaf Tree", "Murraya koenigii", 0.02),
        ],
    },
    {
        "common_name": "Indian Flapshell Turtle",
        "scientific_name": "Lissemys punctata",
        "category": "reptiles",
        "habitat": "Campus Lotus Pond & Wetland",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Freshwater softshell turtle with smooth olive carapace and yellow reticulated spots. Basks on fallen logs in Zone B Lotus Pond.",
        "image_url": "/images/species/indian_flapshell_turtle.jpg",
        "related": [
            ("Indian Roofed Turtle", "Pangshura tecta", 0.04),
            ("Indian Black Turtle", "Melanochelys trijuga", 0.02),
        ],
    },
    {
        "common_name": "Five-striped Palm Squirrel",
        "scientific_name": "Funambulus pennantii",
        "category": "mammals",
        "habitat": "Garden Canopies & Building Facades",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Agile rodent with distinct five pale dorsal stripes. Widespread across campus lawns, feeds on seeds, buds, and nectar.",
        "image_url": "/images/species/five_striped_palm_squirrel.jpg",
        "related": [
            ("Three-striped Palm Squirrel", "Funambulus palmarum", 0.06),
            ("Indian Tree Shrew", "Anathana ellioti", 0.02),
        ],
    },
    {
        "common_name": "Black Kite",
        "scientific_name": "Milvus migrans",
        "category": "birds",
        "habitat": "Thermals & High Canopies",
        "native_status": "native",
        "conservation_status": "LC",
        "is_invasive": False,
        "description": "Medium-sized raptor with shallow-forked tail. Soars above campus feeding on small vertebrates and carrion.",
        "image_url": "/images/species/black_kite.jpg",
        "related": [
            ("Brahminy Kite", "Haliastur indus", 0.04),
            ("Shikra", "Accipiter badius", 0.02),
        ],
    },
]


class SpeciesIdentificationService(ABC):
    """Abstract interface for species vision classification engines."""

    @abstractmethod
    def identify_image(
        self,
        image_bytes: Optional[bytes] = None,
        filename: Optional[str] = None,
        hint_category: Optional[str] = None,
    ) -> SpeciesIdentificationResult:
        pass


class MockVisionProvider(SpeciesIdentificationService):
    """Simulates realistic species identification matching campus flora/fauna."""

    def identify_image(
        self,
        image_bytes: Optional[bytes] = None,
        filename: Optional[str] = None,
        hint_category: Optional[str] = None,
    ) -> SpeciesIdentificationResult:
        fn_lower = (filename or "").lower()

        # Handle blurry, obscured, or low-quality images
        if any(term in fn_lower for term in ["blur", "unclear", "dark", "low_quality", "unknown", "noise"]):
            return SpeciesIdentificationResult(
                likely_species="Unknown / Unidentifiable Specimen",
                scientific_name="Incertae sedis",
                category="other",
                confidence=0.38,
                verification_recommendation="Human verification required due to low optical clarity",
                is_low_confidence=True,
                warning_message="Low confidence. The image is insufficient for reliable identification. Please upload a clearer image or request human verification.",
                candidates=[
                    SpeciesCandidate(
                        common_name="Indeterminate Passerine",
                        scientific_name="Passeriformes sp.",
                        category="birds",
                        confidence=0.38,
                        habitat="Uncertain",
                        native_status="native",
                        conservation_status="DD",
                        description="Specimen silhouette insufficient for reliable diagnostic identification.",
                    ),
                    SpeciesCandidate(
                        common_name="Indeterminate Foliage",
                        scientific_name="Magnoliopsida sp.",
                        category="plants",
                        confidence=0.32,
                        habitat="Uncertain",
                        native_status="native",
                        conservation_status="DD",
                        description="Diagnostic venation and floral structures obscured.",
                    ),
                ],
                evidence_quality="Low",
                provider="mock_vision",
            )

        # Match species based on filename hints or category
        selected = None
        for sp in CAMPUS_SPECIES_KNOWLEDGE:
            key_name = sp["common_name"].lower().replace(" ", "").replace("-", "")
            if key_name in fn_lower.replace(" ", "").replace("-", ""):
                selected = sp
                break
            if hint_category and sp["category"].lower() == hint_category.lower():
                selected = sp
                break

        if not selected:
            # Pick a representative campus species
            selected = CAMPUS_SPECIES_KNOWLEDGE[0]

        top_conf = round(random.uniform(0.91, 0.96), 2)
        related = selected.get("related", [])
        
        candidates = [
            SpeciesCandidate(
                common_name=selected["common_name"],
                scientific_name=selected["scientific_name"],
                category=selected["category"],
                confidence=top_conf,
                habitat=selected["habitat"],
                native_status=selected["native_status"],
                conservation_status=selected["conservation_status"],
                is_invasive=selected["is_invasive"],
                description=selected["description"],
                image_url=selected.get("image_url"),
            )
        ]

        remaining_conf = 1.0 - top_conf
        for rel_name, rel_sci, rel_weight in related:
            conf_share = round(min(remaining_conf * 0.7, rel_weight + random.uniform(0.01, 0.03)), 2)
            remaining_conf -= conf_share
            candidates.append(
                SpeciesCandidate(
                    common_name=rel_name,
                    scientific_name=rel_sci,
                    category=selected["category"],
                    confidence=conf_share,
                    habitat=selected["habitat"],
                    native_status="native",
                    conservation_status="LC",
                    is_invasive=False,
                    description=f"Closely related morphologically to {selected['common_name']}.",
                )
            )

        return SpeciesIdentificationResult(
            likely_species=selected["common_name"],
            scientific_name=selected["scientific_name"],
            category=selected["category"],
            confidence=top_conf,
            verification_recommendation="Human verification recommended",
            is_low_confidence=False,
            candidates=candidates,
            evidence_quality="High" if top_conf >= 0.90 else "Moderate",
            provider="mock_vision",
        )


def get_vision_service() -> SpeciesIdentificationService:
    """Factory method providing active SpeciesIdentificationService based on system configuration."""
    from app.core.config import settings
    # Can swap to HuggingFace or IBM Granite Vision provider here
    return MockVisionProvider()
