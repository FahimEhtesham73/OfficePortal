import { create } from "zustand";
// import { boardData } from "./Data";
 const boardData = {
  columns: [
    {
      id: 1,
      title: "Todo",
      cards: [
       
      ],
    },
    {
      id: 2,
      title: "In Progress",
      cards: [
        
      ],
    },
    {
      id: 3,
      title: "Pause",
      cards: [
       
      ],
    },
    {
      id: 4,
      title: "Done",
      cards: [
        
      ],
    },
  ],
};
const useBoard = create((set) => ({
  board: boardData,
  setBoard: (board) => set((state) => ({ ...state, board })),
  // setBackTo: (cardData, destination) => set((state)=> ({...state, columns: columns[destination].cards.push()}) )
}));

export default useBoard;