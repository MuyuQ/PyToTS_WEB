/// <reference path="../.astro/types.d.ts" />

declare module 'virtual:starlight/components/SiteTitle' {
  import type { AstroComponentFactory } from 'astro/runtime/server';
  const SiteTitle: AstroComponentFactory;
  export default SiteTitle;
}

declare module 'virtual:starlight/components/Search' {
  import type { AstroComponentFactory } from 'astro/runtime/server';
  const Search: AstroComponentFactory;
  export default Search;
}

declare module 'virtual:starlight/components/LanguageSelect' {
  import type { AstroComponentFactory } from 'astro/runtime/server';
  const LanguageSelect: AstroComponentFactory;
  export default LanguageSelect;
}

declare module 'virtual:starlight/components/SocialIcons' {
  import type { AstroComponentFactory } from 'astro/runtime/server';
  const SocialIcons: AstroComponentFactory;
  export default SocialIcons;
}