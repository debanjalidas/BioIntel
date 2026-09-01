"""
Large-Scale Dataset Generator for BioIntel Platform
Produces comprehensive, production-grade datasets (50 to 150+ records per dataset):
1. species_catalog.csv: 65+ curated species across 7 taxonomic classes with IUCN statuses & metadata.
2. gbif_species_occurrences.csv: 150+ geolocated field observations with GPS coordinates & habitat tags.
3. edna_metabarcoding_samples.csv: 50+ water/soil eDNA sampling records with physicochemical metrics.
4. edna_taxonomic_detections.csv: 120+ eDNA OTU/ASV metagenomic detection records with read counts.
5. pam_acoustic_detections.csv: 100+ bioacoustic PAM vocalization detections across monitoring sites.
6. vegetation_canopy_timeseries.csv: 120+ remote sensing monthly captures (NDVI, EVI, Canopy, Temp, Alerts).
7. monitoring_sites.geojson: 8 major global & regional biodiversity hotspots with coordinate boundaries.
"""

import os
import sys
import json
import random
from datetime import datetime, timedelta
import pandas as pd

# Set deterministic seed for reproducible research-grade datasets
random.seed(42)

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_DIR = os.path.join(BASE_DIR, "data")
AUDIO_DIR = os.path.join(DATA_DIR, "audio")
DEMO_DIR = os.path.join(DATA_DIR, "demo")
SATELLITE_DIR = os.path.join(DATA_DIR, "satellite")

for directory in [DATA_DIR, AUDIO_DIR, DEMO_DIR, SATELLITE_DIR]:
    os.makedirs(directory, exist_ok=True)

print("=" * 70)
print("BioIntel Large-Scale Dataset Generator (50 - 150+ Records)")
print(f"Destination: {DATA_DIR}")
print("=" * 70)

# =====================================================================
# 1. SPECIES CATALOG (65+ Real Taxonomic Species)
# =====================================================================
print("\n[1/6] Building Comprehensive Species Catalog (65+ Species)...")

