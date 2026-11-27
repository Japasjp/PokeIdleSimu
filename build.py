# Gera laboratorio-de-hunts.html (para publicar) e standalone.html (para abrir direto no navegador)
import json,os,re
os.chdir(os.path.dirname(os.path.abspath(__file__)))
read=lambda f:open(f,encoding='utf8').read()
strip=lambda f:read(f).split('if(typeof module')[0]
write=lambda f,s:open(f,'w',encoding='utf8').write(s)
# histórico: "## v6 · AAAA-MM-DD · Título" seguido de linhas "- mudança"
log=[]
for block in re.split(r'^## ',read('CHANGELOG.md'),flags=re.M)[1:]:
    head,*lines=block.strip().split('\n')
    v,date,title=head.split(' · ',2)
    log.append({'v':int(v[1:]),'d':'/'.join(reversed(date.split('-')))+' · '+title,'i':[l[2:] for l in lines if l.startswith('- ')]})
assert log,'CHANGELOG.md sem versões'
p=read('page.html')
for key,val in (('__VERSION__',str(log[0]['v'])),('__CHANGELOG__',json.dumps(log,ensure_ascii=False).replace('<','\\u003c')),
                ('__DEX__',read('dex.json')),('__ENGINE__',strip('engine.js')),('__CONFIG__',strip('config.js'))):
    assert key in p,key+' não encontrado em page.html'
    p=p.replace(key,val)
write('laboratorio-de-hunts.html',p)
write('standalone.html','<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}[hidden]{display:none!important}</style></head><body>'+p+'</body></html>')
print('Versão',log[0]['v'],'gerada')
