import figlet from 'figlet';
// 使用 figlet 打印 logo
export function logLogo() {
  console.log('\r\n' + figlet.textSync('Gsemir', {
    font: 'Ghost',
    horizontalLayout: 'default',
    verticalLayout: 'default',
    whitespaceBreak: true,
    width: 80,
  }))
}