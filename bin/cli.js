#!/usr/bin/env node
import chalk from 'chalk';
import { program } from 'commander';
import create from '../lib/create.js';
import { logLogo } from '../lib/log-logo.js';

// 配置 create 命令
program
  .command('create <app-name>') // 创建项目
  .description('指定项目名称') // 描述
  .option('-f, --force', '覆盖已存在的目录') // 命令选项
  .action(async (name, options) => { // 具体实现
    logLogo()
    // 执行创建逻辑
    create(name, options)
  });

// 配置 usage 命令
program
  .usage('<command> [options]')

// 监听 --help 命令
program.on('--help', () => {
  logLogo()
  console.log(`\r\nRun ${chalk.cyan('gsemir-cli <command> --help')} for detailed usage of given command.\r\n`)
})

program.parse(process.argv);
