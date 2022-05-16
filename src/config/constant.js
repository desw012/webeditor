export const BLOCK_TAGS = [
    'address', 'article', 'aside', 'audio', 'blockquote',
    'canvas', 'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
    'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav',
    'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
    'thead', 'tr', 'ul', 'video', 'body'
];

/**
 * BLOCK 노드
 */
export const BLOCK_NODE = [
    'BODY',
    'DIV', 'P', 'TABLE', 'PRE',
    'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
    'TH', 'TD'
]

/**
 * TABLE 노드
 */
export const TABLE_NODE  = [
    'TABLE', 'THEAD', 'TBODY', 'TFOOT',
    'TR', 'TH', 'TD'
]

/**
 * TABLE 노드 중 BLOCK 노드로 대체 가능한 노드
 */
export const BLOCK_CANDIDATE_NODE = [
    'TH', 'TD', 'BODY'
]

export const INLINE_NODE_STYLE_DISPLAY = [
    "inline", "inline-block", "inline-table", "none"
]

export const NOT_SPLIT_NODE = [
    'HTML', 'HEAD', 'BODY'
    , 'TABLE', 'THEAD', 'TBODY', 'TFOOT'
    , 'TR', 'TH', 'TD'
]

export const TOOLBAR_SEPARATOR = 'SEPARATOR';