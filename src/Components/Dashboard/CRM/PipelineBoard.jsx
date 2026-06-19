import { useState } from "react";

import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

import "./PipelineBoard.css";

function PipelineBoard() {

  const [columns, setColumns] =
    useState({
      new: {
        name: "🆕 New Leads",
        items: [
          {
            id: "1",
            name: "Samsung India"
          },
          {
            id: "2",
            name: "ABC Retail"
          }
        ]
      },

      contacted: {
        name: "📞 Contacted",
        items: [
          {
            id: "3",
            name: "Fresh Mart"
          }
        ]
      },

      qualified: {
        name: "✅ Qualified",
        items: [
          {
            id: "4",
            name: "Tech World"
          }
        ]
      },

      proposal: {
        name: "📄 Proposal",
        items: []
      },

      won: {
        name: "🏆 Won",
        items: []
      }
    });

  const onDragEnd = (result) => {

    if (!result.destination) return;

    const source =
      columns[result.source.droppableId];

    const destination =
      columns[result.destination.droppableId];

    if (source === destination) {

      const copiedItems =
        [...source.items];

      const [removed] =
        copiedItems.splice(
          result.source.index,
          1
        );

      copiedItems.splice(
        result.destination.index,
        0,
        removed
      );

      setColumns({
        ...columns,
        [result.source.droppableId]: {
          ...source,
          items: copiedItems
        }
      });

    } else {

      const sourceItems =
        [...source.items];

      const destItems =
        [...destination.items];

      const [removed] =
        sourceItems.splice(
          result.source.index,
          1
        );

      destItems.splice(
        result.destination.index,
        0,
        removed
      );

      setColumns({
        ...columns,

        [result.source.droppableId]: {
          ...source,
          items: sourceItems
        },

        [result.destination.droppableId]: {
          ...destination,
          items: destItems
        }
      });
    }
  };

  return (

    <DragDropContext
      onDragEnd={onDragEnd}
    >

      <div className="pipeline-board">

        {Object.entries(columns).map(
          ([id, column]) => (

            <div
              className="pipeline-column"
              key={id}
            >

              <h3>
                {column.name}
              </h3>

              <Droppable
                droppableId={id}
              >
                {(provided) => (

                  <div
                    className="drop-zone"
                    ref={
                      provided.innerRef
                    }
                    {...provided.droppableProps}
                  >

                    {column.items.map(
                      (
                        item,
                        index
                      ) => (

                        <Draggable
                          key={item.id}
                          draggableId={
                            item.id
                          }
                          index={index}
                        >
                          {(
                            provided
                          ) => (

                            <div
                              ref={
                                provided.innerRef
                              }
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="pipeline-card"
                            >
                              {item.name}
                            </div>

                          )}
                        </Draggable>

                      )
                    )}

                    {
                      provided.placeholder
                    }

                  </div>

                )}
              </Droppable>

            </div>

          )
        )}

      </div>

    </DragDropContext>
  );
}

export default PipelineBoard;