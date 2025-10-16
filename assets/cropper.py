from PIL import Image
import sys

filename = sys.argv[1]
file_extension = filename.split(".")[1]

img = Image.open(filename)
width, height = img.size
size = min(width, height)

left = int(0.5 * (width - size))
top = int(0.1 * (height - size))
right = left + size
bottom = top + size

img_cropped = img.crop((left, top, right, bottom))
img_cropped.save(f"output.{file_extension}")