raw_species_records = [
    # Mammalia (20)
    ("Panthera tigris tigris", "Bengal Tiger", "Mammalia", "Felidae", "Panthera", "EN", "15955", False, True, "Apex predator and umbrella indicator for intact Asian forest ecosystems."),
    ("Elephas maximus", "Asian Elephant", "Mammalia", "Elephantidae", "Elephas", "EN", "7140", False, True, "Mega-herbivore engineer sustaining forest corridors and seed dispersal."),
    ("Rhinoceros unicornis", "Greater One-Horned Rhinoceros", "Mammalia", "Rhinocerotidae", "Rhinoceros", "VU", "19496", False, True, "Alluvial grassland specialist and grazing architect."),
    ("Panthera pardus", "Leopard", "Mammalia", "Felidae", "Panthera", "VU", "15954", False, False, "Adaptable felid predator inhabiting dense canopy and rocky hills."),
    ("Platanista gangetica", "Ganges River Dolphin", "Mammalia", "Platanistidae", "Platanista", "EN", "41758", False, True, "Freshwater bio-indicator sensitive to aquatic noise and siltation."),
    ("Ailurus fulgens", "Red Panda", "Mammalia", "Ailuridae", "Ailurus", "EN", "714", False, True, "Specialized subalpine bamboo forest dweller."),
    ("Neofelis nebulosa", "Clouded Leopard", "Mammalia", "Felidae", "Neofelis", "VU", "14519", False, True, "Arboreal rainforest predator of primary evergreen forests."),
    ("Cuon alpinus", "Dhole / Asiatic Wild Dog", "Mammalia", "Canidae", "Cuon", "EN", "5929", False, True, "Social pack hunter vulnerable to habitat fragmentation and prey loss."),
    ("Hoolock hoolock", "Western Hoolock Gibbon", "Mammalia", "Hylobatidae", "Hoolock", "EN", "39876", False, True, "Only ape species of South Asia; strictly canopy frugivore."),
    ("Melursus ursinus", "Sloth Bear", "Mammalia", "Ursidae", "Melursus", "VU", "13143", False, False, "Myrmecophagous forest bear dependent on termite mounds and fruiting trees."),
    ("Manis crassicaudata", "Indian Pangolin", "Mammalia", "Manidae", "Manis", "EN", "12761", False, True, "Heavily trafficked nocturnal burrower maintaining soil aeration."),
    ("Loris tardigradus", "Slender Loris", "Mammalia", "Lorisidae", "Loris", "EN", "12375", False, True, "Nocturnal insectivorous primate of tropical rainforests."),
    ("Trachypithecus geei", "Golden Langur", "Mammalia", "Cercopithecidae", "Trachypithecus", "EN", "22129", False, True, "Restricted-range primate of riparian evergreen river islands."),
    ("Bubalus arnee", "Wild Water Buffalo", "Mammalia", "Bovidae", "Bubalus", "EN", "3129", False, True, "Riparian floodplain ungulate requiring deep marshes."),
    ("Moschus chrysogaster", "Alpine Musk Deer", "Mammalia", "Moschidae", "Moschus", "EN", "13897", False, True, "High-altitude montane specialist targeted for musk pods."),
    ("Lutra lutra", "Eurasian Otter", "Mammalia", "Mustelidae", "Lutra", "NT", "12419", False, True, "Riparian river health indicator requiring clear flowing streams."),
    ("Prionailurus viverrinus", "Fishing Cat", "Mammalia", "Felidae", "Prionailurus", "VU", "18150", False, True, "Wetland-dependent felid vulnerable to coastal marsh drainage."),
    ("Axis axis", "Chital / Spotted Deer", "Mammalia", "Cervidae", "Axis", "LC", "41783", False, False, "Abundant primary forest prey base for apex predators."),
    ("Sus scrofa", "Wild Boar", "Mammalia", "Suidae", "Sus", "LC", "41775", False, False, "Generalist rooting omnivore shaping forest floor soil mechanics."),
    ("Macaca radiata", "Bonnet Macaque", "Mammalia", "Cercopithecidae", "Macaca", "LC", "12558", False, False, "Widespread troop monkey in peninsular forests."),

    # Aves (15)
    ("Buceros bicornis", "Great Hornbill", "Aves", "Bucerotidae", "Buceros", "VU", "22682453", False, True, "Large canopy seed disperser requiring mature cavity nest trees."),
    ("Gyps bengalensis", "White-Rumped Vulture", "Aves", "Accipitridae", "Gyps", "CR", "22695194", False, True, "Critically depleted obligate scavenger preventing carcass disease vectors."),
    ("Ardea insignis", "White-Bellied Heron", "Aves", "Ardeidae", "Ardea", "CR", "22697089", False, True, "Extremely rare undisturbed subtropical riverine heron."),
    ("Strix aluco", "Tawny Owl", "Aves", "Strigidae", "Strix", "LC", "22689176", False, True, "Nocturnal woodland raptor used in passive acoustic monitoring."),
    ("Pavo cristatus", "Indian Peafowl", "Aves", "Phasianidae", "Pavo", "LC", "22679435", False, False, "Prominent ground forager of open deciduous forest edges."),
    ("Sarcogyps calvus", "Red-Headed Vulture", "Aves", "Accipitridae", "Sarcogyps", "CR", "22695254", False, True, "Scavenger vulnerable to veterinary NSAID contamination."),
    ("Alcedo atthis", "Common Kingfisher", "Aves", "Alcedinidae", "Alcedo", "LC", "22683027", False, True, "Indicator of clear, unpolluted freshwater streams and small fish stocks."),
    ("Pitta brachyura", "Indian Pitta", "Aves", "Pittidae", "Pitta", "LC", "22698681", False, True, "Ground-foraging migratory passerine in dense undergrowth."),
    ("Bubo bubo", "Eurasian Eagle-Owl", "Aves", "Strigidae", "Bubo", "LC", "22689050", False, True, "Apex avian predator of cliff gorges and deep forests."),
    ("Haliaeetus leucogaster", "White-Bellied Sea-Eagle", "Aves", "Accipitridae", "Haliaeetus", "LC", "22695135", False, True, "Coastal and mangrove raptor hunting fish and sea snakes."),
    ("Ciconia boyciana", "Oriental Stork", "Aves", "Ciconiidae", "Ciconia", "EN", "22697695", False, True, "Wetland-dependent wading bird threatened by drainage and pesticide buildup."),
    ("Eudynamys scolopaceus", "Asian Koel", "Aves", "Cuculidae", "Eudynamys", "LC", "22684043", False, False, "Vocal brood parasite widespread in subtropical canopy."),
    ("Corvus splendens", "House Crow", "Aves", "Corvidae", "Corvus", "LC", "22705938", False, False, "Urban-fringe generalist scavenger."),
    ("Eurystomus orientalis", "Dollarbird", "Aves", "Coraciidae", "Eurystomus", "LC", "22682910", False, True, "Aerial insectivore nesting in high hollow dead wood."),
    ("Psittacula krameri", "Rose-Ringed Parakeet", "Aves", "Psittaculidae", "Psittacula", "LC", "22685441", False, False, "Common canopy frugivore forming large roosts."),

    # Reptilia & Amphibia (12)
    ("Crocodylus porosus", "Saltwater Crocodile", "Reptilia", "Crocodylidae", "Crocodylus", "LC", "5668", False, False, "Largest extant reptile controlling estuarine trophic chains."),
    ("Gavialis gangeticus", "Gharial", "Reptilia", "Gavialidae", "Gavialis", "CR", "8966", False, True, "Specialized fish-eating crocodilian requiring deep sandbar river pools."),
    ("Ophiophagus hannah", "King Cobra", "Reptilia", "Elapidae", "Ophiophagus", "VU", "14958", False, True, "World's longest venomous snake preying exclusively on other serpents."),
    ("Varanus salvator", "Water Monitor", "Reptilia", "Varanidae", "Varanus", "LC", "17821", False, False, "Semi-aquatic scavenger and predator in mangrove estuaries."),
    ("Python bivittatus", "Burmese Python", "Reptilia", "Pythonidae", "Python", "VU", "193451", False, False, "Large constrictor regulating small mammal populations."),
    ("Nasikabatrachus sahyadrensis", "Purple Frog", "Amphibia", "Nasikabatrachidae", "Nasikabatrachus", "EN", "58479", False, True, "Living fossil subterranean frog emerging only during monsoon."),
    ("Rhacophorus malabaricus", "Malabar Gliding Frog", "Amphibia", "Rhacophoridae", "Rhacophorus", "LC", "58993", False, True, "Tree frog using expanded toe webbing for canopy gliding."),
    ("Duttaphrynus melanostictus", "Asian Common Toad", "Amphibia", "Bufonidae", "Duttaphrynus", "LC", "54707", False, False, "Resilient nocturnal terrestrial amphibian."),
    ("Indirana beddomii", "Beddome's Leaping Frog", "Amphibia", "Ranixalidae", "Indirana", "LC", "58309", False, True, "Endemic forest floor frog inhabiting moist leaf litter."),
    ("Naja naja", "Spectacled Cobra", "Reptilia", "Elapidae", "Naja", "LC", "62238", False, False, "Medically significant elapid snake in agricultural-forest mosaics."),
    ("Bungarus caeruleus", "Common Krait", "Reptilia", "Elapidae", "Bungarus", "LC", "172703", False, False, "Nocturnal venomous snake feeding on rodents and other reptiles."),
    ("Melanochelys trijuga", "Indian Black Turtle", "Reptilia", "Geoemydidae", "Melanochelys", "NT", "13039", False, False, "Freshwater marsh and pond scavenger."),

    # Actinopterygii & Freshwater Biota (8)
    ("Tor putitora", "Golden Mahseer", "Actinopterygii", "Cyprinidae", "Tor", "EN", "1263198", False, True, "Flagship sportfish indicating cold, pristine Himalayan torrent rivers."),
    ("Channa marulius", "Great Snakehead", "Actinopterygii", "Channidae", "Channa", "LC", "166545", False, False, "Apex wetland predatory fish adapted to low-oxygen waters."),
    ("Tenualosa ilisha", "Hilsa Shad", "Actinopterygii", "Clupeidae", "Tenualosa", "LC", "166442", False, True, "Anadromous fish migrating upstream through estuarine channels to spawn."),
    ("Wallago attu", "Helicopter Catfish", "Actinopterygii", "Siluridae", "Wallago", "VU", "166523", False, True, "Large predatory catfish vulnerable to overfishing and dams."),
    ("Horabagrus brachysoma", "Sun Catfish", "Actinopterygii", "Horabagridae", "Horabagrus", "VU", "172312", False, True, "Western Ghats endemic river catfish sensitive to sand mining."),
    ("Dawkinsia denisonii", "Denison Barb / Miss Kerala", "Actinopterygii", "Cyprinidae", "Dawkinsia", "EN", "169629", False, True, "High-value endemic ornamental fish found only in fast streams."),
    ("Oreochromis niloticus", "Nile Tilapia", "Actinopterygii", "Cichlidae", "Oreochromis", "LC", "NA", True, False, "Invasive cichlid outcompeting indigenous freshwater fish species."),
    ("Hypophthalmichthys nobilis", "Bighead Carp", "Actinopterygii", "Cyprinidae", "Hypophthalmichthys", "LC", "NA", True, False, "Invasive filter feeder altering lake and wetland plankton dynamics."),

    # Plantae & Flora (6)
    ("Lantana camara", "Lantana Weed", "Plantae", "Verbenaceae", "Lantana", "LC", "NA", True, False, "Highly aggressive invasive shrub smothering native understory."),
    ("Eichhornia crassipes", "Water Hyacinth", "Plantae", "Pontederiaceae", "Eichhornia", "LC", "NA", True, False, "Invasive floating aquatic weed causing eutrophication and oxygen crashes."),
    ("Avicennia marina", "Grey Mangrove", "Plantae", "Acanthaceae", "Avicennia", "LC", "178828", False, True, "Pioneer mangrove species stabilizing intertidal mudflats."),
    ("Rhizophora mangle", "Red Mangrove", "Plantae", "Rhizophoraceae", "Rhizophora", "LC", "178850", False, True, "Key stilt-rooted mangrove protecting coastlines from cyclone storm surges."),
    ("Ficus benghalensis", "Banyan Tree", "Plantae", "Moraceae", "Ficus", "LC", "NA", False, True, "Keystone strangler fig providing year-round fruit for canopy frugivores."),
    ("Prosopis juliflora", "Mesquite Shrub", "Plantae", "Fabaceae", "Prosopis", "LC", "NA", True, False, "Invasive thorny tree depleting groundwater tables in arid and riparian zones."),

    # Insecta (4)
    ("Troides minos", "Southern Birdwing", "Insecta", "Papilionidae", "Troides", "LC", "12489", False, True, "India's second largest butterfly; indicator of undisturbed rainforest canopy."),
    ("Apis dorsata", "Giant Honeybee", "Insecta", "Apidae", "Apis", "LC", "NA", False, True, "Primary wild forest pollinator sustaining canopy tree reproduction."),
    ("Atta cephalotes", "Leafcutter Ant", "Insecta", "Formicidae", "Atta", "LC", "NA", False, False, "Dominant forest floor biomass turnover agent."),
    ("Anopheles stephensi", "Malaria Vector Mosquito", "Insecta", "Culicidae", "Anopheles", "LC", "NA", False, False, "Urban and forest-edge dipteran vector monitored for zoonotic risks.")
]

