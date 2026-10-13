"""Rasterisera vår enkla bokikon utan externa bildbibliotek."""
from pathlib import Path
import struct
import zlib

ROOT = Path(__file__).resolve().parents[1]


def icon(size):
    bg, fg = (35,75,61), (250,248,242)
    pixels = bytearray(bytes(bg)*size*size)
    paths = [[(64,35),(50,27),(36,25),(24,29),(24,95),(38,91),(50,94),(64,101),(78,94),(90,91),(104,95),(104,29),(92,25),(78,27),(64,35)],
             [(64,35),(64,101)],[(36,47),(51,50)],[(36,64),(51,67)],[(77,50),(92,47)],[(77,67),(92,64)]]
    for path in paths:
        for (x1,y1),(x2,y2) in zip(path,path[1:]):
            x1,y1,x2,y2 = [v*size/128 for v in (x1,y1,x2,y2)]
            radius = 2.5*size/128
            for y in range(max(0,int(min(y1,y2)-radius)),min(size,int(max(y1,y2)+radius+1))):
                for x in range(max(0,int(min(x1,x2)-radius)),min(size,int(max(x1,x2)+radius+1))):
                    t = max(0,min(1,((x-x1)*(x2-x1)+(y-y1)*(y2-y1))/((x2-x1)**2+(y2-y1)**2)))
                    if (x-(x1+t*(x2-x1)))**2+(y-(y1+t*(y2-y1)))**2 <= radius**2:
                        offset = (y*size+x)*3; pixels[offset:offset+3] = bytes(fg)
    def chunk(kind, data):
        return struct.pack('>I',len(data))+kind+data+struct.pack('>I',zlib.crc32(kind+data))
    rows = b''.join(b'\0'+pixels[y*size*3:(y+1)*size*3] for y in range(size))
    return b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',size,size,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(rows))+chunk(b'IEND',b'')


if __name__ == '__main__':
    for size in (192,512):
        (ROOT/'web'/f'icon-{size}.png').write_bytes(icon(size))
    print('PWA-ikoner skapade.')
