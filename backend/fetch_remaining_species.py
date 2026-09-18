import os
import time
import json
import urllib.request
import urllib.parse
import sqlite3

PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images", "species"))
os.makedirs(PUBLIC_DIR, exist_ok=True)

USER_AGENT = "BioIntel-Ecological-Engine/1.0 (https://github.com/debanjalidas/BioIntel; contact: admin@biointel.org) Python/3.11"

# All 51 species with scientific name and specific search queries
SPECIES_ITEMS = [
    ("Common Myna", "Acridotheres tristis", "common_myna", ["Acridotheres_tristis", "Common_myna"]),
    ("Bank Myna", "Acridotheres ginginianus", "bank_myna", ["Acridotheres_ginginianus", "Bank_myna"]),
    ("Jungle Myna", "Acridotheres fuscus", "jungle_myna", ["Acridotheres_fuscus", "Jungle_myna"]),
    ("Red-vented Bulbul", "Pycnonotus cafer", "red_vented_bulbul", ["Pycnonotus_cafer", "Red-vented_bulbul"]),
    ("Red-whiskered Bulbul", "Pycnonotus jocosus", "red_whiskered_bulbul", ["Pycnonotus_jocosus", "Red-whiskered_bulbul"]),
    ("Indian Peafowl", "Pavo cristatus", "indian_peafowl", ["Pavo_cristatus", "Indian_peafowl"]),
    ("Rose-ringed Parakeet", "Psittacula krameri", "rose_ringed_parakeet", ["Psittacula_krameri", "Rose-ringed_parakeet"]),
    ("House Sparrow", "Passer domesticus", "house_sparrow", ["Passer_domesticus", "House_sparrow"]),
    ("Oriental Magpie-Robin", "Copsychus saularis", "oriental_magpie_robin", ["Copsychus_saularis", "Oriental_magpie-robin"]),
    ("Black Kite", "Milvus migrans", "black_kite", ["Milvus_migrans", "Black_kite"]),
    ("Shikra", "Accipiter badius", "shikra", ["Accipiter_badius", "Shikra"]),
    ("Spotted Owlet", "Athene brama", "spotted_owlet", ["Athene_brama", "Spotted_owlet"]),
    ("Coppersmith Barbet", "Psilopogon haemacephalus", "coppersmith_barbet", ["Psilopogon_haemacephalus", "Coppersmith_barbet"]),
    ("Asian Koel", "Eudynamys scolopaceus", "asian_koel", ["Eudynamys_scolopaceus", "Asian_koel"]),
    ("Purple Sunbird", "Cinnyris asiaticus", "purple_sunbird", ["Cinnyris_asiaticus", "Purple_sunbird"]),
    ("White-throated Kingfisher", "Halcyon smyrnensis", "white_throated_kingfisher", ["Halcyon_smyrnensis", "White-throated_kingfisher"]),
    ("Black Drongo", "Dicrurus macrocercus", "black_drongo", ["Dicrurus_macrocercus", "Black_drongo"]),
    ("Indian Cormorant", "Phalacrocorax fuscicollis", "indian_cormorant", ["Phalacrocorax_fuscicollis", "Indian_cormorant"]),
    ("Little Egret", "Egretta garzetta", "little_egret", ["Egretta_garzetta", "Little_egret"]),
    ("Indian Grey Hornbill", "Ocyceros birostris", "indian_grey_hornbill", ["Ocyceros_birostris", "Indian_grey_hornbill"]),
    ("Plain Tiger Butterfly", "Danaus chrysippus", "plain_tiger_butterfly", ["Danaus_chrysippus", "Plain_tiger"]),
    ("Striped Tiger", "Danaus genutia", "striped_tiger", ["Danaus_genutia", "Striped_tiger"]),
    ("Common Mormon", "Papilio polytes", "common_mormon", ["Papilio_polytes", "Common_Mormon"]),
    ("Common Bluebottle", "Graphium sarpedon", "common_bluebottle", ["Graphium_sarpedon", "Common_bluebottle"]),
    ("Lime Butterfly", "Papilio demoleus", "lime_butterfly", ["Papilio_demoleus", "Lime_butterfly"]),
    ("Lemon Pansy", "Junonia lemonias", "lemon_pansy", ["Junonia_lemonias", "Lemon_pansy"]),
    ("Peacock Pansy", "Junonia almana", "peacock_pansy", ["Junonia_almana", "Peacock_pansy"]),
    ("Grass Yellow", "Eurema hecabe", "grass_yellow", ["Eurema_hecabe", "Common_grass_yellow"]),
    ("Pioneer White", "Belenois aurota", "pioneer_white", ["Belenois_aurota", "Pioneer_white"]),
    ("Crimson Rose", "Pachliopta hector", "crimson_rose", ["Pachliopta_hector", "Crimson_rose"]),
    ("Common Crow Butterfly", "Euploea core", "common_crow_butterfly", ["Euploea_core", "Common_crow_(butterfly)"]),
    ("Indian Honey Bee", "Apis cerana indica", "indian_honey_bee", ["Apis_cerana", "Asiatic_honey_bee"]),
    ("Little Honey Bee", "Apis florea", "little_honey_bee", ["Apis_florea", "Dwarf_honey_bee"]),
    ("Blue Carpenter Bee", "Xylocopa caerulea", "blue_carpenter_bee", ["Xylocopa_caerulea", "Xylocopa"]),
    ("Globe Skimmer Dragonfly", "Pantala flavescens", "globe_skimmer_dragonfly", ["Pantala_flavescens", "Globe_skimmer"]),
    ("Praying Mantis", "Hierodula patellifera", "praying_mantis", ["Hierodula_patellifera", "Mantis"]),
    ("Neem Tree", "Azadirachta indica", "neem_tree", ["Azadirachta_indica", "Neem"]),
    ("Peepal Tree", "Ficus religiosa", "peepal_tree", ["Ficus_religiosa", "Sacred_fig"]),
    ("Banyan Tree", "Ficus benghalensis", "banyan_tree", ["Ficus_benghalensis", "Banyan"]),
    ("Amaltas / Golden Shower", "Cassia fistula", "amaltas_golden_shower", ["Cassia_fistula", "Golden_shower_tree"]),
    ("Tulsi / Holy Basil", "Ocimum sanctum", "tulsi_holy_basil", ["Ocimum_tenuiflorum", "Ocimum_sanctum"]),
    ("Lantana Camara", "Lantana camara", "lantana_camara", ["Lantana_camara", "Lantana"]),
    ("Parthenium Weed", "Parthenium hysterophorus", "parthenium_weed", ["Parthenium_hysterophorus", "Parthenium"]),
    ("Five-striped Palm Squirrel", "Funambulus pennantii", "five_striped_palm_squirrel", ["Funambulus_pennantii", "Northern_palm_squirrel"]),
    ("Rhesus Macaque", "Macaca mulatta", "rhesus_macaque", ["Rhesus_macaque", "Macaca_mulatta"]),
    ("Indian Flying Fox", "Pteropus giganteus", "indian_flying_fox", ["Pteropus_medius", "Indian_flying_fox", "Pteropus_giganteus"]),
    ("Small Indian Mongoose", "Urva auropunctata", "small_indian_mongoose", ["Small_Indian_mongoose", "Urva_auropunctata"]),
    ("Indian Flapshell Turtle", "Lissemys punctata", "indian_flapshell_turtle", ["Lissemys_punctata", "Indian_flapshell_turtle"]),
    ("Oriental Garden Lizard", "Calotes versicolor", "oriental_garden_lizard", ["Oriental_garden_lizard", "Calotes_versicolor"]),
    ("Indian Bullfrog", "Hoplobatrachus tigerinus", "indian_bullfrog", ["Hoplobatrachus_tigerinus", "Indian_bullfrog"]),
    ("Common Asian Toad", "Duttaphrynus melanostictus", "common_asian_toad", ["Duttaphrynus_melanostictus", "Asian_common_toad"]),
]

