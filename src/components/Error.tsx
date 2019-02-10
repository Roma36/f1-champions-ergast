import React, { Props } from 'react';

export default function Error({ children }: Props<any>) {
  return <span style={{ color: 'red' }}>{children}</span>;
}
