import 'zx/globals';
import pinyin from 'pinyin';

(async () => {
  const filePath = path.join(__dirname, '../README.md');
  const content = fs.readFileSync(filePath, 'utf-8').split('\n');
  let start = 0;
  let end = 0;
  content.forEach((line, index) => {
    if (line.startsWith('> 排名不分先后')) start = index + 2;
    if (line.startsWith('## 不活跃开发者')) end = index - 1;
  });
  const list = content.slice(start, end);
  // compare by key
  list.sort((a, b) => {
    return getKey(a) > getKey(b) ? 1 : -1;
  });
  // console.log(list.join('\n'));
  const newContent = [
    ...content.slice(0, start),
    ...list,
    ...content.slice(end),
  ];
  fs.writeFileSync(filePath, newContent.join('\n'), 'utf-8');
})();

// const lineCache: Record<string, string> = {};

function getKey(line: string) {
  // if (lineCache[line]) return lineCache[line];
  const name = getName(line);
  let key;
  // why? 拼音库有问题
  if (name === '辟起') {
    key = 'piqi';
  } else if (isChineseChars(name)) {
    key = pinyin(name, {
      style: pinyin.STYLE_NORMAL,
    }).join('');
  } else {
    key = name;
  }
  key = key.toLowerCase();
  console.log('> ', name, key);
  // lineCache[line] = key;
  return key;
}

function getName(line: string) {
  return line.match(/\[(.+?)\]/)![1];
}

function isEnglishChars(str: string) {
  return /^[a-zA-Z]+$/.test(str);
}

function isChineseChars(str: string) {
  return /^[\u4e00-\u9fa5]+$/.test(str);
}