species_list = []
for idx, item in enumerate(raw_species_records, 1):
    sc_name, cm_name, tax_grp, fam, gen, status, iucn_id, is_inv, is_ind, desc = item
    species_list.append({
        "id": idx,
        "scientific_name": sc_name,
        "common_name": cm_name,
        "taxonomic_group": tax_grp,
        "family": fam,
        "genus": gen,
        "conservation_status": status,
        "iucn_taxon_id": iucn_id,
        "is_invasive": is_inv,
        "is_indicator_species": is_ind,
        "description": desc,
        "image_url": f"https://images.unsplash.com/photo-{1500000000000 + (idx * 314159) % 900000000}?auto=format&fit=crop&w=800&q=80"
    })

df_species = pd.DataFrame(species_list)
species_csv_path = os.path.join(DEMO_DIR, "species_catalog.csv")
df_species.to_csv(species_csv_path, index=False)
print(f"[OK] Saved: {species_csv_path} ({len(df_species)} species records)")


# =====================================================================
# 2. MONITORING SITES (8 Global & Regional Biodiversity Hotspots)
# =====================================================================
print("\n[2/6] Building Spatial Protected Areas & Monitoring Sites GeoJSON...")

sites_meta = [
    {
        "site_id": 1,
        "name": "Sundarbans Mangrove Biosphere",
        "site_code": "SITE-SND-001",
        "ecosystem_type": "Mangrove / Coastal Wetland",
        "area_sq_km": 4260.0,
        "elevation_m": 7.5,
        "country": "India / Bangladesh",
        "lat": 21.94,
        "lng": 88.85,
        "bounds": [[88.40, 21.60], [89.20, 21.60], [89.20, 22.30], [88.40, 22.30], [88.40, 21.60]],
        "alert_level": "WARNING"
    },
    {
        "site_id": 2,
        "name": "Kaziranga Floodplain Sanctuary",
        "site_code": "SITE-KZR-002",
        "ecosystem_type": "Riparian Alluvial Grassland",
        "area_sq_km": 858.0,
        "elevation_m": 65.0,
        "country": "India",
        "lat": 26.65,
        "lng": 93.35,
        "bounds": [[92.95, 26.50], [93.45, 26.50], [93.45, 26.78], [92.95, 26.78], [92.95, 26.50]],
        "alert_level": "NORMAL"
    },
    {
        "site_id": 3,
        "name": "Western Ghats Rainforest Corridor",
        "site_code": "SITE-WGH-003",
        "ecosystem_type": "Tropical Montane Cloud Forest",
        "area_sq_km": 1600.0,
        "elevation_m": 950.0,
        "country": "India",
        "lat": 10.85,
        "lng": 76.70,
        "bounds": [[76.30, 10.20], [77.10, 10.20], [77.10, 11.10], [76.30, 11.10], [76.30, 10.20]],
        "alert_level": "CRITICAL"
    },
    {
        "site_id": 4,
        "name": "Jim Corbett Himalayan Foothills",
        "site_code": "SITE-CBT-004",
        "ecosystem_type": "Moist Deciduous Sal Forest",
        "area_sq_km": 1288.0,
        "elevation_m": 420.0,
        "country": "India",
        "lat": 29.53,
        "lng": 78.96,
        "bounds": [[78.70, 29.30], [79.20, 29.30], [79.20, 29.75], [78.70, 29.75], [78.70, 29.30]],
        "alert_level": "NORMAL"
    },
    {
        "site_id": 5,
        "name": "Manas Transboundary River Reserve",
        "site_code": "SITE-MNS-005",
        "ecosystem_type": "Sub-Himalayan Bhabar Terai",
        "area_sq_km": 950.0,
        "elevation_m": 115.0,
        "country": "India / Bhutan",
        "lat": 26.75,
        "lng": 91.02,
        "bounds": [[90.80, 26.60], [91.30, 26.60], [91.30, 26.95], [90.80, 26.95], [90.80, 26.60]],
        "alert_level": "NORMAL"
    },
    {
        "site_id": 6,
        "name": "Gir Asiatic Lion Sanctuary",
        "site_code": "SITE-GIR-006",
        "ecosystem_type": "Dry Deciduous Teak & Scrub",
        "area_sq_km": 1412.0,
        "elevation_m": 280.0,
        "country": "India",
        "lat": 21.12,
        "lng": 70.82,
        "bounds": [[70.50, 20.90], [71.15, 20.90], [71.15, 21.35], [70.50, 21.35], [70.50, 20.90]],
        "alert_level": "WARNING"
    },
    {
        "site_id": 7,
        "name": "Periyar Cardamom Hills Watershed",
        "site_code": "SITE-PER-007",
        "ecosystem_type": "Evergreen Rainforest & Reservoir",
        "area_sq_km": 925.0,
        "elevation_m": 1200.0,
        "country": "India",
        "lat": 9.46,
        "lng": 77.14,
        "bounds": [[76.90, 9.25], [77.35, 9.25], [77.35, 9.65], [76.90, 9.65], [76.90, 9.25]],
        "alert_level": "NORMAL"
    },
    {
        "site_id": 8,
        "name": "Namdapha Eastern Himalayan Wilderness",
        "site_code": "SITE-NAM-008",
        "ecosystem_type": "Subtropical Broadleaf & Alpine",
        "area_sq_km": 1985.0,
        "elevation_m": 2200.0,
        "country": "India",
        "lat": 27.48,
        "lng": 96.38,
        "bounds": [[96.15, 27.30], [96.65, 27.30], [96.65, 27.70], [96.15, 27.70], [96.15, 27.30]],
        "alert_level": "NORMAL"
    }
]

