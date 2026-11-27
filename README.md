# Laboratório de Hunts

Simulador de hunts do PokeIdle.

- `engine.js`: motor da simulação
- `config.js`: configuração padrão
- `page.html`: interface
- `dex.json`: Pokédex (gerada por `mkdex.py` a partir da exportação do jogo)
- `ui.py`: teste no navegador (precisa do Playwright para Python)
- `versoes/`: o app pronto de cada versão, basta abrir no navegador

Gerar o app: `python3 build.py` (cria `standalone.html`).

## Versões

- Nova versão (depois de editar os arquivos): `python3 release.py "Título" "mudança 1" "mudança 2"`
- Ver o histórico: `git log --oneline`
- Comparar duas versões: `git diff v5 v6 -- engine.js`
- Ver o código de uma versão antiga: `git checkout v5` (voltar: `git checkout main`)
- Desfazer mudanças ainda não salvas em um arquivo: `git restore engine.js`

Gravações do socket têm dados da conta e não entram no repositório.

O histórico de v1 a v6 foi montado em 26/11/2026, com as datas de publicação de cada versão. Os fontes de v1 e v5 foram recuperados das páginas publicadas, e o `build.py` da v1 e da v5 foi refeito. As seis reconstroem a página da versão.
