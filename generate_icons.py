import math
from PIL import Image, ImageDraw

def create_icon(size):
    # Render at 4x for high quality antialiasing
    scale = 4
    canvas_size = size * scale
    img = Image.new("RGBA", (canvas_size, canvas_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    pad = canvas_size * 0.06
    # Draw rounded background squircle
    radius = canvas_size * 0.22
    # Gradient-like background: deep slate #0f172a with subtle dark border
    bg_box = [pad, pad, canvas_size - pad, canvas_size - pad]
    draw.rounded_rectangle(bg_box, radius=radius, fill=(15, 23, 42, 255), outline=(239, 68, 68, 180), width=int(canvas_size * 0.04))

    # Center coordinates
    cx = canvas_size / 2.0
    cy = canvas_size / 2.0

    # Draw minimalist YouTube play triangle in vibrant red
    # Shift slightly right to optically balance
    tx_shift = canvas_size * 0.02
    tri_len = canvas_size * 0.22
    p1 = (cx - tri_len * 0.7 + tx_shift, cy - tri_len)
    p2 = (cx - tri_len * 0.7 + tx_shift, cy + tri_len)
    p3 = (cx + tri_len * 1.1 + tx_shift, cy)
    draw.polygon([p1, p2, p3], fill=(239, 68, 68, 255))

    # Draw a sleek diagonal "focus / zen" shield slash or focus reticle ring
    # Let's draw an elegant focus ring around it
    ring_radius = canvas_size * 0.38
    ring_width = int(canvas_size * 0.05)
    ring_box = [cx - ring_radius, cy - ring_radius, cx + ring_radius, cy + ring_radius]
    
    # Four focus brackets
    # Top-left, top-right, bottom-left, bottom-right arcs
    draw.arc(ring_box, start=30, end=60, fill=(56, 189, 248, 255), width=ring_width)
    draw.arc(ring_box, start=120, end=150, fill=(56, 189, 248, 255), width=ring_width)
    draw.arc(ring_box, start=210, end=240, fill=(56, 189, 248, 255), width=ring_width)
    draw.arc(ring_box, start=300, end=330, fill=(56, 189, 248, 255), width=ring_width)

    # Downsample with Lanczos
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    return img

for s in [16, 48, 128]:
    icon = create_icon(s)
    icon.save(f"icons/icon{s}.png")
    print(f"Generated icons/icon{s}.png")