geojson_features = []
for s in sites_meta:
    geojson_features.append({
        "type": "Feature",
        "properties": {
            "site_id": s["site_id"],
            "name": s["name"],
            "site_code": s["site_code"],
            "ecosystem_type": s["ecosystem_type"],
            "area_sq_km": s["area_sq_km"],
            "elevation_m": s["elevation_m"],
            "country": s["country"],
            "alert_level": s["alert_level"]
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [s["bounds"]]
        }
    })

geojson_obj = {"type": "FeatureCollection", "features": geojson_features}
sites_geojson_path = os.path.join(SATELLITE_DIR, "monitoring_sites.geojson")
with open(sites_geojson_path, "w", encoding="utf-8") as f:
    json.dump(geojson_obj, f, indent=2)
print(f"[OK] Saved: {sites_geojson_path} ({len(geojson_features)} monitoring sites)")


# =====================================================================
# 3. GBIF / FIELD SPECIES OCCURRENCE OBSERVATIONS (150 Records)
# =====================================================================
print("\n[3/6] Generating Geolocated Species Occurrences (150 Records)...")

observers = ["Dr. Aris Thorne", "Maya Lin", "Dr. Evelyn Vance", "Kavita Rao", "Tenzing Norgay Eco-Team", "Ranger Patrol Alpha", "Citizen Science Network"]
obs_methods = ["CAMERA_TRAP", "HUMAN_OBSERVATION", "PASSIVE_ACOUSTIC", "EDNA_ASSAY", "DRONE_SURVEY"]

