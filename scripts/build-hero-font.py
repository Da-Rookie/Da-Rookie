"""Build only the Manrope glyphs used by the hero (SIL OFL). Requires fonttools + brotli."""
import json, shutil
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.basePen import BasePen
font=instantiateVariableFont(TTFont('node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2'),{'wght':800})
class Pen(BasePen):
 def __init__(self, gs): super().__init__(gs); self.ops=[]
 def out(self,cmd,*pts): self.ops.extend([cmd]+[str(round(v,3)) for p in pts for v in p])
 def _moveTo(self,p): self.out('m',p)
 def _lineTo(self,p): self.out('l',p)
 def _qCurveToOne(self,p1,p2): self.out('q',p2,p1)
 def _curveToOne(self,p1,p2,p3): self.out('b',p3,p1,p2)
 def _closePath(self): pass
 def _endPath(self): pass
gs=font.getGlyphSet(); cmap=font.getBestCmap(); glyphs={}
for c in set('BUILD AUTOMATE LEAD?'):
 name=cmap[ord(c)]; pen=Pen(gs); gs[name].draw(pen)
 glyphs[c]={'ha':font['hmtx'][name][0],'x_min':0,'x_max':font['hmtx'][name][0],'o':' '.join(pen.ops)}
data={'glyphs':glyphs,'familyName':'Manrope','ascender':font['hhea'].ascent,'descender':font['hhea'].descent,'underlineThickness':50,'boundingBox':{'yMin':font['head'].yMin,'yMax':font['head'].yMax},'resolution':font['head'].unitsPerEm}
open('public/fonts/manrope-hero.json','w').write(json.dumps(data,separators=(',',':')))
shutil.copy('node_modules/@fontsource-variable/manrope/LICENSE','public/fonts/OFL-Manrope.txt')
