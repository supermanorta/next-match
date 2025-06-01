"use client";

import { ListNameSchema } from "@/lib/schemas/editList";
import {
  Stack,
  Card,
  Text,
  Header,
  Title,
  Content,
  Input,
  Editable,
  EditableView,
  List,
  Button,
  Icon,
  MteInput,
} from "@applocal/react";
import { useFieldArray, useForm } from "react-hook-form";
import { ListTypeA, ListTypeB } from "@/components/admin/ListMenuWrapper";
import { PRODUCE_DEPT_ID } from "@/lib/constants";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { updateListName } from "@/app/actions/adminActions";
import EditListEntry from "./EditListEntry";
import { listDefinitionSchema, ListDefinitionSchema } from "@/lib/schemas/listDefinitionSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export type EditListMenuProps = {
  selectedListName: string;
  selectedListObject: ListTypeA;
  isNameEditable?: boolean;
  editListNameLabel?: string;
  buttonText?: string;
  listItems: ListTypeB;
  listTitle?: string;
  enabledSw?: string;
};

const contentWidth = 482;

export default function EditListMenu({
  selectedListName,
  isNameEditable,
  buttonText,
  listTitle,
  selectedListObject,
  listItems,
}: EditListMenuProps) {
  let filteredList: ListTypeB | { source: any }[] | undefined = undefined;
  const [listName, setListName] = useState(selectedListName);
  const [listNameError, setListNameError] = useState<string | undefined>();
  const pathname = usePathname();
  const listNameInputRef = useRef<MteInput>(null);
  const isDoorMgmt = pathname == "/admin/door-mgmt";
  let buttonDefaultValue = "New Value";

  // Filter the list based on the source
  filteredList = filterListBySource();
//Current logic that works AA
  // const { register, control, getValues, setValue,reset } = useForm({
  //   defaultValues: { selListItems: filteredList as ListTypeB ?? [ ]},
  //   mode:"onChange"
  // });

    const {register, handleSubmit, watch, getValues, reset ,setValue,setError,control,
          formState: {errors, isLoading, isValid, isSubmitting} } = useForm<ListDefinitionSchema>({
    defaultValues: {
      description: '',
      selListItems: filteredList as ListTypeB ?? [ ]
    },
    resolver: zodResolver(listDefinitionSchema),
    mode: "onChange"
  });

  useEffect(() => {
    // AA
    //setValue("selListItems", filteredList as ListTypeB);
      setListName(selectedListName);
    if(filteredList && filteredList.length >0){
      reset(
        {
          description:'',
          selListItems: filteredList,
        }
      )
    }


  }, [filteredList]);
  // }, [selectedListObject, selectedListName]);

  const router = useRouter();
  const { fields, prepend } = useFieldArray({ name: "selListItems", control });

  if (selectedListObject[0].source == "rejn_rsn_defn") {
    isNameEditable = false;
  } else if (selectedListObject[0].source == "dock_door_defn") {
    buttonDefaultValue = "New Door Name";
    //TODO: push the switch value down so that it is nulled out
  }

  return (
    <>
      <Stack>
        {/* Top card content */}
        <Card
          elevation="z2"
          radius="sm"
          withShadow
          className="border-[1px] border-[#D8D9D9] border-solid px-[24px] py-[16px] w-[530px] h-[755px]  2xl:h-[1100px]"
        >
          <div className="self-stretch h-[52px] px-2 inline-flex justify-between items-center">
            <Header className="p-0">
              <Title
                fontWeight="medium"
                h="52"
                w={contentWidth}
                className="pt-2 justify-center text-black text-xl font-semibold font-['Open_Sans'] leading-7"
              >
                {listTitle ? listTitle : "Edit List"}
              </Title>
            </Header>
          </div>
          <div className="mt-2 mb-2"></div>
          <div className="pb-3">
            <Text className="justify-center text-black text-sm font-bold font-['Open_Sans'] leading-7">
              List Name
            </Text>
            {isNameEditable ? (
              <form id="listName">
                <Editable onSave={handleListNameSave}>
                  <EditableView
                    withFullWidth
                    iconVisibility="none"
                    className="pl-0"
                  >
                    <Input
                      value={listName}
                      error={listNameError}
                      w={contentWidth}
                      sp={{
                        input: { background: "white" },
                        "form-field": { background: "white" },
                      }}
                      withoutMargin
                      withFullWidth
                      aria-label="Text Input"
                      readonly
                      className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight'"
                    >
                      <Icon
                        slot="suffix"
                        name="pencil"
                        color="primary"
                        className="h-[24px] w-[24px]"
                      />
                    </Input>
                  </EditableView>
                  <Input
                    placeholder={listName}
                    ref={listNameInputRef}
                    withoutMargin
                    withFullWidth
                    aria-label="Text Input"
                    slot="edit"
                    maxlength="50"
                    className="self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight border-[#D8D9D9]"
                  >
                    <Icon
                      slot="suffix"
                      name="pencil"
                      color="primary"
                      className="h-[16px] w-[16px]"
                    />
                  </Input>
                </Editable>
              </form>
            ) : (
              <Input
                sp={{
                  input: { background: "#EDEDED" },
                  "form-field": { background: "#EDEDED" },
                }}
                value={listName}
                readonly
                withoutMargin
                withFullWidth
                className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight"
              ></Input>
            )}
          </div>

          {/* Main card content */}
          <Card className="w-[495px] g-[907px]" radius="sm">
            <Content>
              <Stack direction="row">
                <Header
                  w={contentWidth}
                  className="font-['Open_Sans'] pl-1 text-xl font-semibold pr-8"
                >
                  <span className="w-[281px]">List Values</span>
                  <div>
                    {buttonText && (
                      <Button
                        size="lg"
                        color="primary"
                        radius="lg"
                        rightIcon="plus"
                        className="justify-right font-['Open_Sans'] font-[800px] text-xs/3 whitespace-nowrap ml-4 pl-[16px] pr-[16px] pt-[6px] pb-[6px] text-[13px]"
                        filled
                        // @ts-ignore
                        onClick={() =>
                          prepend({
                            value: buttonDefaultValue,
                            //@ts-ignore
                            id: selectedListObject[0].id,
                            deptId: PRODUCE_DEPT_ID,
                            source: selectedListObject[0].source,
                          })
                        }
                      >
                        {buttonText}
                      </Button>
                    )}
                  </div>
                </Header>
              </Stack>

              {/* Child List content */}
              <List gap={0} className="max-h-[475px] 2xl:max-h-[800px]">
                {fields?.map((field, index) => (
                  <div
                    {...register(`selListItems.${index}.value` as const)}
                    className={
                      isDoorMgmt
                        ? "form-control flex flex-row items-center w-auto"
                        : "form-control"
                    }
                    key={index}
                  >
                    <EditListEntry
                      control={control}
                      listEntry={
                        getValues(`selListItems.${index}`) as ListTypeB[0]
                      }
                      index={index}
                    ></EditListEntry>
                  </div>
                ))}
              </List>
            </Content>
          </Card>
        </Card>
      </Stack>
    </>
  );

  async function handleListNameSave(event: any) {
    event.preventDefault();
    const isValidListName = ListNameSchema.safeParse(
      listNameInputRef.current!.value,
    );
    console.log(isValidListName);

    if (!isValidListName.success) {
      setListNameError(isValidListName.error.errors[0].message);
    } else {
      // Remove any potential error state, save list name to DB, set UI state and force UI refresh.
      setListNameError(undefined);
      setListName(listNameInputRef.current!.value);
      await updateListName(
        selectedListObject[0].id!,
        listNameInputRef.current!.value,
      );
      router.refresh();
    }
  }

  function filterListBySource() {
    let filteredList = undefined;
    switch (selectedListObject[0].source) {
      case "rpc_all":
        filteredList = listItems;
        filteredList.sort((a, b) => a.value.localeCompare(b.value));
        break;
      case "rpc_type_defn":
        filteredList = listItems.filter((x) => x.source == "rpc_type_defn");
        break;
      case "rpc_sz_defn":
        filteredList = listItems.filter((x) => x.source == "rpc_sz_defn");
        break;
      case "rejn_rsn_defn":
        filteredList = listItems.filter((x) => x.source == "rej_rsn_defn");
        break;
      case "sel_list_defn":
        filteredList = listItems.filter(
          (x) =>
            x.id == selectedListObject[0].id &&
            x.source == "sel_list_defn" &&
            x.keyId,
        );
        break;
      case "dock_door_defn":
        filteredList = listItems.filter(
          (typeB) =>
            typeB.id == selectedListObject[0].id &&
            typeB.source == "dock_door_defn",
        );
        break;
      default:
        console.log("Unknown source type");
    }
    return filteredList;
  }
}
// function zodResolver(listDefinitionSchema: any): import("react-hook-form").Resolver<ListDefinitionSchema, any, ListDefinitionSchema> | undefined {
//   throw new Error("Function not implemented.");
// }