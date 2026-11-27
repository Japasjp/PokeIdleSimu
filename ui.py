from playwright.sync_api import sync_playwright
import pathlib
URL=(pathlib.Path(__file__).resolve().parent/'standalone.html').as_uri()
ficha="""- Espécie: Venusaur (#3) — GRASS / POISON
- Shiny: não
- Nível: 1,700
- Potência: P4 (+25%)
- Qualidade: 1.521
| HP | 80 | 15 | 1 |
| ATK | 82 | 8 | 1 |
| DEF | 83 | 29 | 1 |
| SP.ATK | 100 | 30 | 1 |
| SP.DEF | 100 | 26 | 1 |
| SPD | 80 | 9 | 1 |"""
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':860},color_scheme='dark')
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='error' and errs.append(m.text))
    pg.goto(URL);pg.click('[data-s="5"]');pg.wait_for_timeout(5000);pg.screenshot(path='live.png')
    pg.click('[data-t="cfg"]');pg.fill('#ficha',ficha);pg.click('#fichaBtn');print(pg.inner_text('#fichaMsg'),pg.input_value('[data-p="pokemon.level"]'))
    pg.fill('[data-p="pokemon.level"]','1651');pg.press('[data-p="pokemon.level"]','Tab')
    pg.click('[data-t="cmp"]');pg.click('#scAdd');pg.click('#scPot');pg.fill('#hours','1');pg.fill('#reps','3');pg.click('#runCmp');pg.wait_for_function("!document.getElementById('runCmp').disabled",timeout=90000);print(pg.inner_text('#prog'));print(pg.inner_text('#res'));pg.screenshot(path='cmp.png',full_page=True)
    msg='{"t":"campo","seq":1,"ts":1,"mobs":[{"s":1,"c":64,"r":29,"dc":65,"dr":29,"ms":520,"hp":5,"x":0,"n":"Buizel","nv":1000},{"s":2,"c":40,"r":19,"dc":39,"dr":19,"ms":520,"hp":5,"x":0}]}'
    pg.click('[data-t="cal"]');pg.fill('#campo',msg);pg.click('#campoBtn');print(pg.inner_text('#campoMsg'));pg.click('#calRun');pg.wait_for_selector('#calRes table');
    pg.click('[data-t="live"]');pg.click('[data-s="100"]');pg.wait_for_timeout(2000);print(pg.inner_text('#stats')[:200])
    pg.click('#mapDel') if False else None
    pg.click('[data-t="cfg"]');pg.click('#def')
    for sp in ['Gyarados']:
        pg.fill('#spHunt',sp);pg.press('#spHunt','Tab');pg.wait_for_timeout(200);print(sp,pg.input_value('[data-p="hunt.level"]'),pg.input_value('[data-p="hunt.xpBase"]'),pg.locator('[data-p^="hunt.moves"][data-p$="name"]').count())
    pg.fill('#spMine','Charizard');pg.press('#spMine','Tab');pg.wait_for_timeout(200);print(pg.input_value('[data-p="pokemon.name"]') if pg.locator('[data-p="pokemon.name"]').count() else pg.input_value('#spMine'))
    pg.click('[data-t="cal"]');import json
    lines=[json.dumps({"t":"batalha","ev":[{"k":"morte","quem":"selvagem","nome":"Gyarados","xp":4321}]})]
    pg.fill('#campo','\n'.join(lines));pg.click('#campoBtn');print(pg.inner_text('#campoMsg'))
    pg.click('[data-t="cfg"]');pg.click('#def');pg.click('[data-t="cmp"]')
    while pg.locator('[data-d]').count(): pg.locator('[data-d]').first.click()
    pg.fill('#hours','2');pg.fill('#reps','8');pg.click('#runCmp');pg.wait_for_function("!document.getElementById('runCmp').disabled",timeout=90000);print(pg.inner_text('#res'));pg.screenshot(path='cmp.png')
    pg.click('[data-t="cfg"]');pg.screenshot(path='cfg.png')
    m=b.new_page(viewport={'width':390,'height':800});m.on('pageerror',lambda e:errs.append(str(e)));m.goto(URL)
    for t in ['live','cmp','cfg','cal']:
        m.click(f'[data-t="{t}"]');m.wait_for_timeout(200);print(t,m.evaluate('document.documentElement.scrollWidth'))
    print(errs);b.close()
