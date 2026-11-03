import { Node, mergeAttributes } from '@tiptap/core';

export interface ResizableImageOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    resizableImage: {
      setImage: (options: {
        src: string;
        alt?: string;
        title?: string;
        width?: number | string;
        height?: number | string;
        alignment?: 'left' | 'center' | 'right';
        caption?: string;
      }) => ReturnType;
    };
  }
}

export const ResizableImage = Node.create<ResizableImageOptions>({
  name: 'resizableImage',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: 'auto',
      },
      height: {
        default: 'auto',
      },
      alignment: {
        default: 'center',
      },
      caption: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-type="resizable-image"]',
        getAttrs: dom => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLElement;
          const img = element.querySelector('img');
          const figcaption = element.querySelector('figcaption');
          return {
            src: img?.getAttribute('src'),
            alt: img?.getAttribute('alt'),
            title: img?.getAttribute('title'),
            width: img?.getAttribute('width') || element.style.width || 'auto',
            height: img?.getAttribute('height') || 'auto',
            alignment: element.getAttribute('data-alignment') || 'center',
            caption: figcaption?.textContent || '',
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: dom => {
          if (typeof dom === 'string') return {};
          const element = dom as HTMLImageElement;
          return {
            src: element.getAttribute('src'),
            alt: element.getAttribute('alt'),
            title: element.getAttribute('title'),
            width: element.getAttribute('width') || 'auto',
            height: element.getAttribute('height') || 'auto',
            alignment: 'center',
            caption: '',
          };
        },
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    const { src, alt, title, width, height, alignment, caption } = node.attrs;

    const alignClass =
      alignment === 'left'
        ? 'mr-auto text-left'
        : alignment === 'right'
        ? 'ml-auto text-right'
        : 'mx-auto text-center';

    const styleStr = [
      width && width !== 'auto' ? `width: ${typeof width === 'number' ? `${width}px` : width}` : '',
      height && height !== 'auto' ? `height: ${typeof height === 'number' ? `${height}px` : height}` : '',
    ]
      .filter(Boolean)
      .join('; ');

    const children: any[] = [
      [
        'img',
        {
          src,
          alt: alt || '',
          title: title || '',
          class: 'rounded-md shadow-sm max-w-full inline-block object-contain',
          style: styleStr,
        },
      ],
    ];

    if (caption) {
      children.push([
        'figcaption',
        { class: 'text-xs text-slate-500 dark:text-slate-400 mt-1 italic' },
        caption,
      ]);
    }

    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-type': 'resizable-image',
        'data-alignment': alignment,
        class: `doc-image-figure my-4 flex flex-col ${alignClass}`,
      }),
      ...children,
    ];
  },

  addCommands() {
    return {
      setImage:
        options =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
