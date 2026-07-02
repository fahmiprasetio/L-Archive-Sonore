import os
from PIL import Image

target_dir = r"d:\Projek_Web_dan_Mobile\L_Archive_Sonore\public\barang"

for filename in os.listdir(target_dir):
    if filename.endswith(".png"):
        png_path = os.path.join(target_dir, filename)
        webp_path = os.path.join(target_dir, filename[:-4] + ".webp")
        
        # Convert and save
        img = Image.open(png_path)
        img.save(webp_path, "webp", quality=80)
        print(f"Converted: {webp_path}")
        
        # Delete original png
        os.remove(png_path)
