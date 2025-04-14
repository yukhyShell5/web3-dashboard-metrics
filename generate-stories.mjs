import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.join(__dirname, 'src');

const reservedWords = new Set([
  'switch', 'default', 'class', 'export', 'import', 'return', 'const', 'let', 'var',
  'new', 'function', 'extends', 'super', 'try', 'catch', 'throw', 'case', 'break'
]);

function toPascalCase(str) {
  return str
    .replace(/[-_](.)/g, (_, c) => c.toUpperCase()) // alert-dialog → alertDialog
    .replace(/^(.)/, (_, c) => c.toUpperCase());    // alertDialog → AlertDialog
}

function safeComponentName(name) {
  const pascal = toPascalCase(name);
  return reservedWords.has(name) ? `${pascal}Component` : pascal;
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function generateStory(componentPath) {
  const parsed = path.parse(componentPath);
  const originalName = parsed.name;
  const componentName = safeComponentName(originalName);
  const dir = parsed.dir;

  if (
    originalName.endsWith('.stories') ||
    originalName === 'index' ||
    parsed.ext === '.d.ts'
  ) return;

  const storyPath = path.join(dir, `${originalName}.stories.tsx`);
  if (fs.existsSync(storyPath)) return;

  const relativeImportPath = `./${originalName}`;
  const relativeToSrc = path.relative(path.join(__dirname, 'src'), dir);
  const folderTitle = relativeToSrc.split(path.sep).map(segment =>
    segment.charAt(0).toUpperCase() + segment.slice(1)
  ).join('/');

  const title = `${folderTitle}/${componentName}`;

  const content = `import type { Meta, StoryObj } from '@storybook/react';
import { ${componentName} as ${componentName} } from '${relativeImportPath}';

const meta: Meta<typeof ${componentName}> = {
  title: '${title}',
  component: ${componentName},
};

export default meta;
type Story = StoryObj<typeof ${componentName}>;

export const Default: Story = {
  args: {
    // Ajoutez vos props ici
  },
};
`;

  fs.writeFileSync(storyPath, content, 'utf8');
  console.log(`✅ Créé : ${path.relative(process.cwd(), storyPath)}`);
}

walkDir(baseDir, filePath => {
  if (filePath.endsWith('.tsx')) {
    generateStory(filePath);
  }
});
