# Git Flow Strategy - @brmorillo/utils

## 🚀 **Estratégia de Versionamento Automático Implementada**

### 📋 **Visão Geral**
Implementamos uma estratégia completa de Git Flow com versionamento automático que:
- **Detecta automaticamente** o tipo de release baseado nos commits
- **Gera changelog** automaticamente usando conventional commits
- **Cria releases** e tags automaticamente no GitHub
- **Publica automaticamente** no NPM registry
- **Faz merge back** para develop automaticamente

---

## 🌟 **Estrutura de Branches**

### **Branches Principais**
- **`main`** → Produção (protegida, apenas via PR)
- **`develop`** → Desenvolvimento/Integração

### **Branches de Suporte**
- **`feature/*`** → Novas funcionalidades
- **`release/*`** → Preparação de releases
- **`hotfix/*`** → Correções críticas

---

## ⚡ **Automação Completa de Releases**

### **Quando um PR é mergeado na `main`:**

1. **🔍 Detecção Automática de Versão:**
   ```
   feat: → minor version (1.0.0 → 1.1.0)
   fix:  → patch version (1.0.0 → 1.0.1)
   BREAKING CHANGE → major version (1.0.0 → 2.0.0)
   ```

2. **📝 Geração Automática de Changelog:**
   - Agrupa commits por tipo (features, fixes, breaking changes)
   - Formata automaticamente baseado em conventional commits
   - Atualiza CHANGELOG.md

3. **🏷️ Criação de Release:**
   - Cria tag git automaticamente (v1.2.3)
   - Cria GitHub Release com changelog
   - Anexa assets de build

4. **📦 Publicação Automática:**
   - Publica no NPM registry
   - Atualiza package.json com nova versão

5. **🔄 Back-merge:**
   - Cria PR automático para merge de volta ao develop
   - Mantém branches sincronizadas

---

## 🛠️ **Workflows Implementados**

### **1. Release Management (`.github/workflows/release.yml`)**
- **Trigger:** Push para `main` ou dispatch manual
- **Funcionalidade:** Versionamento e release automático completo

### **2. Feature Validation (`.github/workflows/feature.yml`)**
- **Trigger:** Push para `feature/*` ou PR para `develop`
- **Funcionalidade:** Validação de qualidade e conventional commits

### **3. Hotfix Emergency (`.github/workflows/hotfix.yml`)**
- **Trigger:** Push para `hotfix/*`
- **Funcionalidade:** Release imediato de correções críticas

---

## 💻 **Scripts e Comandos Disponíveis**

### **Git Flow Commands:**
```bash
# Versionamento
npm run version:patch    # 1.0.0 → 1.0.1
npm run version:minor    # 1.0.0 → 1.1.0
npm run version:major    # 1.0.0 → 2.0.0

# Preparação de release
npm run release:prepare  # Testa + build antes do release

# Scripts PowerShell
.\scripts\prepare-release.ps1           # Preparação completa
.\scripts\bump-version.ps1 patch        # Bump manual
```

### **Git Flow Workflow:**
```bash
# 🚀 Nova Feature
git checkout develop
git checkout -b feature/amazing-feature
# ... desenvolvimento ...
git push -u origin feature/amazing-feature
# Criar PR para develop

# 🔄 Release
git checkout develop
git checkout -b release/v1.2.0
# Ajustes finais, testes...
git push -u origin release/v1.2.0
# Criar PR para main → AUTOMAÇÃO ATIVA!

# 🚨 Hotfix
git checkout main
git checkout -b hotfix/critical-fix
# ... correção ...
git push -u origin hotfix/critical-fix
# AUTOMAÇÃO CRIA PATCH RELEASE IMEDIATAMENTE!
```

---

## 🎯 **Conventional Commits (Obrigatório)**

### **Formato:**
```
<type>[scope]: <description>

[optional body]

[optional footer]
```

### **Tipos:**
- **`feat:`** → Nova funcionalidade (minor bump)
- **`fix:`** → Correção de bug (patch bump)
- **`feat!:`** ou `BREAKING CHANGE` → Breaking change (major bump)
- **`chore:`** → Tarefas de manutenção
- **`docs:`** → Documentação
- **`style:`** → Formatação
- **`refactor:`** → Refatoração
- **`test:`** → Testes
- **`perf:`** → Performance
- **`ci:`** → CI/CD

### **Exemplos:**
```bash
feat: add new string manipulation utility
fix: resolve memory leak in cache service  
feat!: change API signature (breaking change)
fix(validation): correct email regex pattern
chore: update dependencies
docs: add usage examples
```

---

## 🔒 **Configuração de Segurança**

### **Secrets Necessários no GitHub:**
1. **`NPM_TOKEN`** → Token para publicação no NPM
2. **`GITHUB_TOKEN`** → Automático (já configurado)

### **Branch Protection Rules:**
- **main:** Requer PR + reviews + status checks
- **develop:** Requer PR + status checks
- **Histórico linear obrigatório**

---

## 📋 **Fluxo Completo de Exemplo**

### **Cenário: Nova Feature → Release**

1. **Desenvolvimento:**
   ```bash
   git checkout develop
   git checkout -b feature/new-utility
   # ... código ...
   git commit -m "feat: add new utility function"
   git push -u origin feature/new-utility
   ```

2. **PR para Develop:**
   - Workflows de validação executam
   - Code review
   - Merge para develop

3. **Preparação de Release:**
   ```bash
   git checkout develop
   git checkout -b release/v1.3.0
   .\scripts\prepare-release.ps1  # Valida tudo
   git push -u origin release/v1.3.0
   ```

4. **Release (PR para main):**
   - PR é criado: release/v1.3.0 → main
   - Review e merge
   - **🎉 AUTOMAÇÃO ATIVA:**
     - Detecta `feat:` → bump minor (v1.3.0)
     - Gera changelog
     - Cria GitHub release
     - Publica no NPM
     - Cria PR de volta para develop

---

## 🎉 **Resultado Final**

### **Você agora tem:**
✅ **Versionamento totalmente automático**  
✅ **Conventional commits obrigatórios**  
✅ **Changelog automático**  
✅ **GitHub releases automáticos**  
✅ **NPM publishing automático**  
✅ **Validação de qualidade em todos os PRs**  
✅ **Hotfix emergency com patch imediato**  
✅ **Branch protection e workflows completos**  

### **Benefícios:**
- 🚀 **Zero trabalho manual** para releases
- 📝 **Histórico perfeito** de mudanças
- 🔒 **Qualidade garantida** em todos os commits
- ⚡ **Hotfixes instantâneos** para emergências
- 🎯 **Semver automático** baseado em commits
- 🔄 **Branches sempre sincronizadas**

---

## 🚀 **Próximos Passos**

1. **Configure os secrets no GitHub:**
   - Vá em Settings → Secrets → Actions
   - Adicione `NPM_TOKEN`

2. **Configure branch protection:**
   - Settings → Branches → Add rule
   - Proteja `main` e `develop`

3. **Comece a usar:**
   ```bash
   git checkout -b feature/your-awesome-feature
   # ... desenvolva ...
   git commit -m "feat: add awesome feature"
   ```

**🎉 Git Flow com automação completa está pronto para uso!**
