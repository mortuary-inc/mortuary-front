import React from 'react';
import ContentLoader, { IContentLoaderProps } from 'react-content-loader';

const HeaderPlaceHolder = (props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode }) => (
  <ContentLoader width={'100%'} height={'100%'} viewBox="0 0 832 176" backgroundColor="#f3f3f3" foregroundColor="#ecebeb" {...props}>
    <rect x="0" y="0" rx="10" ry="10" width={'832'} height={'176'} />
  </ContentLoader>
);

export default HeaderPlaceHolder;
