const mimeType: { [key: string]: string } = {
  // 🔤 文本类扩展
  '.txt': 'text/plain',
  '.text': 'text/plain',
  '.log': 'text/plain',
  '.ini': 'text/plain',
  '.conf': 'text/plain',
  '.env': 'text/plain',

  // 📄 Markdown
  '.md': 'text/markdown',
  '.markdown': 'text/markdown',

  // 🧮 CSV / TSV
  '.csv': 'text/csv',
  '.tsv': 'text/tab-separated-values',

  // 💻 编程相关文本
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.json': 'application/json',
  '.xml': 'application/xml',
  '.yaml': 'application/yaml',
  '.yml': 'application/yaml',
  '.toml': 'application/toml',

  // 📄 富文本格式
  '.rtf': 'application/rtf',

  // 🎨 图片类
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.avif': 'image/avif',

  // 🎵 音频类
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.aac': 'audio/aac',
  '.opus': 'audio/opus',

  // 🎬 视频类
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogv': 'video/ogg',
  '.mov': 'video/quicktime',
  '.avi': 'video/x-msvideo',
  '.mkv': 'video/x-matroska',

  // 📁 归档压缩
  '.zip': 'application/zip',
  '.rar': 'application/x-rar-compressed',
  '.7z': 'application/x-7z-compressed',
  '.tar': 'application/x-tar',
  '.gz': 'application/gzip',
  '.bz2': 'application/x-bzip2',
  '.xz': 'application/x-xz',
  '.zst': 'application/zstd',

  // 📄 文档类
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  '.odt': 'application/vnd.oasis.opendocument.text',
  '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
  '.odp': 'application/vnd.oasis.opendocument.presentation',

  // 🌐 网页与脚本
  '.html': 'text/html',
  '.htm': 'text/html',
  '.css': 'text/css',
  '.scss': 'text/x-scss',
  '.sass': 'text/x-sass',
  '.less': 'text/x-less',
  '.php': 'application/x-httpd-php',
  '.asp': 'application/x-asp',
  '.aspx': 'application/x-aspx',

  // 🚀 字体
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',

  // 📱 移动端
  '.apk': 'application/vnd.android.package-archive',
  '.ipa': 'application/octet-stream',

  // 🗂️ 其他通用
  '.exe': 'application/x-msdownload',
  '.sh': 'application/x-sh',
  '.bat': 'application/x-msdownload',
  '.cmd': 'application/x-msdownload',
  '.ps1': 'application/octet-stream',
  '.app': 'application/octet-stream',
}

export default mimeType
