import React from 'react';
import ReactHtmlParser, { convertNodeToElement } from 'react-html-parser';
import styles from './styles.module.less';

export const SanitizeHTML = ({ html }) =>
{
  function transform (node, index) {
    if (node.type === 'tag' && node.name === 'a') {
      node.attribs.target = '_blank';
      node.attribs.rel = 'noreferrer';
      return convertNodeToElement(node, index, transform);
    }
  }

  return (
    <div tabIndex="0" className={styles.sanitizeHtml}>
      {
        /*eslint-disable */
        ReactHtmlParser(html, {
          decodeEntities: true,
          transform
        })
      }
    </div>
  );
}
