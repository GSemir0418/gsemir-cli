### 简介

脚手架项目，用于快速搭建 vite react ts 项目

基础项目 [vite + react + typescript](https://www.vitejs.net/guide/#scaffolding-your-first-vite-project)

可选项 [zustand](https://zustand-demo.pmnd.rs/)、`axios`、[tailwind](https://tailwindcss.com/)、[antfu-eslint](https://github.com/antfu/eslint-config)、`antd`

### 使用

```bash
npx gsemir-cli create <app-name>
```

### 搭建思路

#### 交互

使用 [commander](https://github.com/tj/commander.js) 搭建命令行入口程序

使用 [inquirer](https://github.com/SBoudrias/Inquirer.js) 搭建交互式命令行程序

使用 [chalk](https://github.com/chalk/chalk) 美化控制台输出，[figlet](https://github.com/patorjk/figlet.js#readme) 打印 logo

#### 模版搭建与选择

根据用户的选择，将模版项目复制到用户目录下

由于可选项过多，为每种选择单独准备模版的工作量过大，

所以在使用脚手架时，只提供基础模版（使用 execSync 调用 vite 创建）

然后将可选项抽离为代码段（依赖、配置文件等）注入到模版中

#### 优化

TODO
