# Histórico de versões

## v8 · 2026-11-27 · Ponto de início
- Toda simulação começa e recomeça no ponto de início do mapa; antes, um mapa salvo sem início sorteava o lugar
- Buizel começa em (67,11) também em mapas importados
- Marcador do início no mapa e pausa de 1 s ao iniciar ou reiniciar

## v7 · 2026-11-27 · Spawns do Buizel e Prey
- Buizel começa em (67,11) e usa os 12 pontos de spawn observados em 15 ondas
- Spawns extras do Prey, nas posições observadas ou a 2 ou 3 passos de um ponto fixo
- Importação de gravação separa pontos fixos de extras (3 ondas ou mais)
- Depois de voltar do Centro, o pokémon recomeça no início do mapa
- O mapa do Buizel ainda não tem paredes

## v6 · 2026-11-26 · Mapa completo e controle de versão
- Mapa gerado_pedra_11 completo embutido, a partir do arquivo do jogo e do collision.json
- Capturas antigas e parciais desse mapa deixam de substituir o completo
- Número da versão e histórico visíveis no app
- Conferência com a segunda gravação da hunt de Cranidos
- Nível padrão do Venusaur: 1718

## v5 · 2026-11-26 · Importar o mapa do jogo
- Calibrar lê o arquivo do mapa junto com o collision.json

## v4 · 2026-11-26 · Regras medidas na gravação
- Ondas de 9 selvagens em pontos fixos, 2,75 s após a última morte
- Só o selvagem atacado revida
- Importação lê pokémon, bônus de XP e limite de poção
- Desmaio com revive não tira XP

## v3 · 2026-11-26 · Movimento em grade
- Passos de 500 ms (seu pokémon) e 750 ms (selvagens), em 4 direções
- Selvagens sempre vêm até o jogador
- Mapas importados podem ser salvos por nome

## v2 · 2026-11-25 · Pokédex e calibração
- Escolha do pokémon e da hunt pela Pokédex
- XP por abate com bônus e custo das bolas no lucro

## v1 · 2026-11-25 · Primeira versão
- XP, gold, poções e mortes, com visão ao vivo e comparação de cenários