def get_wikipedia_thumbnail(search_terms):
    for term in search_terms:
        encoded_term = urllib.parse.quote(term)
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{encoded_term}"
        req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
        try:
            with urllib.request.urlopen(req, timeout=8) as res:
                if res.status == 200:
                    data = json.loads(res.read().decode("utf-8"))
                    thumb = data.get("thumbnail", {}).get("source")
                    if thumb:
                        # Convert 320px thumbnail to 500px thumbnail for crisp quality
                        return thumb
        except Exception:
            continue
    return None

def get_wikimedia_search_thumbnail(query):
    encoded_query = urllib.parse.quote(query)
    url = f"https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch={encoded_query}&gsrlimit=1&prop=pageimages&pithumbsize=500&format=json"
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(req, timeout=8) as res:
            if res.status == 200:
                data = json.loads(res.read().decode("utf-8"))
                pages = data.get("query", {}).get("pages", {})
                for page in pages.values():
                    thumb = page.get("thumbnail", {}).get("source")
                    if thumb:
                        return thumb
    except Exception:
        pass
    return None

print(f"Checking images for all {len(SPECIES_ITEMS)} species...")

downloaded_count = 0
for idx, (cname, sname, slug, search_terms) in enumerate(SPECIES_ITEMS, 1):
    dest_file = os.path.join(PUBLIC_DIR, f"{slug}.jpg")
    local_url = f"/images/species/{slug}.jpg"

    # Check if already present and valid
    if os.path.exists(dest_file) and os.path.getsize(dest_file) > 10000:
        print(f"[{idx}/{len(SPECIES_ITEMS)}] [EXISTS] {cname} -> {slug}.jpg ({os.path.getsize(dest_file)} bytes)")
        downloaded_count += 1
        continue

    # Try Wikipedia summary first
    img_url = get_wikipedia_thumbnail(search_terms)
    
    # Fallback to Wikimedia Commons search
    if not img_url:
        img_url = get_wikimedia_search_thumbnail(f"{sname} filetype:bitmap")
    if not img_url:
        img_url = get_wikimedia_search_thumbnail(f"{cname} filetype:bitmap")

    if img_url:
        try:
            req = urllib.request.Request(img_url, headers={"User-Agent": USER_AGENT})
            with urllib.request.urlopen(req, timeout=12) as res, open(dest_file, "wb") as out_f:
                out_f.write(res.read())
            print(f"[{idx}/{len(SPECIES_ITEMS)}] [OK] {cname} -> {slug}.jpg ({os.path.getsize(dest_file)} bytes)")
            downloaded_count += 1
        except Exception as e:
            print(f"[{idx}/{len(SPECIES_ITEMS)}] [ERROR] {cname} ({img_url}): {e}")
    else:
        print(f"[{idx}/{len(SPECIES_ITEMS)}] [MISSING] {cname} ({sname})")

    # Polite rate limiting for Wikimedia servers
    time.sleep(1.2)

print(f"\nDownload phase complete: {downloaded_count}/{len(SPECIES_ITEMS)} valid local images in {PUBLIC_DIR}")

# Update the database
db_path = os.path.join(os.path.dirname(__file__), "biointel.db")
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    updated = 0
    for cname, sname, slug, _ in SPECIES_ITEMS:
        dest_file = os.path.join(PUBLIC_DIR, f"{slug}.jpg")
        if os.path.exists(dest_file) and os.path.getsize(dest_file) > 1000:
            local_url = f"/images/species/{slug}.jpg"
            cur.execute("UPDATE species SET image_url = ? WHERE common_name = ?", (local_url, cname))
            if cur.rowcount > 0:
                updated += cur.rowcount
    
    # Sync observations image_url
    cur.execute("""
        UPDATE observations 
        SET image_url = (SELECT image_url FROM species WHERE species.id = observations.species_id)
        WHERE species_id IN (SELECT id FROM species)
    """)
    conn.commit()
    conn.close()
    print(f"Database successfully updated for {updated} species!")
