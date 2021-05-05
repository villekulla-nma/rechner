// @ts-check

/**
 * @typedef {Object} Unit
 * @property {string} unit
 * @property {number} exact
 * @property {string} rounded
 */

/** @type {string} */
const STRATEGY_EXACT = 'exact';

/** @type {string} */
const STRATEGY_ROUNDED = 'rounded';

/** @type {Record<number, number>} */
const units = {
  0.1: 0.073394152,
  0.2: 0.146800784,
  1.1: 0.136454966,
  2.1: 0.128517765,
  3.1: 0.13812727,
  3.2: 0.161888954,
  4.1: 0.126483545,
  4.2: 0.088332564,
};

/** @type {HTMLElement | null} */
const form = document.getElementById('calculator');

/** @type {HTMLElement | null} */
const amountInput = document.getElementById('amount');

/** @type {HTMLElement | null} */
const strategySelect = document.getElementById('strategy');

/** @type {HTMLElement | null} */
const devianceElement = document.getElementById('deviance');

/**
 * @param {string} unit
 * @param {number} value
 * @returns {void}
 */
const updateValue = (unit, value) => {
  requestAnimationFrame(() =>
    Object.assign(document.getElementById(`result-${unit}`), {
      value,
    })
  );
};

/**
 * @param {number} totalValue
 * @returns {Unit[]}
 */
const computeShares = (totalValue) =>
  Object.entries(units).map(([unit, share]) => {
    const result = totalValue * share;

    return {
      exact: result,
      rounded: result.toFixed(2),
      unit,
    };
  });

/**
 * @param {number} totalValue
 * @param {Unit[]} shares
 * @returns {number}
 */
const computeDeviance = (totalValue, shares) => {
  const sum = shares.reduce((acc, { exact }) => acc + exact, 0);

  return totalValue - sum;
};

/**
 * @param {number} deviance
 * @returns {void}
 */
const printDeviance = (deviance) => {
  requestAnimationFrame(() => {
    devianceElement.textContent = String(deviance);
  });
};

/**
 * @param {Event} event
 */
const preventSubmit = (event) => {
  event.preventDefault();
};

const handleChange = () => {
  if (
    amountInput instanceof HTMLInputElement &&
    strategySelect instanceof HTMLSelectElement
  ) {
    const totalAmount = amountInput.value.trim()
      ? parseFloat(amountInput.value.trim())
      : 0;
    const shares = computeShares(totalAmount);

    printDeviance(computeDeviance(totalAmount, shares));

    shares.forEach((share) =>
      updateValue(share.unit, share[strategySelect.value])
    );
  }
};

form.addEventListener('submit', preventSubmit);
amountInput.addEventListener('input', handleChange);
strategySelect.addEventListener('change', handleChange);
