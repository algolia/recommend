import React from 'react';

const GridView = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '15px',
      }}
    >
      {props.items.map((item, i) => {
        return (
          <>
            <props.itemComponent item={item} index={i} />
          </>
        );
      })}
    </div>
  );
};

export default GridView;
