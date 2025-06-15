"use client";

import { Suspense, useState } from "react";
import ListMenu from "./ListMenu";
import { Center, Stack } from "@appLocal/react";
import EditListMenu from "./EditListMenu";
import CreateListModalForm from "@/components/admin/CreateListModalForm";


export type ListTypeA = {
  id: number | null;
  value: string;
  source: string;
}[];

export type ListTypeB = {
  id: number;
  value: string;
  keyId: number;
  deptId: number;
  source: string;
}[];

type ListMenuProps<T> = {
  title: string;
  buttonText?: string;
  items: T[] | undefined;
  editTitle: string;
  editButtonText?: string;
  editListNameLabel?: string;
  editListItems: ListTypeA | ListTypeB;
  isNameEditable: boolean;
};

export default function ListMenuWrapper< T extends Record<string | number, any>,>({
  title,
  buttonText,
  items,
  editTitle,
  editButtonText,
  editListNameLabel,
  editListItems,
  isNameEditable,
}: ListMenuProps<T>) {
  const [selectedListTypeAObject, setSelectedListTypeAObject] = useState<ListTypeA>([
    {
      id: null,
      value: "",
      source: "",
    },
  ]);
  const [addListButtonClicked, setAddListButtonClicked] = useState(false);

  function handleAddListButtonClicked(prev: boolean) {
    console.log(prev);
    setAddListButtonClicked(!prev);
  }
  console.log(selectedListTypeAObject[0])

  return (
    <>
      <Center className="p-[24px]">
        <Stack direction="row" className="flex items-start gap-x-[32px]">
          {/* Builds out 1st Menu seen by the user and builds out the selectedListTypeAObject */}
          <ListMenu
            title={title}
            buttonText={buttonText}
            items={items}
            selectedListObject={selectedListTypeAObject}
            setSelectedListObject={setSelectedListTypeAObject}
            addButtonClickHandler={setAddListButtonClicked}
          />
          <Suspense fallback={<p>Loading</p>}>
           
            { selectedListTypeAObject[0].id && (   
                  <EditListMenu
                    selectedListName={selectedListTypeAObject[0].value.toString()}
                    listTitle={editTitle}
                    editListNameLabel={editListNameLabel}
                    isNameEditable={isNameEditable}
                    buttonText={
                      selectedListTypeAObject[0].source == "rpc_all" ? "" : editButtonText
                    }
                    selectedListObject={selectedListTypeAObject}
                    listItems={editListItems as ListTypeB}
                  />)
            }
          </Suspense>
          

          {addListButtonClicked && (
            <CreateListModalForm
              title="Add New List"
              parentInputFieldLabel="List Name"
              setAddListButtonClicked={setAddListButtonClicked}
              isOpened={addListButtonClicked}
            />
          )}
        </Stack>
      </Center>
    </>
  );
}