occurrences = []
start_date = datetime(2025, 6, 1)

for i in range(1, 151):
    site = random.choice(sites_meta)
    sp = random.choice(species_list)
    obs_date = start_date + timedelta(days=random.randint(0, 420), hours=random.randint(0, 23), minutes=random.randint(0, 59))
    
    # Jitter coordinates within bounding box
    lat_jitter = site["lat"] + random.uniform(-0.15, 0.15)
    lng_jitter = site["lng"] + random.uniform(-0.15, 0.15)
    
    method = random.choice(obs_methods)
    count = 1 if sp["taxonomic_group"] in ["Mammalia", "Reptilia"] else random.randint(1, 12)
    confidence = round(random.uniform(0.82, 0.99), 2)
    
    occurrences.append({
        "occurrence_id": f"GBIF-BIOINTEL-2026-{i:04d}",
        "scientific_name": sp["scientific_name"],
        "common_name": sp["common_name"],
        "taxonomic_group": sp["taxonomic_group"],
        "conservation_status": sp["conservation_status"],
        "site_name": site["name"],
        "site_code": site["site_code"],
        "latitude": round(lat_jitter, 5),
        "longitude": round(lng_jitter, 5),
        "coordinate_uncertainty_meters": random.choice([5, 10, 25, 50, 100]),
        "observed_at": obs_date.strftime("%Y-%m-%d %H:%M:%S"),
        "individual_count": count,
        "observation_method": method,
        "observer": random.choice(observers),
        "confidence_score": confidence,
        "is_threat_alert": sp["conservation_status"] in ["CR", "EN"] or sp["is_invasive"]
    })

