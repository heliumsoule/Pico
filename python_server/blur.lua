require 'image'

img = image.load('/Users/patosai/Downloads/combined.jpeg')
img_mid = img:narrow(3, 462, 100)
k = image.gaussian(3)
img_mid = image.convolve(img_mid, k, 'same')
image.save('/Users/patosai/Downloads/combined_blur.jpeg', img)
