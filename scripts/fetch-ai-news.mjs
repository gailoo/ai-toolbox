import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const SOURCES = [
  {
    name: 'TechCrunch AI',
    region: 'Global',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    tags: ['startup', 'product', 'global'],
  },
  {
    name: 'The Decoder',
    region: 'Global',
    url: 'https://the-decoder.com/feed/',
    tags: ['research', 'models', 'global'],
  },
  {
    name: 'MIT Technology Review AI',
    region: 'Global',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/',
    tags: ['research', 'policy', 'global'],
  },
  {
    name: 'VentureBeat AI',
    region: 'Global',
    url: 'https://venturebeat.com/category/ai/feed/',
    tags: ['enterprise', 'startup', 'global'],
  },
  {
    name: 'Google AI Blog',
    region: 'Global',
    url: 'https://blog.google/technology/ai/rss/',
    tags: ['big-tech', 'models', 'global'],
  },
  {
    name: 'Hugging Face Blog',
    region: 'Global',
    url: 'https://huggingface.co/blog/feed.xml',
    tags: ['open-source', 'models', 'developer'],
  },
];

const FALLBACK_NEWS = [
  {
    title: 'AI 资讯源暂未刷新：请运行 npm run fetch:news 获取最新内容',
    link: '#',
    source: 'AI Toolbox',
    region: 'Local',
    publishedAt: new Date().toISOString(),
    summary: '这是本地兜底内容。联网成功后，脚本会从 TechCrunch、MIT Technology Review、The Decoder、VentureBeat、Google AI Blog 等公开 RSS 源抓取最新 AI 行业资讯。',
    tags: ['local', 'fallback'],
  },
];

function decodeHtml(input = '') {
  return input
    .replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function getTag(block, tagNames) {
  for (const tag of tagNames) {
    const match = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    if (match) return decodeHtml(match[1]);
  }
  return '';
}

function getLink(block) {
  const href = block.match(/<link[^>]*href=["']([^"']+)["'][^>]*>/i)?.[1];
  if (href) return href.trim();
  return getTag(block, ['link']);
}

function parseDate(value) {
  if (!value) return new Date(0).toISOString();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date(0).toISOString() : date.toISOString();
}

function parseFeed(xml, source) {
  const blocks = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const entryRegex = /<entry[\s\S]*?<\/entry>/gi;
  let match;

  while ((match = itemRegex.exec(xml))) blocks.push(match[0]);
  while ((match = entryRegex.exec(xml))) blocks.push(match[0]);

  return blocks.map((block) => {
    const title = getTag(block, ['title']);
    const link = getLink(block);
    const summary = getTag(block, ['description', 'summary', 'content:encoded', 'content']);
    const publishedAt = parseDate(getTag(block, ['pubDate', 'published', 'updated', 'dc:date']));

    return {
      title,
      link,
      source: source.name,
      region: source.region,
      publishedAt,
      summary: summary.slice(0, 220),
      tags: source.tags,
    };
  }).filter((item) => item.title && item.link);
}

async function fetchSource(source) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(source.url, {
      signal: controller.signal,
      headers: {
        'user-agent': 'AI-Toolbox-NewsBot/1.0 (+https://ai-toolbox.dev)',
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    return parseFeed(xml, source);
  } catch (error) {
    console.warn(`[news] Failed to fetch ${source.name}: ${error.message}`);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function dedupe(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = `${item.title.toLowerCase()}::${item.link}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function main() {
  const results = await Promise.all(SOURCES.map(fetchSource));
  const items = dedupe(results.flat())
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, 80);

  const news = items.length > 0 ? items : FALLBACK_NEWS;
  const payload = {
    generatedAt: new Date().toISOString(),
    sources: SOURCES.map(({ name, region, url, tags }) => ({ name, region, url, tags })),
    items: news,
  };

  const output = join(process.cwd(), 'src/data/news.json');
  await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
  console.log(`[news] Wrote ${news.length} items to ${output}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
