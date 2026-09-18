import os
import re
import json
import urllib.request
import sqlite3

# Target directory in frontend public
PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "images", "species"))
os.makedirs(PUBLIC_DIR, exist_ok=True)

# Curated scientific names and fallback search terms for all 51 species
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
    ("Lime Butterfly", "Papilio demoleus", "lime_butterfly", ["Papilio_demoleus", "Papilio_demoleus"]),
    ("Lemon Pansy", "Junonia lemonias", "lemon_pansy", ["Junonia_lemonias", "Lemon_pansy"]),
    ("Peacock Pansy", "Junonia almana", "peacock_pansy", ["Junonia_almana", "Peacock_pansy"]),
    ("Grass Yellow", "Eurema hecabe", "grass_yellow", ["Eurema_hecabe", "Eurema_hecabe"]),
    ("Pioneer White", "Belenois aurota", "pioneer_white", ["Belenois_aurota", "Pioneer_White"]),
    ("Crimson Rose", "Pachliopta hector", "crimson_rose", ["Pachliopta_hector", "Crimson_Rose"]),
    ("Common Crow Butterfly", "Euploea core", "common_crow_butterfly", ["Euploea_core", "Common_crow_(butterfly)"]),
    ("Indian Honey Bee", "Apis cerana indica", "indian_honey_bee", ["Apis_cerana_indica", "Apis_cerana", "Asiatic_honey_bee"]),
    ("Little Honey Bee", "Apis florea", "little_honey_bee", ["Apis_florea", "Dwarf_honey_bee"]),
    ("Blue Carpenter Bee", "Xylocopa caerulea", "blue_carpenter_bee", ["Xylocopa_caerulea", "Xylocopa"]),
    ("Globe Skimmer Dragonfly", "Pantala flavescens", "globe_skimmer_dragonfly", ["Pantala_flavescens", "Globe_skimmer"]),
    ("Praying Mantis", "Hierodula patellifera", "praying_mantis", ["Hierodula_patellifera", "Mantis", "Hierodula"]),
    ("Neem Tree", "Azadirachta indica", "neem_tree", ["Azadirachta_indica", "Neem"]),
    ("Peepal Tree", "Ficus religiosa", "peepal_tree", ["Ficus_religiosa", "Sacred_fig"]),
    ("Banyan Tree", "Ficus benghalensis", "banyan_tree", ["Ficus_benghalensis", "Banyan"]),
    ("Amaltas / Golden Shower", "Cassia fistula", "amaltas_golden_shower", ["Cassia_fistula", "Cassia_fistula"]),
    ("Tulsi / Holy Basil", "Ocimum sanctum", "tulsi_holy_basil", ["Ocimum_tenuiflorum", "Ocimum_sanctum", "Tulsi"]),
    ("Lantana Camara", "Lantana camara", "lantana_camara", ["Lantana_camara", "Lantana"]),
    ("Parthenium Weed", "Parthenium hysterophorus", "parthenium_weed", ["Parthenium_hysterophorus", "Parthenium"]),
    ("Five-striped Palm Squirrel", "Funambulus pennantii", "five_striped_palm_squirrel", ["Funambulus_pennantii", "Northern_palm_squirrel"]),
    ("Rhesus Macaque", "Macaca mulatta", "rhesus_macaque", ["Macaca_mulatta", "Rhesus_macaque"]),
    ("Indian Flying Fox", "Pteropus giganteus", "indian_flying_fox", ["Pteropus_giganteus", "Pteropus_medius", "Indian_flying_fox"]),
    ("Small Indian Mongoose", "Urva auropunctata", "small_indian_mongoose", ["Urva_auropunctata", "Small_Indian_mongoose"]),
    ("Indian Flapshell Turtle", "Lissemys punctata", "indian_flapshell_turtle", ["Lissemys_punctata", "Indian_flapshell_turtle"]),
    ("Oriental Garden Lizard", "Calotes versicolor", "oriental_garden_lizard", ["Calotes_versicolor", "Oriental_garden_lizard"]),
    ("Indian Bullfrog", "Hoplobatrachus tigerinus", "indian_bullfrog", ["Hoplobatrachus_tigerinus", "Indian_bullfrog"]),
    ("Common Asian Toad", "Duttaphrynus melanostictus", "common_asian_toad", ["Duttaphrynus_melanostictus", "Asian_common_toad"]),
]

def fetch_wiki_image_url(search_terms):
    for term in search_terms:
        url = f"https://en.wikipedia.org/api/rest_v1/page/summary/{term}"
        req = urllib.request.Request(url, headers={"User-Agent": "BioIntel/1.0 (biodiversity conservation education platform)"})
        try:
            with urllib.request.urlopen(req, timeout=6) as res:
                data = json.loads(res.read().decode("utf-8"))
                thumb = data.get("thumbnail", {}).get("source")
                orig = data.get("originalimage", {}).get("source")
                img_url = orig or thumb
                if img_url:
                    return img_url
        except Exception as e:
            continue
    return None

print(f"Starting image fetch & download for {len(SPECIES_ITEMS)} species into {PUBLIC_DIR}...")

downloaded_map = {}
for idx, (cname, sname, slug, search_terms) in enumerate(SPECIES_ITEMS, 1):
    dest_file = os.path.join(PUBLIC_DIR, f"{slug}.jpg")
    local_url = f"/images/species/{slug}.jpg"
    
    # If already downloaded and > 5KB, skip downloading
    if os.path.exists(dest_file) and os.path.getsize(dest_file) > 5000:
        print(f"[{idx}/{len(SPECIES_ITEMS)}] [CACHED] {cname} -> {local_url}")
        downloaded_map[cname] = local_url
        continue
    
    img_url = fetch_wiki_image_url(search_terms)
    if img_url:
        try:
            # Download image
            req = urllib.request.Request(img_url, headers={"User-Agent": "BioIntel/1.0 (biodiversity conservation education platform)"})
            with urllib.request.urlopen(req, timeout=12) as response, open(dest_file, "wb") as out_f:
                out_f.write(response.read())
            print(f"[{idx}/{len(SPECIES_ITEMS)}] [DOWNLOADED] {cname} ({sname}) -> {slug}.jpg ({os.path.getsize(dest_file)} bytes)")
            downloaded_map[cname] = local_url
        except Exception as e:
            print(f"[{idx}/{len(SPECIES_ITEMS)}] [FAIL DOWNLOAD] {cname}: {e}")
    else:
        print(f"[{idx}/{len(SPECIES_ITEMS)}] [NOT FOUND] {cname} ({sname})")

print(f"\nSuccessfully processed {len(downloaded_map)}/{len(SPECIES_ITEMS)} species images.")

# Now update the SQLite Database: biointel.db
db_path = os.path.join(os.path.dirname(__file__), "biointel.db")
if os.path.exists(db_path):
    print(f"\nUpdating database {db_path} with accurate local image paths...")
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    
    updated_species = 0
    for cname, local_url in downloaded_map.items():
        cur.execute("UPDATE species SET image_url = ? WHERE common_name = ?", (local_url, cname))
        if cur.rowcount > 0:
            updated_species += cur.rowcount
            
    # Also update all observations to match species image_url
    cur.execute("""
        UPDATE observations 
        SET image_url = (SELECT image_url FROM species WHERE species.id = observations.species_id)
        WHERE species_id IN (SELECT id FROM species)
    """)
    updated_obs = cur.rowcount
    
    conn.commit()
    conn.close()
    print(f"Database updated: {updated_species} species and {updated_obs} observations now reference exact biological images!")
else:
    print(f"Database file not found at {db_path}")

print("\n--- Image download and DB update complete! ---")
