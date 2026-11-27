#!/usr/bin/env python3
"""Cria uma versão nova: python3 release.py "Título" "mudança 1" "mudança 2"
Atualiza o CHANGELOG.md, gera o app, guarda a cópia em versoes/ e faz commit com tag."""
import sys,re,subprocess,shutil,datetime,os
if len(sys.argv)<3: sys.exit(__doc__)
run=lambda *a:subprocess.run(a,check=True)
log=open('CHANGELOG.md',encoding='utf8').read()
v='v%d'%(max(int(n) for n in re.findall(r'^## v(\d+)',log,re.M))+1)
sec=f"## {v} · {datetime.date.today()} · {sys.argv[1]}\n"+''.join(f"- {x}\n" for x in sys.argv[2:])+"\n"
i=log.index('\n## ')+1
open('CHANGELOG.md','w',encoding='utf8').write(log[:i]+sec+log[i:])
run('python3','build.py');os.makedirs('versoes',exist_ok=True)
shutil.copy('standalone.html',f'versoes/laboratorio-{v}.html')
run('git','add','-A');run('git','commit','-m',f'{v}: {sys.argv[1]}');run('git','tag',v)
print('Versão',v,'criada')
