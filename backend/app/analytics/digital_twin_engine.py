"""Digital Twin & Ecological Scenario Simulator for BioIntel.
Models 5 designated College Campus Zones and calculates 'What-if' simulation projections.
"""

from typing import List, Dict, Any


class DigitalTwinEngine:
    """Simulates zone-level metrics and hypothetical environmental restoration scenarios."""

    CAMPUS_ZONES = [
        {
            "id": "zone-a",
            "name": "Zone A — Botanical Garden",
            "code": "ZONE_A",
            "area_hectares": 3.2,
            "center": [28.5462, 77.1930],
            "habitat_type": "Medicinal & Floral Garden",
            "species_count": 38,
            "observations_count": 118,
            "health_score": 86.4,
            "canopy_cover_pct": 68.0,
            "dominant_taxa": "Butterflies, Native Bees, Passerines",
            "risk_level": "LOW",
            "status": "FLOURISHING",
        },
        {
            "id": "zone-b",
            "name": "Zone B — Lotus Pond & Wetland",
            "code": "ZONE_B",
            "area_hectares": 2.1,
            "center": [28.5448, 77.1945],
            "habitat_type": "Freshwater Wetland & Reeds",
            "species_count": 29,
            "observations_count": 84,
            "health_score": 79.2,
            "canopy_cover_pct": 45.0,
            "dominant_taxa": "Turtles, Amphibians, Dragonflies, Waterfowl",
            "risk_level": "MEDIUM",
            "status": "VULNERABLE (Invasive Weed Shore)",
        },
        {
            "id": "zone-c",
            "name": "Zone C — Central Lawn & Meadows",
            "code": "ZONE_C",
            "area_hectares": 4.8,
            "center": [28.5450, 77.1915],
            "habitat_type": "Open Grassland & Lawns",
            "species_count": 19,
            "observations_count": 52,
            "health_score": 68.1,
            "canopy_cover_pct": 22.0,
            "dominant_taxa": "Squirrels, Common Mynas, Pigeons",
            "risk_level": "MEDIUM",
            "status": "MODERATE DIVERSITY",
        },
        {
            "id": "zone-d",
            "name": "Zone D — Dense Woodland & Arboretum",
            "code": "ZONE_D",
            "area_hectares": 6.5,
            "center": [28.5475, 77.1910],
            "habitat_type": "Mature Forest Canopy",
            "species_count": 44,
            "observations_count": 142,
            "health_score": 88.7,
            "canopy_cover_pct": 84.0,
            "dominant_taxa": "Peafowl, Raptors, Owls, Flying Foxes",
            "risk_level": "LOW",
            "status": "CORE REFUGE",
        },
        {
            "id": "zone-e",
            "name": "Zone E — Academic & Administrative Area",
            "code": "ZONE_E",
            "area_hectares": 5.2,
            "center": [28.5435, 77.1920],
            "habitat_type": "Built Infrastructure & Avenue Trees",
            "species_count": 14,
            "observations_count": 46,
            "health_score": 62.3,
            "canopy_cover_pct": 31.0,
            "dominant_taxa": "Sparrows, Geckos, Urban Adapted Birds",
            "risk_level": "LOW",
            "status": "ANTHROPOGENIC ZONE",
        },
    ]

    def get_zones(self) -> List[Dict[str, Any]]:
        return self.CAMPUS_ZONES

    def simulate_scenario(
        self,
        native_vegetation_delta_pct: float = 20.0,
        pesticide_reduction_pct: float = 50.0,
        invasive_removal_pct: float = 50.0,
    ) -> Dict[str, Any]:
        """Calculates simulated effects of restoration policies."""
        # Baseline campus metrics
        base_health = 78.0
        base_pollinators = 65.0
        base_richness = 54

        # Estimated ecological impact coefficients
        pollinator_gain = (native_vegetation_delta_pct * 0.55) + (pesticide_reduction_pct * 0.35)
        richness_gain = (native_vegetation_delta_pct * 0.30) + (invasive_removal_pct * 0.20)
        health_gain = (
            (native_vegetation_delta_pct * 0.15)
            + (pesticide_reduction_pct * 0.08)
            + (invasive_removal_pct * 0.12)
        )

        sim_pollinators = min(100.0, base_pollinators + pollinator_gain)
        sim_richness = round(base_richness + (base_richness * (richness_gain / 100.0)))
        sim_health = min(98.0, round(base_health + health_gain, 1))

        return {
            "scenario_parameters": {
                "native_vegetation_increase_pct": native_vegetation_delta_pct,
                "pesticide_reduction_pct": pesticide_reduction_pct,
                "invasive_removal_pct": invasive_removal_pct,
            },
            "baseline": {
                "health_score": base_health,
                "pollinator_habitat_index": base_pollinators,
                "species_richness": base_richness,
            },
            "simulated_outcome": {
                "health_score": sim_health,
                "health_score_change": round(sim_health - base_health, 1),
                "pollinator_habitat_index": round(sim_pollinators, 1),
                "pollinator_habitat_change_pct": round(pollinator_gain, 1),
                "estimated_species_richness": sim_richness,
                "species_richness_change": sim_richness - base_richness,
            },
            "disclaimer": (
                "Simulation / scenario estimate — not a guaranteed ecological prediction. "
                "Models non-linear ecological response based on conservative scientific literature estimates."
            ),
        }


digital_twin_engine = DigitalTwinEngine()
