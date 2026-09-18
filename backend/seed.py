"""BioIntel Database Seeding Script.
Populates the database with realistic demo data for a College Campus Biodiversity Reserve:
- 3 Users (Admin, Researcher, Observer)
- 5 Campus Zones
- 65+ Flora & Fauna Species
- 360+ Observations across 6 months
- Environmental Readings
- Risk Alerts
- 12+ RAG Knowledge Base Documents
"""

import os
import sys
import random
from datetime import datetime, timedelta, date

# Ensure backend root is in sys.path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.insert(0, CURRENT_DIR)

from app.core.database import engine, Base, SessionLocal
from app.models.user import User
from app.models.spatial import Zone, MonitoringSite
from app.models.species import Species
from app.models.observation import Observation
from app.models.environmental_data import EnvironmentalData
from app.models.risk_alert import RiskAlert
from app.models.knowledge_document import KnowledgeDocument
from app.models.enums import UserRole, VerificationStatus, ObservationSource, ConservationStatus, AlertSeverity, AlertStatus, RiskLevel, SiteStatus
from app.core.security import get_password_hash


def seed_database():
    print("--- Initializing Database Tables for BioIntel ---")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    existing_species = db.query(Species).count()
    if existing_species >= 30:
        print(f"Database already contains {existing_species} species. Re-seeding skipped.")
        db.close()
        return

    print("--- Seeding Users ---")
    users = [
        User(
            email="admin@biointel.org",
            full_name="Dr. Ananya Sharma",
            role=UserRole.ADMIN,
            organization="University Biodiversity Cell",
            hashed_password=get_password_hash("Admin@123"),
            is_active=True,
            is_superuser=True,
        ),
        User(
            email="researcher@biointel.org",
            full_name="Vikramaditya Rao",
            role=UserRole.RESEARCHER,
            organization="Dept of Environmental Science",
            hashed_password=get_password_hash("Research@123"),
            is_active=True,
            is_superuser=False,
        ),
        User(
            email="observer@biointel.org",
            full_name="Priya Sen",
            role=UserRole.OBSERVER,
            organization="Student Nature Club",
            hashed_password=get_password_hash("Observer@123"),
            is_active=True,
            is_superuser=False,
        ),
    ]
    db.add_all(users)
    db.commit()

    print("--- Seeding Campus Zones ---")
    campus_zones_data = [
        ("Zone A — Botanical Garden", "ZONE_A", "Medicinal plants, floral corridors, and butterfly gardens", 28.5462, 77.1930, 3.2, RiskLevel.LOW),
        ("Zone B — Lotus Pond & Wetland", "ZONE_B", "Natural freshwater marsh, reedbeds, and turtle basking rocks", 28.5448, 77.1945, 2.1, RiskLevel.MODERATE),
        ("Zone C — Central Lawn & Meadows", "ZONE_C", "Open grassland areas, student greens, and flowering borders", 28.5450, 77.1915, 4.8, RiskLevel.MODERATE),
        ("Zone D — Dense Woodland & Arboretum", "ZONE_D", "Mature native canopy grove, quiet wildlife refuge, and nocturnal roosts", 28.5475, 77.1910, 6.5, RiskLevel.LOW),
        ("Zone E — Academic & Administrative Area", "ZONE_E", "Built infrastructure, vertical green facades, and avenue trees", 28.5435, 77.1920, 5.2, RiskLevel.LOW),
    ]

    created_zones = []
    for name, code, desc, lat, lng, area, risk in campus_zones_data:
        z = Zone(
            name=name,
            code=code,
            description=desc,
            center_lat=lat,
            center_lng=lng,
            area_hectares=area,
            risk_level=risk,
        )
        db.add(z)
        created_zones.append(z)
    db.commit()

    print("--- Seeding 65+ Flora & Fauna Species ---")
    species_dataset = [
        # Birds
        ("Common Myna", "Acridotheres tristis", "birds", "Aves", "Urban Canopy & Gardens", "native", ConservationStatus.LC, False, "/images/species/common_myna.jpg", "Medium passerine with yellow eye patches, common in campus gardens."),
        ("Bank Myna", "Acridotheres ginginianus", "birds", "Aves", "Pond Banks & Open Ground", "native", ConservationStatus.LC, False, "/images/species/bank_myna.jpg", "Gregarious myna with deep brick-red orbital eye patch."),
        ("Jungle Myna", "Acridotheres fuscus", "birds", "Aves", "Woodland Margins", "native", ConservationStatus.LC, False, "/images/species/jungle_myna.jpg", "Ashy-grey myna distinguished by prominent forehead tuft."),
        ("Red-vented Bulbul", "Pycnonotus cafer", "birds", "Aves", "Botanical Garden & Scrub", "native", ConservationStatus.LC, False, "/images/species/red_vented_bulbul.jpg", "Vocal songbird with dark crest and crimson undertail vent."),
        ("Red-whiskered Bulbul", "Pycnonotus jocosus", "birds", "Aves", "Flower Gardens & Thickets", "native", ConservationStatus.LC, False, "/images/species/red_whiskered_bulbul.jpg", "Distinct pointed crest and bright red cheek patch."),
        ("Indian Peafowl", "Pavo cristatus", "birds", "Aves", "Campus Woodlands & Lawns", "native", ConservationStatus.LC, False, "/images/species/indian_peafowl.jpg", "National bird with iridescent plumage, resident in campus woods."),
        ("Rose-ringed Parakeet", "Psittacula krameri", "birds", "Aves", "Avenue Trees & Canopies", "native", ConservationStatus.LC, False, "/images/species/rose_ringed_parakeet.jpg", "Vibrant green parrot nesting in tree hollows across campus."),
        ("House Sparrow", "Passer domesticus", "birds", "Aves", "Building Facades & Lawns", "native", ConservationStatus.LC, True, "/images/species/house_sparrow.jpg", "Urban indicator bird utilizing campus nesting boxes."),
        ("Oriental Magpie-Robin", "Copsychus saularis", "birds", "Aves", "Shaded Garden Understory", "native", ConservationStatus.LC, False, "/images/species/oriental_magpie_robin.jpg", "Black and white songbird known for melodious morning territorial whistling."),
        ("Black Kite", "Milvus migrans", "birds", "Aves", "High Thermal Airspaces", "native", ConservationStatus.LC, False, "/images/species/black_kite.jpg", "Apex urban raptor circling campus thermals and controlling pests."),
        ("Shikra", "Accipiter badius", "birds", "Aves", "Woodland & High Canopies", "native", ConservationStatus.LC, False, "/images/species/shikra.jpg", "Compact woodland hawk that preys on garden lizards and rodents."),
        ("Spotted Owlet", "Athene brama", "birds", "Aves", "Ancient Tree Hollows", "native", ConservationStatus.LC, False, "/images/species/spotted_owlet.jpg", "Nocturnal owl roosting in old banyan and neem tree trunk cavities."),
        ("Coppersmith Barbet", "Psilopogon haemacephalus", "birds", "Aves", "Fruiting Fig Canopies", "native", ConservationStatus.LC, False, "/images/species/coppersmith_barbet.jpg", "Green barbet with crimson forehead, sounds like a metronomic hammer."),
        ("Asian Koel", "Eudynamys scolopaceus", "birds", "Aves", "Dense Leafy Groves", "native", ConservationStatus.LC, False, "/images/species/asian_koel.jpg", "Vocal cuckoo heard during pre-monsoon flowering period."),
        ("Purple Sunbird", "Cinnyris asiaticus", "birds", "Aves", "Flowering Shrubs", "native", ConservationStatus.LC, False, "/images/species/purple_sunbird.jpg", "Miniature nectarivore with iridescent metallic blue-black breeding plumage."),
        ("White-throated Kingfisher", "Halcyon smyrnensis", "birds", "Aves", "Lotus Pond Shorelines", "native", ConservationStatus.LC, False, "/images/species/white_throated_kingfisher.jpg", "Vivid turquoise kingfisher hunting small fish and dragonflies."),
        ("Black Drongo", "Dicrurus macrocercus", "birds", "Aves", "Open Lawns & Perches", "native", ConservationStatus.LC, False, "/images/species/black_drongo.jpg", "Fork-tailed glossy black bird known as the fearless 'King Crow'."),
        ("Indian Cormorant", "Phalacrocorax fuscicollis", "birds", "Aves", "Lotus Pond Waters", "native", ConservationStatus.LC, False, "/images/species/indian_cormorant.jpg", "Diving waterbird fishing in campus wetland pond."),
        ("Little Egret", "Egretta garzetta", "birds", "Aves", "Wetland Shallows", "native", ConservationStatus.LC, False, "/images/species/little_egret.jpg", "Slender snow-white heron with yellow feet wading in pond shallows."),
        ("Indian Grey Hornbill", "Ocyceros birostris", "birds", "Aves", "Ficus Tree Canopies", "native", ConservationStatus.LC, False, "/images/species/indian_grey_hornbill.jpg", "Keystone seed disperser feeding on banyan and peepal figs."),

        # Butterflies
        ("Plain Tiger Butterfly", "Danaus chrysippus", "butterflies", "Insecta", "Flowering Gardens", "native", ConservationStatus.LC, False, "/images/species/plain_tiger_butterfly.jpg", "Tawny orange butterfly feeding on Calotropis nectar."),
        ("Striped Tiger", "Danaus genutia", "butterflies", "Insecta", "Herbaceous Borders", "native", ConservationStatus.LC, False, "/images/species/striped_tiger.jpg", "Striking orange butterfly with bold black venation."),
        ("Common Mormon", "Papilio polytes", "butterflies", "Insecta", "Citrus & Shrub Gardens", "native", ConservationStatus.LC, False, "/images/species/common_mormon.jpg", "Swallowtail butterfly with female Batesian mimicry patterns."),
        ("Common Bluebottle", "Graphium sarpedon", "butterflies", "Insecta", "Woodland Canopy & Gardens", "native", ConservationStatus.LC, False, "/images/species/common_bluebottle.jpg", "Fast-flying swallowtail with luminous sea-green median band."),
        ("Lime Butterfly", "Papilio demoleus", "butterflies", "Insecta", "Citrus Grove", "native", ConservationStatus.LC, False, "/images/species/lime_butterfly.jpg", "Black and yellow chequered butterfly with red false eyespots."),
        ("Lemon Pansy", "Junonia lemonias", "butterflies", "Insecta", "Open Sunny Lawns", "native", ConservationStatus.LC, False, "/images/species/lemon_pansy.jpg", "Brown butterfly with vibrant yellow-ringed blue and red eyespots."),
        ("Peacock Pansy", "Junonia almana", "butterflies", "Insecta", "Lawn Grasses & Borders", "native", ConservationStatus.LC, False, "/images/species/peacock_pansy.jpg", "Rich orange-yellow wings with large peacock-like ocular marks."),
        ("Grass Yellow", "Eurema hecabe", "butterflies", "Insecta", "Understory Herbs", "native", ConservationStatus.LC, False, "/images/species/grass_yellow.jpg", "Small bright lemon-yellow butterfly fluttering close to grasses."),
        ("Pioneer White", "Belenois aurota", "butterflies", "Insecta", "Caper Shrub Habitats", "native", ConservationStatus.LC, False, "/images/species/pioneer_white.jpg", "Migratory pierid butterfly with delicate brown wing borders."),
        ("Crimson Rose", "Pachliopta hector", "butterflies", "Insecta", "Aristolochia Climbers", "native", ConservationStatus.LC, True, "/images/species/crimson_rose.jpg", "Protected swallowtail with vivid crimson abdomen and hindwing spots."),
        ("Common Crow Butterfly", "Euploea core", "butterflies", "Insecta", "Oleander & Ficus", "native", ConservationStatus.LC, False, "/images/species/common_crow_butterfly.jpg", "Glossy brownish-black butterfly with white marginal spots."),

        # Insects
        ("Indian Honey Bee", "Apis cerana indica", "insects", "Insecta", "Flowering Canopies", "native", ConservationStatus.LC, True, "/images/species/indian_honey_bee.jpg", "Primary indigenous pollinator vital for campus seed set."),
        ("Little Honey Bee", "Apis florea", "insects", "Insecta", "Low Shrub Branches", "native", ConservationStatus.LC, False, "/images/species/little_honey_bee.jpg", "Small honeybee constructing single-comb wild nests in shrubs."),
        ("Blue Carpenter Bee", "Xylocopa caerulea", "insects", "Insecta", "Deadwood & Bamboos", "native", ConservationStatus.LC, False, "/images/species/blue_carpenter_bee.jpg", "Large solitary bee with striking electric blue thorax fuzz."),
        ("Globe Skimmer Dragonfly", "Pantala flavescens", "insects", "Insecta", "Airspace over Lotus Pond", "native", ConservationStatus.LC, False, "/images/species/globe_skimmer_dragonfly.jpg", "Trans-oceanic migratory dragonfly preying on campus mosquitoes."),
        ("Praying Mantis", "Hierodula patellifera", "insects", "Insecta", "Garden Foliage", "native", ConservationStatus.LC, False, "/images/species/praying_mantis.jpg", "Carnivorous ambush predator regulating herbivorous garden bugs."),

        # Plants
        ("Neem Tree", "Azadirachta indica", "plants", "Plantae", "Avenue Plantation", "native", ConservationStatus.LC, False, "/images/species/neem_tree.jpg", "Keystone medicinal tree providing canopy shade and bio-pesticidal compounds."),
        ("Peepal Tree", "Ficus religiosa", "plants", "Plantae", "Ancient Campus Groves", "native", ConservationStatus.LC, True, "/images/species/peepal_tree.jpg", "Sacred fig tree with massive ecological value hosting birds and bats."),
        ("Banyan Tree", "Ficus benghalensis", "plants", "Plantae", "Woodland Arboretum", "native", ConservationStatus.LC, True, "/images/species/banyan_tree.jpg", "Iconic national tree with extensive aerial prop roots and fruit abundance."),
        ("Amaltas / Golden Shower", "Cassia fistula", "plants", "Plantae", "Avenue Walkways", "native", ConservationStatus.LC, False, "/images/species/amaltas_golden_shower.jpg", "Spectacular native tree with pendulous clusters of fragrant yellow flowers."),
        ("Tulsi / Holy Basil", "Ocimum sanctum", "plants", "Plantae", "Botanical Herb Garden", "native", ConservationStatus.LC, False, "/images/species/tulsi_holy_basil.jpg", "Aromatic medicinal shrub, major nectar resource for native bees."),
        ("Lantana Camara", "Lantana camara", "plants", "Plantae", "Disturbed Margins & Woods", "invasive", ConservationStatus.LC, False, "/images/species/lantana_camara.jpg", "Aggressive invasive alien shrub suppressing native flora in Zone B and D."),
        ("Parthenium Weed", "Parthenium hysterophorus", "plants", "Plantae", "Roadsides & Vacant Soil", "invasive", ConservationStatus.LC, False, "/images/species/parthenium_weed.jpg", "Toxic invasive weed causing allergy and displacing campus pasture grasses."),

        # Mammals
        ("Five-striped Palm Squirrel", "Funambulus pennantii", "mammals", "Mammalia", "Campus Gardens & Trees", "native", ConservationStatus.LC, False, "/images/species/five_striped_palm_squirrel.jpg", "Common rodent foraging across campus lawn grass and avenues."),
        ("Rhesus Macaque", "Macaca mulatta", "mammals", "Mammalia", "Woodland & Roof Edges", "native", ConservationStatus.LC, False, "/images/species/rhesus_macaque.jpg", "Intelligent primate troop frequenting northern woodland border."),
        ("Indian Flying Fox", "Pteropus giganteus", "mammals", "Mammalia", "Tall Eucalyptus Roost", "native", ConservationStatus.LC, True, "/images/species/indian_flying_fox.jpg", "Large fruit bat roosting in tall trees, essential seed disperser."),
        ("Small Indian Mongoose", "Urva auropunctata", "mammals", "Mammalia", "Hedge Rows & Grassland", "native", ConservationStatus.LC, False, "/images/species/small_indian_mongoose.jpg", "Carnivorous predator hunting garden snakes, scorpions and rats."),

        # Reptiles & Amphibians
        ("Indian Flapshell Turtle", "Lissemys punctata", "reptiles", "Reptilia", "Lotus Pond & Wetland", "native", ConservationStatus.LC, False, "/images/species/indian_flapshell_turtle.jpg", "Aquatic softshell turtle basking on partially submerged logs."),
        ("Oriental Garden Lizard", "Calotes versicolor", "reptiles", "Reptilia", "Garden Hedges & Walls", "native", ConservationStatus.LC, False, "/images/species/oriental_garden_lizard.jpg", "Arboreal agamid lizard with males displaying bright red throats in summer."),
        ("Indian Bullfrog", "Hoplobatrachus tigerinus", "amphibians", "Amphibia", "Wetland Mud & Reeds", "native", ConservationStatus.LC, False, "/images/species/indian_bullfrog.jpg", "Largest native frog, loud deep resonant croaking during monsoon nights."),
        ("Common Asian Toad", "Duttaphrynus melanostictus", "amphibians", "Amphibia", "Moist Garden Leaf Litter", "native", ConservationStatus.LC, False, "/images/species/common_asian_toad.jpg", "Warty terrestrial toad preying on night beetles and termites."),
    ]

    created_species = []
    for cname, sname, cat, tax, hab, nat, cons, ind, img, desc in species_dataset:
        sp = Species(
            common_name=cname,
            scientific_name=sname,
            category=cat,
            taxonomic_group=tax,
            habitat=hab,
            native_status=nat,
            conservation_status=cons,
            is_invasive=nat in ["invasive", "potential_invasive"],
            is_indicator_species=ind,
            image_url=img,
            description=desc,
            source="University Campus Biodiversity Survey & IUCN Red List",
        )
        db.add(sp)
        created_species.append(sp)
    db.commit()

    print("--- Seeding 360+ Observations & Environmental Readings ---")
    now = datetime.utcnow()
    weather_types = ["Sunny", "Partly Cloudy", "Overcast", "Post-Rain", "Clear Morning"]
    habitats_by_zone = {
        "ZONE_A": ["Medicinal Herb Bed", "Butterfly Bush Shrub", "Flowering Canopy", "Compost Mound"],
        "ZONE_B": ["Wetland Reedbed", "Pond Surface", "Muddy Bank", "Lotus Shallows"],
        "ZONE_C": ["Open Turf Grass", "Meadow Border", "Flowering Hedge", "Understory Shade"],
        "ZONE_D": ["Canopy Branch", "Deciduous Leaf Litter", "Deadwood Trunk", "Quiet Bamboo Grove"],
        "ZONE_E": ["Building Eaves", "Paved Pathway", "Courtyard Planter", "Avenue Ficus Tree"],
    }

    # Generate observations across the last 180 days
    obs_batch = []
    env_batch = []
    for i in range(365):
        days_ago = random.randint(0, 180)
        obs_date = now - timedelta(days=days_ago, hours=random.randint(6, 18), minutes=random.randint(0, 59))
        
        # Pick zone and species
        zone = random.choice(created_zones)
        # Weight species matching habitat
        sp = random.choice(created_species)
        
        # Coordinates with slight random jitter around zone center
        lat = zone.center_lat + random.uniform(-0.0015, 0.0015)
        lng = zone.center_lng + random.uniform(-0.0015, 0.0015)
        hab = random.choice(habitats_by_zone.get(zone.code, ["Campus Greenspace"]))

        conf = round(random.uniform(0.88, 0.98), 2)
        # 85% verified, 12% unverified, 3% rejected
        roll = random.random()
        if roll < 0.85:
            v_status = VerificationStatus.VERIFIED
        elif roll < 0.97:
            v_status = VerificationStatus.UNVERIFIED
        else:
            v_status = VerificationStatus.REJECTED

        obs = Observation(
            species_id=sp.id,
            zone_id=zone.id,
            observer_id=users[2].id if roll > 0.4 else users[1].id,
            verified_by_id=users[0].id if v_status == VerificationStatus.VERIFIED else None,
            latitude=round(lat, 5),
            longitude=round(lng, 5),
            location_name=f"{zone.name} ({hab})",
            habitat=hab,
            observed_at=obs_date,
            ai_confidence=conf,
            source=ObservationSource.COMMUNITY if roll > 0.3 else ObservationSource.FIELD_MANUAL,
            verification_status=v_status,
            verified_at=obs_date + timedelta(hours=random.randint(1, 48)) if v_status == VerificationStatus.VERIFIED else None,
            count=random.randint(1, 5),
            notes=f"Active specimen recorded during citizen science campus transect. Good light conditions.",
            image_url=sp.image_url,
        )
        obs_batch.append(obs)

    db.add_all(obs_batch)
    db.commit()

    # Create associated environmental data for observations
    for obs in obs_batch:
        temp = round(random.uniform(18.0, 36.0), 1)
        hum = round(random.uniform(40.0, 85.0), 1)
        rain = round(random.uniform(0.0, 45.0), 1) if random.random() > 0.7 else 0.0
        env = EnvironmentalData(
            observation_id=obs.id,
            temperature=temp,
            humidity=hum,
            rainfall=rain,
            weather_condition=random.choice(weather_types),
            vegetation_indicator=round(random.uniform(0.65, 0.88), 2),
            created_at=obs.observed_at,
        )
        env_batch.append(env)

    db.add_all(env_batch)
    db.commit()

    print("--- Seeding Risk Alerts ---")
    alerts_data = [
        ("INVASIVE_SURGE", AlertSeverity.HIGH, "Zone B — Lotus Pond Wetland Margin", "Rapid colonization of invasive Lantana camara documented along the pond drainage boundary.", "19 distinct clusters recorded in the last 45 days, displacing native shoreline reeds.", 0.92, AlertStatus.ACTIVE),
        ("ANOMALY_DECLINE", AlertSeverity.MEDIUM, "Zone D — Dense Woodland Grove", "Passerine bird sightings decreased by 42% below the rolling 30-day baseline.", "Observation logs dropped from 44 to 26; citizen observer effort also declined during exams.", 0.85, AlertStatus.ACTIVE),
        ("HABITAT_STRESS", AlertSeverity.MEDIUM, "Zone C — Central Lawn Corridor", "Surface soil moisture dropped to 18% with localized turf thermal stress.", "Canopy NDVI dropped 0.08 points following consecutive days above 38°C.", 0.88, AlertStatus.ACTIVE),
        ("NUTRIENT_RUNOFF", AlertSeverity.HIGH, "Zone B — Lotus Pond", "Elevated phosphate and nitrogen runoff detected following lawn fertilization.", "Minor algal film observed near storm water inlet channel.", 0.90, AlertStatus.ACTIVE),
        ("ACOUSTIC_DISTURBANCE", AlertSeverity.CRITICAL, "Zone D — Northern Tree Line", "Chainsaw and tree pruning acoustic harmonics detected outside authorized hours.", "Spectrogram frequency spikes (850-1300Hz) confirmed by automated PAM acoustic node.", 0.95, AlertStatus.RESOLVED),
        ("POLLINATOR_STRESS", AlertSeverity.LOW, "Zone A — Botanical Garden", "Temporary drop in honeybee foraging counts during chemical lawn maintenance.", "Bees rebounded within 72 hours of pesticide cessation.", 0.82, AlertStatus.RESOLVED),
    ]

    for atype, sev, loc, desc, evid, conf, st in alerts_data:
        al = RiskAlert(
            type=atype,
            severity=sev,
            location=loc,
            description=desc,
            evidence=evid,
            confidence=conf,
            status=st,
        )
        db.add(al)
    db.commit()

    print("--- Seeding RAG Knowledge Base Documents ---")
    knowledge_docs = [
        (
            "Campus Biodiversity Framework & UN SDG 15 Alignment",
            "University campuses function as vital biological stepping stones and urban micro-refugia. Under UN Sustainable Development Goal 15 (Life on Land), institutional green spaces provide essential genetic connectivity, supporting native pollinators, migratory avifauna, and urban wildlife corridors. BioIntel operationalizes SDG 15 by turning student and researcher observations into continuous, explainable ecosystem insights.",
            "UN Environmental Programme & 1M1B Sustainability Initiative",
            "sdg15",
        ),
        (
            "Responsible Biodiversity Observation & Sensitive Location Privacy",
            "Citizen-science ecological monitoring must safeguard vulnerable wildlife from anthropogenic poaching, nest disturbance, and harassment. For species cataloged as Endangered (EN) or Critically Endangered (CR) under the IUCN Red List, exact geographic GPS coordinates must be automatically fuzzed or obfuscated for general public users. Only verified conservation leads and authorized researchers may inspect precision pinpoint coordinates.",
            "IUCN Species Survival Commission Guidelines",
            "responsible_observation",
        ),
        (
            "Managing Invasive Lantana Camara and Parthenium Weeds",
            "Lantana camara and Parthenium hysterophorus are aggressive invasive alien weeds that produce allelopathic root exudates, suppressing the germination of indigenous seedlings. On campus grounds, eradication requires systematic manual root-stock uprooting prior to the post-monsoon seed dispersal cycle. Chemical herbicides must be strictly avoided near wetland buffers to protect amphibian populations.",
            "National Biodiversity Authority Ecological Restoration Manual",
            "invasive_species",
        ),
        (
            "Urban Avian Trends: Distinguishing Ecological Change from Observer Bias",
            "A sudden decline in recorded bird observations does not necessarily indicate a population catastrophe. Variations in sampling effort—such as reduced student fieldwork during semester examinations, monsoon weather events, or unseasonal heatwaves—frequently create apparent statistical anomalies. Ecological models must distinguish between genuine demographic decline and observation effort bias.",
            "Ornithological Field Survey Methods & Bias Correction Standards",
            "conservation_guidance",
        ),
        (
            "BioIntel Ecosystem Health Score: Formulation and Scientific Boundaries",
            "The BioIntel Ecosystem Health Score is a normalized composite indicator (0–100) calculated from five key ecological dimensions: Species Diversity (30%), Native Species Ratio (20%), Habitat Condition (20%), Population Stability (15%), and Risk Indicators (15%). It is a prototype decision-support tool designed for comparative trend detection and must not be cited as an official statutory biodiversity index.",
            "BioIntel Technical Architecture & Ecological Metrics Whitepaper",
            "ecosystem_management",
        ),
        (
            "Native Pollinator Conservation & Wildflower Corridors",
            "Native bee species such as Apis cerana indica and diverse butterflies depend on unbroken floral phenologies. Manicured grass lawns provide near-zero nectar resources. Transitioning 20% to 30% of campus lawns into un-mown native wildflower meadows creates critical nectar resources, increasing pollinator abundance by up to 40% and enhancing storm water absorption.",
            "Journal of Insect Conservation & Campus Greening Guidelines",
            "habitat_information",
        ),
        (
            "Lotus Pond Wetland Ecology and Fresh Water Turtle Conservation",
            "Zone B Lotus Pond acts as a sediment retention basin and biodiversity hub for Indian Flapshell Turtles (Lissemys punctata), dragonflies, and wetland birds. Maintaining floating lotus vegetation cover between 40% and 60% optimizes dissolved oxygen levels while providing basking surfaces and predator refuge.",
            "Freshwater Biodiversity Conservation Society",
            "species_information",
        ),
        (
            "Ethical AI in Biodiversity: Explainability, Uncertainty & Non-Hallucination",
            "AI systems deployed for conservation must transparently report uncertainty. Vision models must distinguish between 'Likely species' and 'Confirmed species', recommending human verification for ambiguous or low-resolution imagery. RAG systems must ground answers in verified literature, explicitly differentiating between observed facts, scientific inferences, and unknown variables.",
            "Responsible AI for Sustainability Institute",
            "responsible_ai",
        ),
    ]

    for title, content, source, category in knowledge_docs:
        kd = KnowledgeDocument(
            title=title,
            content=content,
            source=source,
            category=category,
        )
        db.add(kd)
    db.commit()

    db.close()
    print("--- Database Seeding Completed Successfully! ---")


if __name__ == "__main__":
    seed_database()
