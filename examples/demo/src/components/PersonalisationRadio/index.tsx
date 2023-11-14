import React from 'react';

export const PersonalisationRadio = ({
  value,
  onChange,
  userToken,
  setUserToken,
}) => {
  const onValueChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    onChange(event.target.value);
  };

  return (
    <div className="personalisation_wrapper">
      Personalisation:{' '}
      <input
        type="radio"
        id="disabled"
        value="disabled"
        name="personalisation"
        checked={value === 'disabled'}
        onChange={onValueChange}
      />{' '}
      <label htmlFor="disabled">Disabled</label>
      <input
        type="radio"
        id="re-rank"
        value="re-rank"
        name="personalisation"
        checked={value === 're-rank'}
        onChange={onValueChange}
      />{' '}
      <label htmlFor="re-rank">Re-rank</label>
      <input
        type="radio"
        id="filters"
        value="filters"
        name="personalisation"
        checked={value === 'filters'}
        onChange={onValueChange}
      />{' '}
      <label htmlFor="filters">Filters</label>{' '}
      <input
        disabled={value === 'disabled'}
        value={value === 'disabled' ? 'N/A' : userToken}
        onChange={(e) => setUserToken(e.target.value)}
      />
    </div>
  );
};
