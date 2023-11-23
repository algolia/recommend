import React from 'react';

export const PersonalisationRadio = ({
  value,
  onChange,
  userToken,
  setUserToken,
  personalisationVersion,
  setPersonalisationVersion,
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
      <div>
        <fieldset>
          <legend>Personalisation technology</legend>
          <div>
            <input
              type="checkbox"
              id="personalisation-v1"
              name="personalisation-v1"
              disabled={value === 'disabled'}
              checked={personalisationVersion === 'v1'}
              onChange={() => setPersonalisationVersion('v1')}
            />
            <label htmlFor="personalisation-v1">Personalisation v1</label>
          </div>

          <div>
            <input
              type="checkbox"
              id="neural-perso"
              name="neural-perso"
              disabled={value === 'disabled'}
              checked={personalisationVersion === 'neural-perso'}
              onChange={() => setPersonalisationVersion('neural-perso')}
            />
            <label htmlFor="neural-perso">NeuralPerso</label>
          </div>
        </fieldset>
      </div>
    </div>
  );
};
