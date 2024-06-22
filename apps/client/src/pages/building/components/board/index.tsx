import { OfficesOnFloor } from '@shared';
import { FC } from 'react';
import DisplayBoard from './display';
import EditBoard from './edit';

const Board: FC<{ offices: OfficesOnFloor[]; edit?: boolean }> = ({
  offices,
  edit,
}) => {
  if (!edit) return <DisplayBoard offices={offices} />;
  else
    return (
      <div className="h-screen w-screen p-10">
        <EditBoard></EditBoard>
      </div>
    );
};

export default Board;