df_occurrences = pd.DataFrame(occurrences)
occurrences_csv = os.path.join(DEMO_DIR, "gbif_species_occurrences.csv")
df_occurrences.to_csv(occurrences_csv, index=False)
print(f"[OK] Saved: {occurrences_csv} ({len(df_occurrences)} geolocated observation records)")


# =====================================================================
# 4. eDNA SAMPLES & TAXONOMIC DETECTIONS (55 Samples, 130 Detections)
# =====================================================================
print("\n[4/6] Generating eDNA Metabarcode Sequencing Dataset (55 Samples, 130 Detections)...")

platforms = ["Illumina NovaSeq 6000", "Illumina MiSeq", "Oxford Nanopore GridION", "PacBio Sequel IIe"]
primers = ["12S rRNA (Vertebrate)", "16S rRNA (Fish/Amphibian)", "COI (Invertebrate)", "ITS2 (Fungal/Flora)", "18S rRNA (Eukaryote)"]

edna_samples = []
for i in range(1, 56):
    site = random.choice(sites_meta)
    sample_dt = datetime(2025, 9, 1) + timedelta(days=random.randint(0, 330), hours=random.randint(6, 18))
    code = f"EDNA-{sample_dt.year}-{site['site_code'].split('-')[1]}-{i:03d}"
    
    edna_samples.append({
        "sample_id": i,
        "sample_code": code,
        "site_name": site["name"],
        "site_code": site["site_code"],
        "collected_at": sample_dt.strftime("%Y-%m-%d %H:%M:%S"),
        "collector": random.choice(observers),
        "depth_meters": round(random.uniform(0.3, 8.5), 2),
        "water_temperature_c": round(random.uniform(16.5, 31.0), 1),
        "ph_level": round(random.uniform(6.4, 8.3), 2),
        "dissolved_oxygen_mg_l": round(random.uniform(4.5, 10.2), 2),
        "turbidity_ntu": round(random.uniform(1.2, 28.5), 1),
        "filtration_volume_ml": random.choice([1500, 2000, 2500, 3000, 5000]),
        "sequencing_platform": random.choice(platforms),
        "total_metabarcode_reads": random.randint(180000, 950000),
        "species_richness_detected": random.randint(18, 75)
    })

