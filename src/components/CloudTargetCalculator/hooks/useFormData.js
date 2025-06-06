import { useReducer } from 'react';

const initialState = {
  ramp: 1,
  growth: 0,
  churn: 0,
  baseline: 0,
  targetSpend: 1000,
  targetRevenue: 78000,
  pctAcq: 50,
  months: 12,
  startMonth: 0,
  startYear: 2025,
  seasonalToggle: true,
  currency: 'USD',
  mqlPerSql: 5,
  sqlPerWin: 3,
};

function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export default function useFormData() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const update = (field, value) => dispatch({ type: 'UPDATE', field, value });
  const reset  = () => dispatch({ type: 'RESET' });
  return [state, update, reset];
}