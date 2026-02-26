from PIL import Image
import collections
import sys

def smart_remove_background(input_path, output_path):
    try:
        img = Image.open(input_path).convert("RGBA")
        width, height = img.size
        # Get pixel access object
        pixels = img.load()
        
        # BFS Queue
        q = collections.deque()
        
        # Start from all four corners
        starts = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
        
        visited = set()
        
        for x, y in starts:
            if 0 <= x < width and 0 <= y < height:
                q.append((x, y))
                visited.add((x, y))
        
        # Define what looks like background (White or Grey checkerboard)
        def is_background_color(r, g, b, a):
            if a == 0: return True # Already transparent
            # Heuristic: Background is Grey/White (high R, G, B)
            # Icon is Black/Cyan (low R)
            return r > 100

        while q:
            x, y = q.popleft()
            
            # Get current pixel values
            # Note: pixels[x,y] returns tuple
            current_pixel = pixels[x, y]
            r, g, b, a = current_pixel
            
            if is_background_color(r, g, b, a):
                # Make transparent
                pixels[x, y] = (0, 0, 0, 0)
                
                # Add neighbors
                for dx, dy in [(-1,0), (1,0), (0,-1), (0,1)]:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < width and 0 <= ny < height:
                        if (nx, ny) not in visited:
                            visited.add((nx, ny))
                            q.append((nx, ny))
            else:
                # Edge detected (Icon boundary)
                # Do not proceed further
                pass
                
        img.save(output_path, "PNG")
        print(f"✅ Smart background removal complete! Saved to: {output_path}")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
    else:
        input_file = "public/Aviera Transparent.png"
        output_file = "public/Aviera_Final.png"
    
    print(f"Processing: {input_file} -> {output_file}")
    smart_remove_background(input_file, output_file)