df_edna_samples = pd.DataFrame(edna_samples)
edna_samples_csv = os.path.join(DEMO_DIR, "edna_metabarcoding_samples.csv")
df_edna_samples.to_csv(edna_samples_csv, index=False)
print(f"[OK] Saved: {edna_samples_csv} ({len(df_edna_samples)} sample collection records)")

# eDNA Taxonomic Detections (130 records)
edna_detections = []
for i in range(1, 131):
    sample = random.choice(edna_samples)
    sp = random.choice(species_list)
    reads = random.randint(450, 48000)
    rel_abund = round(reads / sample["total_metabarcode_reads"], 5)
    identity = round(random.uniform(97.5, 100.0), 2)
    primer = random.choice(primers)
    status = "VERIFIED_EXPERT" if random.random() > 0.4 else "VERIFIED_AI"
    
    edna_detections.append({
        "detection_id": i,
        "sample_code": sample["sample_code"],
        "site_name": sample["site_name"],
        "scientific_name": sp["scientific_name"],
        "common_name": sp["common_name"],
        "taxonomic_group": sp["taxonomic_group"],
        "conservation_status": sp["conservation_status"],
        "is_invasive": sp["is_invasive"],
        "read_count": reads,
        "relative_abundance": rel_abund,
        "sequence_match_identity": identity,
        "primer_target": primer,
        "verification_status": status
    })

df_edna_det = pd.DataFrame(edna_detections)
edna_det_csv = os.path.join(DEMO_DIR, "edna_taxonomic_detections.csv")
df_edna_det.to_csv(edna_det_csv, index=False)
print(f"[OK] Saved: {edna_det_csv} ({len(df_edna_det)} OTU detection entries)")


# =====================================================================
# 5. BIOACOUSTIC PAM VOCALIZATION DETECTIONS (110 Records)
# =====================================================================
print("\n[5/6] Generating Passive Acoustic Monitoring (PAM) Vocalization Records (110 Records)...")

audio_files = ["forest_ambient_soundscape.wav", "tawny_owl_call.wav", "rainforest_night_canopy.wav", "riverine_dawn_chorus.wav"]
pam_detections = []

vocal_species = [s for s in species_list if s["taxonomic_group"] in ["Aves", "Mammalia", "Amphibia"]]

for i in range(1, 111):
    site = random.choice(sites_meta)
    sp = random.choice(vocal_species)
    start_t = round(random.uniform(1.0, 180.0), 1)
    duration = round(random.uniform(1.2, 8.5), 1)
    end_t = round(start_t + duration, 1)
    
    min_f = random.choice([250, 450, 800, 1200, 2200])
    max_f = min_f + random.choice([600, 1100, 2400, 3800])
    conf = round(random.uniform(0.78, 0.98), 2)
    verif = "VERIFIED_AI" if conf < 0.92 else "VERIFIED_EXPERT"
    
    pam_detections.append({
        "detection_id": i,
        "recording_file": random.choice(audio_files),
        "site_name": site["name"],
        "site_code": site["site_code"],
        "scientific_name": sp["scientific_name"],
        "common_name": sp["common_name"],
        "taxonomic_group": sp["taxonomic_group"],
        "start_time_seconds": start_t,
        "end_time_seconds": end_t,
        "duration_seconds": duration,
        "min_frequency_hz": min_f,
        "max_frequency_hz": max_f,
        "model_confidence": conf,
        "verification_status": verif,
        "classifier_model": "BioNet-AudioClassifier-v2.4"
    })

df_pam = pd.DataFrame(pam_detections)
pam_csv = os.path.join(AUDIO_DIR, "pam_acoustic_detections.csv")
df_pam.to_csv(pam_csv, index=False)
print(f"[OK] Saved: {pam_csv} ({len(df_pam)} acoustic vocalization detection logs)")


