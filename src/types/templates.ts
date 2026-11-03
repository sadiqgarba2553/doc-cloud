import { PageSettings, HeaderFooterContent } from './layout';

export interface DocumentTemplate {
  id: string;
  title: string;
  category: 'General' | 'Business' | 'Academic' | 'Personal' | 'Project';
  description: string;
  iconName: string;
  settings: Partial<PageSettings>;
  headerFooter?: Partial<HeaderFooterContent>;
  initialContent: any; // ProseMirror JSON content
}
