require 'image'

img = image.load('/Users/patosai/Downloads/combined.jpeg')
img_mid = img:narrow(3, 462, 100)
print(img:sum())
k = image.gaussian(2)
img_mid:copy(image.convolve(img_mid, k, 'same'))
print(img:sum())
image.save('/Users/patosai/Downloads/combined_blur.jpeg', img)
