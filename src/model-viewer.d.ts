// TypeScript declaration for Google's <model-viewer> web component
// See: https://modelviewer.dev/

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        poster?: string;
        loading?: 'auto' | 'lazy' | 'eager';
        reveal?: 'auto' | 'manual';
        'auto-rotate'?: boolean | '';
        'camera-controls'?: boolean | '';
        'shadow-intensity'?: string;
        'environment-image'?: string;
        exposure?: string;
        'camera-orbit'?: string;
        'min-camera-orbit'?: string;
        'max-camera-orbit'?: string;
        'field-of-view'?: string;
        'interaction-prompt'?: 'auto' | 'none';
        ar?: boolean | '';
        'ar-modes'?: string;
      },
      HTMLElement
    >;
  }
}
