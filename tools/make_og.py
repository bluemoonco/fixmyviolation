from PIL import Image,ImageDraw,ImageFont
from pathlib import Path
import random
root=Path(__file__).resolve().parents[1]/'public/assets'
im=Image.new('RGB',(1200,630),'#153c2c'); d=ImageDraw.Draw(im)
bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'; regular='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def text(y,s,size,color,font=regular):
 f=ImageFont.truetype(font,size);box=d.textbbox((0,0),s,font=f);d.text(((1200-box[2])/2,y),s,font=f,fill=color)
text(86,'OVERGROWN PROPERTY? A CLEARER NEXT STEP.',20,'#c6d8c6',bold)
d.rounded_rectangle((155,165,1045,303),radius=8,fill='#ffd458')
text(191,'Fix My Violation',74,'#0b281e',bold)
text(345,'Overgrown-lot cleanup in Tampa Bay',32,'#f7f6ef')
text(405,'813-671-2757',30,'#f7f6ef',bold)
text(464,'HILLSBOROUGH  ·  PINELLAS  ·  MANATEE',18,'#c6d8c6')
random.seed(19)
for x in range(-10,1220,14):
 h=random.randint(25,86);lean=random.randint(-30,30)
 d.polygon([(x,630),(x+lean,630-h),(x+12,630)],fill=random.choice(['#2b573b','#426a43','#1d4933']))
im.save(root/'og.v1.png',optimize=True)
