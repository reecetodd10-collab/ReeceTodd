from PIL import Image
import sys
import os

def remove_background(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        datas = img.getdata()

        newData = []
        for item in datas:
            # Check for white (or near white) pixels and make them transparent
            if item[0] > 200 and item[1] > 200 and item[2] > 200:
                newData.append((255, 255, 255, 0))  # Transparent
            else:
                newData.append(item)
        
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"✅ Background removed! Saved to: {output_path}")
    except FileNotFoundError:
        print(f"❌ Error: Could not find file at {input_path}")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Default paths - edit these if your filename is different!
    input_file = "public/Aviera Transparent.png"  
    output_file = "public/Aviera_Transparent_Clean.png"

    # Allow command line arguments for flexibility
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
        
    print(f"Processing: {input_file} -> {output_file}")
    remove_background(input_file, output_file)
