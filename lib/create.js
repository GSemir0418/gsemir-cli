import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import inquirer from 'inquirer';
import { execSync } from 'child_process';
import { logLogo } from './log-logo.js';

// 准备绝对路径，用于复制模版配置文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建逻辑
async function create(name, options) {
  const cwd = process.cwd(); // 用户执行命令的目录
  const targetDir = path.join(cwd, name); // 目标目录
  // 如果存在，询问是否覆盖（删除）
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir);
    } else {
      // 询问用户是否确定覆盖
      const { confirm } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirm',
          message: '目录已存在，是否覆盖？',
        }
      ])
      if (!confirm) {
        return;
      }
      await fs.remove(targetDir);
    }
  }

  // 使用 execSync 执行 npm 命令，创建 vite 基础项目
  console.log('\r\n> 正在创建基础模版...\r\n');
  execSync(`npm init vite@latest ${name} -- --template react-ts`, { stdio: 'inherit' })

  // 提供选项：是否选择 zustand？
  const { zustand } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'zustand',
      message: '是否选择 zustand？',
    }
  ])
  if (zustand) {
    await addZustand(targetDir)
  }
  // 提供选项：是否选择 antfu-eslint？
  const { antfuEslint } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'antfuEslint',
      message: '是否选择 antfu-eslint？',
    }
  ])
  if (antfuEslint) {
    await addAntfuEslint(targetDir)
  }

  // 完成后提示用户
  logLogo()
  console.log('> 创建完成')
  console.log('> cd ' + name)
  console.log('> npm install')
  console.log('> npm run dev')
}

// 添加 zustand 依赖
async function addZustand(projectDir) {
  // 更新 package.json
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.dependencies.zustand = "^5.0.0-rc.2"; // 使用最新的稳定版本
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  console.log('\r\n> 已添加 zustand\r\n');
}

// 添加 antfu-eslint
async function addAntfuEslint(projectDir) {
  // 1. 更新 package.json 的 devDependencies 与 scripts
  const packageJsonPath = path.join(projectDir, 'package.json');
  const packageJson = await fs.readJson(packageJsonPath);
  // 清除原来所有带有 eslint 的依赖
  packageJson.devDependencies = packageJson.devDependencies || {};
  for (const key in packageJson.devDependencies) {
    if (key.includes('eslint')) {
      delete packageJson.devDependencies[key];
    }
  }
  packageJson.devDependencies.eslint = "^9.12.0";
  packageJson.devDependencies["@antfu/eslint-config"] = "^3.7.3";
  packageJson.scripts.lint = "eslint .";
  packageJson.scripts["lint:fix"] = "eslint . --fix";
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  // 2. 创建 eslint.config.js 文件，如果存在则覆盖
  const eslintConfigPath = path.join(projectDir, 'eslint.config.js');
  if (fs.existsSync(eslintConfigPath)) {
    await fs.remove(eslintConfigPath);
  }
  const eslintConfigContent = `import antfu from '@antfu/eslint-config'

export default antfu()`;
  await fs.writeFile(eslintConfigPath, eslintConfigContent);

  // 3. 创建 .vscode/settings.json 文件
  const vscodeDir = path.join(projectDir, '.vscode');
  await fs.ensureDir(vscodeDir);
  const vscodeSettingsPath = path.join(vscodeDir, 'settings.json');
  const vscodeSettingsContent = await fs.readFile(path.join(__dirname, '../templates/antfu-eslint/vscfg.json'), 'utf8');
  await fs.writeFile(vscodeSettingsPath, vscodeSettingsContent);

  console.log('\r\n> 已添加 vscode 配置\r\n');
}

export default create;
