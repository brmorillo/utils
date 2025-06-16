# Diretrizes para Comandos de Terminal

Este documento fornece diretrizes para a execução de comandos de terminal em diferentes sistemas operacionais.

## Detecção do Sistema Operacional

Antes de recomendar comandos de terminal, sempre verifique o sistema operacional do usuário. Você pode identificar o sistema operacional através do contexto da conversa ou perguntando diretamente ao usuário.

## Comandos no Windows

No Windows, os caminhos de arquivo e diretório podem conter espaços e caracteres especiais. Para evitar problemas:

- **Use aspas duplas ao redor de caminhos**:
  ```batch
  mkdir "Minha Pasta"
  cd "C:\Caminho\Com Espaços"
  ```

- **Ou use barras invertidas duplas para escapar espaços**:
  ```batch
  mkdir Minha\\Pasta
  cd C:\\Caminho\\Com\\Espaços
  ```

- **Comandos comuns no Windows**:
  - Listar arquivos: `dir`
  - Criar diretório: `mkdir "nome_diretorio"`
  - Remover diretório: `rmdir /s /q "nome_diretorio"`
  - Copiar arquivo: `copy "origem.txt" "destino.txt"`
  - Mover arquivo: `move "origem.txt" "destino.txt"`
  - Excluir arquivo: `del "arquivo.txt"`
  - Visualizar conteúdo: `type "arquivo.txt"`
  - Limpar tela: `cls`

## Comandos no Linux/macOS

No Linux e macOS, os caminhos também podem conter espaços e caracteres especiais:

- **Use aspas simples ou duplas ao redor de caminhos**:
  ```bash
  mkdir 'Minha Pasta'
  cd "/Caminho/Com Espaços"
  ```

- **Ou use barra invertida para escapar espaços**:
  ```bash
  mkdir Minha\ Pasta
  cd /Caminho/Com\ Espaços
  ```

- **Comandos comuns no Linux/macOS**:
  - Listar arquivos: `ls -la`
  - Criar diretório: `mkdir -p "nome_diretorio"`
  - Remover diretório: `rm -rf "nome_diretorio"`
  - Copiar arquivo: `cp "origem.txt" "destino.txt"`
  - Mover arquivo: `mv "origem.txt" "destino.txt"`
  - Excluir arquivo: `rm "arquivo.txt"`
  - Visualizar conteúdo: `cat "arquivo.txt"`
  - Limpar tela: `clear`

## Comandos Multiplataforma

Alguns comandos funcionam de maneira semelhante em diferentes sistemas operacionais:

- **Node.js**:
  - Executar script: `node script.js`
  - Instalar pacote: `npm install pacote`
  - Executar script do package.json: `npm run script-name`

- **Git**:
  - Clonar repositório: `git clone url-repositorio`
  - Adicionar alterações: `git add .`
  - Commit: `git commit -m "mensagem"`
  - Push: `git push origin branch`

## Boas Práticas

- **Sempre explique o que o comando faz** antes de recomendá-lo
- **Forneça alternativas** quando possível
- **Avise sobre comandos destrutivos** que podem excluir dados
- **Verifique permissões necessárias** (como sudo no Linux/macOS)
- **Use caminhos relativos** quando apropriado para maior portabilidade
- **Considere o uso de ferramentas multiplataforma** quando disponíveis