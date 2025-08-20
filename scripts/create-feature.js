/**
 * 🚀 Create New Feature Script
 * 
 * Creates a new feature based on the _template structure.
 * 
 * Usage: node scripts/create-feature.js feature-name
 */

const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];

if (!featureName) {
  console.error('❌ Por favor, forneça o nome da feature:');
  console.log('   node scripts/create-feature.js minha-feature');
  process.exit(1);
}

// Convert kebab-case to PascalCase
const pascalCase = featureName
  .split('-')
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join('');

// Convert kebab-case to camelCase
const camelCase = featureName
  .split('-')
  .map((word, index) => 
    index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
  )
  .join('');

const templatePath = path.join(__dirname, '..', 'src', 'features', '_template');
const newFeaturePath = path.join(__dirname, '..', 'src', 'features', featureName);

// Check if template exists
if (!fs.existsSync(templatePath)) {
  console.error('❌ Template não encontrado em:', templatePath);
  process.exit(1);
}

// Check if feature already exists
if (fs.existsSync(newFeaturePath)) {
  console.error('❌ Feature já existe:', newFeaturePath);
  process.exit(1);
}

/**
 * Recursively copy directory and replace template strings
 */
function copyAndReplace(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const items = fs.readdirSync(src);

  items.forEach(item => {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item.replace(/template/gi, camelCase));
    
    const stat = fs.statSync(srcPath);
    
    if (stat.isDirectory()) {
      copyAndReplace(srcPath, destPath);
    } else if (stat.isFile()) {
      let content = fs.readFileSync(srcPath, 'utf8');
      
      // Replace template strings
      content = content
        .replace(/Template/g, pascalCase)
        .replace(/template/g, camelCase)
        .replace(/TEMPLATE/g, featureName.toUpperCase());
      
      fs.writeFileSync(destPath, content);
    }
  });
}

try {
  console.log('🚀 Criando feature:', featureName);
  console.log('📁 Copiando de:', templatePath);
  console.log('📁 Para:', newFeaturePath);
  
  copyAndReplace(templatePath, newFeaturePath);
  
  console.log('✅ Feature criada com sucesso!');
  console.log('');
  console.log('🔄 Próximos passos:');
  console.log('1. Crie a rota em src/app/routes/' + featureName + '.tsx');
  console.log('2. Atualize o backend para incluir as APIs necessárias');
  console.log('3. Execute npm run routes:generate');
  console.log('4. Teste a nova feature');
  
} catch (error) {
  console.error('❌ Erro ao criar feature:', error.message);
  process.exit(1);
}