# =====================================================================
# 6. SATELLITE & CANOPY REMOTE SENSING TIME-SERIES (120 Records)
# =====================================================================
print("\n[6/6] Generating Satellite Vegetation & Canopy Remote Sensing Time-series (120 Records)...")

months = [datetime(2024, 10, 1) + timedelta(days=30 * i) for i in range(15)]
satellite_records = []

for site in sites_meta:
    base_ndvi = 0.82 if "Rainforest" in site["ecosystem_type"] or "Cloud" in site["ecosystem_type"] else (
        0.75 if "Mangrove" in site["ecosystem_type"] or "Alluvial" in site["ecosystem_type"] else 0.62
    )
    base_canopy = 88.0 if "Evergreen" in site["ecosystem_type"] or "Cloud" in site["ecosystem_type"] else (
        76.0 if "Mangrove" in site["ecosystem_type"] else 58.0
    )
    
    for m in months:
        # Seasonal variations
        is_monsoon = m.month in [6, 7, 8, 9]
        is_dry = m.month in [2, 3, 4, 5]
        
        ndvi = round(base_ndvi + (0.07 if is_monsoon else (-0.05 if is_dry else 0.01)) + random.uniform(-0.02, 0.02), 3)
        evi = round(ndvi * 0.68 + random.uniform(-0.02, 0.02), 3)
        ndre = round(ndvi * 0.52 + random.uniform(-0.01, 0.01), 3)
        canopy = round(base_canopy + (2.0 if is_monsoon else (-3.0 if is_dry else 0.0)) + random.uniform(-1.0, 1.0), 1)
        temp = round(site["elevation_m"] * -0.006 + (32.0 if is_dry else (25.0 if is_monsoon else 22.0)) + random.uniform(-1.5, 1.5), 1)
        precip = round((350.0 if is_monsoon else (40.0 if is_dry else 110.0)) + random.uniform(-20.0, 40.0), 1)
        
        # Deforestation alerts (higher during dry seasons)
        deforest_alerts = random.randint(2, 9) if (is_dry and site["alert_level"] == "CRITICAL") else (1 if random.random() > 0.6 else 0)
        
        satellite_records.append({
            "observation_date": m.strftime("%Y-%m-%d"),
            "site_id": site["site_id"],
            "site_name": site["name"],
            "site_code": site["site_code"],
            "ecosystem_type": site["ecosystem_type"],
            "ndvi_mean": ndvi,
            "evi_mean": evi,
            "ndre_mean": ndre,
            "canopy_cover_percent": canopy,
            "surface_temperature_c": temp,
            "monthly_precipitation_mm": precip,
            "deforestation_alert_count": deforest_alerts,
            "satellite_sensor": "Sentinel-2 MSI (Level-2A BOA)"
        })

df_satellite = pd.DataFrame(satellite_records)
satellite_csv = os.path.join(SATELLITE_DIR, "vegetation_canopy_timeseries.csv")
df_satellite.to_csv(satellite_csv, index=False)
print(f"[OK] Saved: {satellite_csv} ({len(df_satellite)} historical monthly remote sensing captures)")

print("\n" + "=" * 70)
print(f"LARGE-SCALE DATASETS GENERATION COMPLETE:")
print(f"  1. Species Catalog:               {len(df_species):4d} records  -> data/demo/species_catalog.csv")
print(f"  2. GBIF Geolocated Occurrences:   {len(df_occurrences):4d} records  -> data/demo/gbif_species_occurrences.csv")
print(f"  3. eDNA Sampling Stations:        {len(df_edna_samples):4d} records  -> data/demo/edna_metabarcoding_samples.csv")
print(f"  4. eDNA OTU Taxonomic Detections: {len(df_edna_det):4d} records  -> data/demo/edna_taxonomic_detections.csv")
print(f"  5. Bioacoustic PAM Detections:    {len(df_pam):4d} records  -> data/audio/pam_acoustic_detections.csv")
print(f"  6. Satellite Remote Sensing:      {len(df_satellite):4d} records  -> data/satellite/vegetation_canopy_timeseries.csv")
print(f"  7. Protected Area Boundaries:     {len(geojson_features):4d} sites    -> data/satellite/monitoring_sites.geojson")
print("=" * 70)
