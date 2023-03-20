import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

const InstagramPlaceHolder = (props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode }) => (
  <ContentLoader viewBox="0 0 400 460" {...props}>
    <rect x="60" y="0" width="130" height="28" rx="8" />
    <rect x="200" y="0" width="130" height="28" rx="8" />
    <rect x="10" y="45" rx="13" ry="13" width="370" height="370" />
  </ContentLoader>
);

export default InstagramPlaceHolder;
