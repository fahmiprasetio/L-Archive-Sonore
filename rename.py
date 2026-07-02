import os

target_dir = r"d:\Projek_Web_dan_Mobile\L_Archive_Sonore\public\barang"

for filename in os.listdir(target_dir):
    if filename.endswith(".webp"):
        new_name = filename.replace(" ", "_").replace("&", "and")
        os.rename(os.path.join(target_dir, filename), os.path.join(target_dir, new_name))
        print(f"Renamed: {new_name}")
