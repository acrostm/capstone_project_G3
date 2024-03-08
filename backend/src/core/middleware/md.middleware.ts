import { BadRequestException } from '@nestjs/common';
import { Injectable, NestMiddleware } from '@nestjs/common';
import * as showdown from 'showdown';
import * as cheerio from 'cheerio';
const converter: showdown.Converter = new showdown.Converter();

@Injectable()
export class MDMiddleware implements NestMiddleware {
  // 参数是固定的Request/Response/nest
  use(req: any, res: Response, next: () => void) {
    const { content } = req.body;
    if (content) {
      try {
        const html: string = converter.makeHtml(content);
        req.body.contentHtml = html;
        req.body.summary = toText(html);
      } catch (error) {
        throw new BadRequestException('markdown 格式错误');
      }
    }
    next();
  }
}

function toText(html, len = 30) {
  if (html != null) {
    const substr = html.replace(/<[^>]+>|&[^>]+;/g, '').trim();
    console.log('substr', substr);
    return substr.length < len ? substr : substr.substring(0, len) + '...';
  }
}
function getToc(html: string) {
  // 这个功能能前端做还是前端做
  // decodeEntities防止中文转化为unicdoe
  const $ = cheerio.load(html, { decodeEntities: false });

  // 用count生成自定义id
  let hArr: any[] = [],
    highestLvl: number,
    count = 0;
  $('h1, h2, h3, h4, h5, h6').each(function () {
    const id = `h${count}`;
    count++;
    $(this).attr('id', id);
    const lvl: number = Number($(this).get(0).tagName.substr(1));
    if (!highestLvl) highestLvl = lvl;
    console.log('lvl:', lvl, highestLvl);
    hArr.push({
      hLevel: lvl - highestLvl + 1,
      content: $(this).html(),
      id: id,
    });
  });
  console.log('hArr:', hArr);
}

function toTree(flatArr) {
  const result = [];
  const stack = []; // 栈数组
  let collector = result; // 收集器

  flatArr.forEach(
    (
      item: { children: any[]; parentCollector: any[]; hLevel: number },
      index: any,
    ) => {
      if (stack.length === 0) {
        // 第一次循环
        stack.push(item);
        collector.push(item);

        item.children = [];
        item.parentCollector = result;

        // 改变收集器为当前级别的子集
        collector = item.children;
      } else {
        const topStack = stack[stack.length - 1];

        if (topStack.hLevel >= item.hLevel) {
          // 说明不能作为其子集
          const outTrack = stack.pop(); // 移除栈顶元素
          stack.push(item);

          // 当前
        }
      }
    },
  );
}
