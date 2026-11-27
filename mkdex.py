import re,json,sys
t=open(sys.argv[1],encoding='utf8').read()
a=t.index('\n## Espécies');b=t.index('\n## Golpes por espécie');c=t.index('\n## Onde encontrar')
D={}
for l in t[a:b].split('\n'):
    p=[x.strip() for x in l.split('|')[1:-1]]
    if len(p)<11 or not p[0].isdigit(): continue
    name=re.sub(r'\s*\(((LENDÁRIO|MÍTICO|BOSS|MYSTIC TICKET|MEGA)[^)]*)\)','',p[1])
    num=lambda s:int(s.replace(',','').replace('.','')) if re.match(r'^[\d.,]+$',s) else 0
    D[int(p[0])]=[int(p[0]),name,p[2].split('/'),[int(x) for x in p[3:9]],num(p[10]),1 if re.search('LENDÁRIO|MÍTICO',p[1]) else 0,[]]
bad=0
for l in t[b:c].split('\n'):
    m=re.match(r'- \*\*#0*(\d+) .+?\*\* — (.*)',l)
    if not m: continue
    for s in m.group(2).split('; '):
        q=s.split('|')
        try:
            if int(q[2])>0: D[int(m.group(1))][6].append([q[0],int(q[2]),float(q[3]),'P' if q[4]=='F' else 'S',q[5]])
        except Exception: bad+=1
L=sorted(D.values())
json.dump(L,open('dex.json','w'),ensure_ascii=False,separators=(',',':'))
print(len(L),'bad',bad,sum(1 for x in L if x[4]),sum(1 for x in L if not x[6]))
for i in (3,418): print(D[i])
