from PIL import Image

img = Image.open("tulstone_sewers.png")
width, height = img.size
size = 0.9 * width

left = 0.1 * width
top = 0.0
right = left + size
bottom = height

img_cropped = img.crop((left, top, right, bottom))
img_cropped.save("output.png")
