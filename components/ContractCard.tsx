import React from 'react';
import { Contract } from '../types';

interface Props {
  contract: Contract;
  index: number;
  onUpdate: (updated: Contract) => void;
  onDelete: () => void;
}

const ContractCard: React.FC<Props> = ({ contract, index, onUpdate, onDelete }) => {
  return (
    <div className="border p-4 rounded-lg">
      <p>{contract.name}</p>
      <button onClick={onDelete}>Delete</button>
    </div>
  );
};

export default ContractCard;
