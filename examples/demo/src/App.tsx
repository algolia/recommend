import { HorizontalSlider } from '@algolia/ui-components-horizontal-slider-react';
import React from 'react';

import { items, ProductHit } from './items';

import '@algolia/ui-components-horizontal-slider-theme';
import './App.css';
import './Hit.css';

type HitProps = {
  item: ProductHit;
};

function Hit({ item }: HitProps) {
  return (
    <a
      className="Hit Hit-link"
      href={item.url}
      onClick={(event) => {
        event.preventDefault();
      }}
    >
      <div className="Hit-Image">
        <img src={item.imageLink} alt={item.name} />
      </div>

      <div className="Hit-Content">
        <div className="Hit-Name">{item.name}</div>
        <div className="Hit-Description">{item.objectID}</div>

        <div className="Hit-Price">${item.price}</div>
      </div>
    </a>
  );
}

function App() {
  return (
    <div className="container">
      <h1>Algolia UI Components Horizontal Slider for React</h1>
      <HorizontalSlider items={items} itemComponent={Hit} />
    </div>
  );
}
export default App;
