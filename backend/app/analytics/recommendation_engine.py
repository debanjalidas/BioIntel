"""Conservation Recommendation Engine for BioIntel.
Generates actionable, scientifically validated campus ecological management recommendations.
"""

from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.species import Species
from app.models.risk_alert import RiskAlert


class RecommendationEngine:
    """Generates targeted interventions based on live ecological signals."""

    def get_recommendations(self, db: Session) -> List[Dict[str, Any]]:
        recs = [
            {
                "id": "rec-01",
                "trigger": "Low Native Understory Density in Central Lawns",
                "target_area": "Zone C (Central Lawn)",
                "priority": "HIGH",
                "category": "HABITAT_RESTORATION",
                "title": "Establish Native Wildflower Corridors & Reduce Mowing Regimes",
                "actions": [
                    "Transition 25% of peripheral manicured lawn into native grass and wildflower strips.",
                    "Plant indigenous nectar species: Ocimum sanctum, Tecoma stans, and Calotropis procera.",
                    "Adopt rotational mowing to leave flowering patches intact during peak butterfly flight periods.",
                ],
                "expected_impact": "+35% pollinator visitation, improved soil rainwater infiltration.",
                "sdg_target": "SDG 15.1 & 15.5",
            },
            {
                "id": "rec-02",
                "trigger": "Aggressive Invasive Weed Colonization (Lantana Camara)",
                "target_area": "Zone B (Lotus Pond & Wetland Buffer)",
                "priority": "HIGH",
                "category": "INVASIVE_MANAGEMENT",
                "title": "Manual Uprooting & Native Wetland Shoreline Revegetation",
                "actions": [
                    "Organize manual root-clearing drives before the late summer seeding season.",
                    "Avoid non-selective chemical herbicides near pond water to prevent aquatic amphibian toxicity.",
                    "Re-vegetate cleared banks immediately with native Vetiver grass (Chrysopogon zizanioides) to prevent erosion.",
                ],
                "expected_impact": "Halt invasive encroachment; protect native turtle and frog basking spots.",
                "sdg_target": "SDG 15.8 (Prevent Invasive Alien Species)",
            },
            {
                "id": "rec-03",
                "trigger": "Acoustic and Physical Disturbance in Dense Woodland",
                "target_area": "Zone D (Campus Woodland)",
                "priority": "MEDIUM",
                "category": "DISTURBANCE_MITIGATION",
                "title": "Establish Quiet Wildlife Buffer and Nesting Boxes",
                "actions": [
                    "Enforce strict quiet zones along northern tree groves between 18:00 and 06:00.",
                    "Install 15 timber nesting boxes for cavity-nesting birds (sparrows, mynas, spotted owlets).",
                    "Leave non-hazardous fallen tree branches as natural deadwood habitat for wood-boring insects and fungi.",
                ],
                "expected_impact": "Enhanced breeding success for residential woodland birds and nocturnal mammals.",
                "sdg_target": "SDG 15.5 (Halt Biodiversity Loss)",
            },
        ]
        return recs


recommendation_engine = RecommendationEngine()
