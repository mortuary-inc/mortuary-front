import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

const TitlePlaceHolder = (props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode }) => (
  <ContentLoader width={'100%'} height={'100%'} viewBox="0 0 500 80" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <rect x="50" y="0" rx="5" ry="5" width={'400'} height={'32'} />
    <rect x="0" y="48" rx="5" ry="5" width={'500'} height={'32'} />
  </ContentLoader>
);

export default TitlePlaceHolder;
