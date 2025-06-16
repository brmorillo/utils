const fs = require('fs');
const path = require('path');

// Diretórios de origem e destino
const sourceDir = path.join(__dirname, 'test', 'services');
const targetDirs = {
  unit: path.join(__dirname, 'tests', 'unit'),
  integration: path.join(__dirname, 'tests', 'integration'),
  benchmark: path.join(__dirname, 'tests', 'benchmark')
};

// Certifique-se de que os diretórios de destino existem
Object.values(targetDirs).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Mapeamento de padrões de nome de arquivo para tipos de teste
const filePatterns = {
  benchmark: /\.benchmark\.test\.ts$|\.bench\.ts$/,
  integration: /\.integration\.test\.ts$|\.int-spec\.ts$/,
  unit: /\.test\.ts$|\.spec\.ts$/
};

// Função para determinar o tipo de teste com base no nome do arquivo
function getTestType(filename) {
  if (filePatterns.benchmark.test(filename)) {
    return 'benchmark';
  } else if (filePatterns.integration.test(filename)) {
    return 'integration';
  } else {
    return 'unit';
  }
}

// Função para gerar o novo nome do arquivo
function getNewFilename(filename, testType) {
  const baseName = path.basename(filename, path.extname(filename))
    .replace('.benchmark.test', '')
    .replace('.integration.test', '')
    .replace('.test', '')
    .replace('.int-spec', '')
    .replace('.spec', '');
  
  switch (testType) {
    case 'benchmark':
      return `${baseName}.bench.ts`;
    case 'integration':
      return `${baseName}.int-spec.ts`;
    default:
      return `${baseName}.spec.ts`;
  }
}

// Lê todos os arquivos no diretório de origem
fs.readdir(sourceDir, (err, files) => {
  if (err) {
    console.error('Erro ao ler o diretório de origem:', err);
    return;
  }

  // Processa cada arquivo
  files.forEach(file => {
    if (!file.endsWith('.ts')) return;
    
    const sourcePath = path.join(sourceDir, file);
    const testType = getTestType(file);
    const newFilename = getNewFilename(file, testType);
    const targetPath = path.join(targetDirs[testType], newFilename);
    
    // Verifica se o arquivo já existe no destino
    if (fs.existsSync(targetPath)) {
      console.log(`Arquivo já existe: ${targetPath}`);
      return;
    }
    
    // Lê o conteúdo do arquivo
    fs.readFile(sourcePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`Erro ao ler o arquivo ${sourcePath}:`, err);
        return;
      }
      
      // Escreve o conteúdo no novo arquivo
      fs.writeFile(targetPath, data, 'utf8', err => {
        if (err) {
          console.error(`Erro ao escrever o arquivo ${targetPath}:`, err);
          return;
        }
        console.log(`Arquivo movido: ${sourcePath} -> ${targetPath}`);
      });
    });
  });
});

console.log('Reorganização de testes iniciada. Verifique os logs para detalhes.');