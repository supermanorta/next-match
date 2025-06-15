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
    MteInput, Box, Skeleton,
} from "@appLocal/react";
import { useFieldArray, useForm } from "react-hook-form";
import { ListTypeA, ListTypeB } from "@/components/admin/ListMenuWrapper";
import {
    Buyer_SOURCE,
    DOCK_DOOR_SOURCE,
    PRODUCE_DEPT_ID,
    REJN_RSN_SOURCE,
    RPC_ALL_SOURCE,
    RPC_SIZE_SOURCE,
    RPC_TYPE_SOURCE,
    SEL_LIST_SOURCE,
    VENDOR_EST_NUMBER_SOURCE,
} from "@/lib/constants";
import { Suspense, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { updateListName } from "@/app/actions/adminActions";
import EditListEntry from "./EditListEntry";
import EditBuyerUI from "./BuyerEditUI";

export type EditListMenuProps<T> = {
    selectedListName: string;
    selectedListObject: T;
    isNameEditable?: boolean;
    editListNameLabel?: string;
    buttonText?: string;
    listItems: ListTypeB;
    listTitle?: string;
    enabledSw?: string;
};

const contentWidth = 482;

export default function EditListMenu<T extends Record<string | number, any>>({
    selectedListName,
    isNameEditable,
    buttonText,
    listTitle,
    selectedListObject,
    listItems,
}: EditListMenuProps<T>) {
    const searchParams = useSearchParams();
    const deptIdURL = searchParams.get('deptId')?? '999';
    let filteredList: ListTypeB | { source: any }[] | undefined = undefined;
    const [listName, setListName] = useState(selectedListName);
    const [listNameError, setListNameError] = useState<string | undefined>();
    const pathname = usePathname();
    const listNameInputRef = useRef<MteInput>(null);
    const isDoorMgmt = pathname == "/admin/door-mgmt";
    let buttonDefaultValue = "New Value";
    const [isLoading, setIsLoading] = useState(true);

    // Filter the list based on the source
    filteredList = filterListBySource();

// Add the list to the form as the defualt value
    const {register, control, getValues, setValue} = useForm({
        defaultValues: {
            selListItems: filteredList as ListTypeB,
            departmentURL:deptIdURL,
        },
    });

    useEffect(() => {
        setValue("selListItems", filteredList as ListTypeB);
        setListName(selectedListName);
        setIsLoading(false);
        setValue("departmentURL",deptIdURL);
    }, [selectedListObject, selectedListName]);

    const router = useRouter();
    const {fields,remove, prepend} = useFieldArray({name: "selListItems", control});

    if (selectedListObject.source == "rejn_rsn_defn") {
        isNameEditable = false;
    } else if (selectedListObject.source == "dock_door_defn") {
        buttonDefaultValue = "New Door Name";
        //TODO: push the switch value down so that it is nulled out
    }

    console.log('SELECTED LIST OBJ:', selectedListObject)
    return (
        <>
            {isLoading ? (
                <Stack row gap="6" className="mt-2">
                    {/* Default */}
                    <Card elevation='z1' w="476" h="800" radius="sm" className="border-[#D8D9D9] border-solid">
                        <Box p="1" mb={35}>
                            <Skeleton width="150" h={25} withLineOptions={true}></Skeleton>
                        </Box>
                        <Skeleton
                            shape={'rect'}
                            lines={12}
                            height="550"
                            width="444"
                            className="mt-2 ml-2"
                        >
                        </Skeleton>
                    </Card>
                </Stack>
            ) : (
                <Stack>
                    {selectedListObject.source === Buyer_SOURCE ? (
                            <EditBuyerUI
                                selectedListName={selectedListObject.value.toString()}
                                isNameEditable={isNameEditable}
                                buttonText={buttonText}
                                listTitle={listTitle}
                                selectedTypeAListObject={selectedListObject}
                                listBTypeItems={listItems}
                            />
                        )
                        : (
                            <Card
                                elevation="z1"
                                radius="sm"
                                withShadow
                                className="border-[1px] border-solid border-[#EDEDED] p-[16px] w-[476px] h-[755px] 2xl:h-[1100px]">

                                <Title
                                    fontWeight="medium"
                                    w={contentWidth}
                                    className="pt-[16px] text-black text-xl font-semibold font-['Open_Sans'] leading-7 h-[52px]">
                                    {listTitle ? listTitle : "Edit List"}
                                </Title>


                                <div>
                                    <Text
                                        className="justify-center text-black text-sm font-bold font-['Open_Sans'] leading-7">
                                        {setListNameLabel()}

                                    </Text>
                                    {isNameEditable ? (
                                        <form id="listName">
                                            <Editable onSave={handleListNameSave}>
                                                <EditableView
                                                    withFullWidth
                                                    iconVisibility="none"
                                                    className="pl-0 flex"
                                                >
                                                    <Input
                                                        value={listName}
                                                        error={listNameError}
                                                        sp={{
                                                            input: {background: "white"},
                                                            "form-field": {background: "white"},
                                                        }}
                                                        withoutMargin
                                                        aria-label="Text Input"
                                                        readonly
                                                        className="pl-0 flex-1 w-[442px] self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight"
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
                                                ></Input>
                                            </Editable>
                                        </form>
                                    ) : (
                                        <Input
                                            sp={{
                                                input: {background: "#EDEDED"},
                                                "form-field": {background: "#EDEDED"},
                                            }}
                                            value={listName}
                                            readonly
                                            role={'input'}
                                            withoutMargin
                                            withFullWidth
                                            className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight read-only"
                                        ></Input>
                                    )}
                                </div>

                                {/* Main card content */}
                                <Card elevation='z0' className="w-auto h-full pt-[28px] pl-0 pr-0" radius="sm">
                                    <Content>
                                        <Stack direction="row">
                                            <Header
                                                w={contentWidth}
                                                className="font-['Open_Sans'] pl-0 text-xl font-semibold pr-8 pt-[24px] pb-[34px] h-[40px]"
                                            >
                                                <span className="w-[310px]">List Values</span>
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
                                                                    id: selectedListObject.id,
                                                                    keyId: selectedListObject.keyId,
                                                                    deptId: Number(deptIdURL),
                                                                    source: selectedListObject.source,
                                                                })
                                                            }
                                                        >
                                                            {buttonText}
                                                        </Button>
                                                    )}
                                                </div>
                                            </Header>
                                        </Stack>
                                    </Content>

                                    {/* Child List content */}

                                    <List gap={0} className="max-h-[475px] 2xl:max-h-[800px]">
                                        {fields?.map((field, index) => (
                                            <div {...register(`selListItems.${index}.value` as const)}
                                                 className={
                                                     isDoorMgmt
                                                         ? "form-control flex flex-row items-center w-auto"
                                                         : "form-control"
                                                 }
                                                /* The field.id (and not index) must be added as the component key to prevent re-renders breaking the fields */
                                                 key={field.id}>

                                                {fields.length > 0 ? (
                                                    <Suspense>
                                                        <EditListEntry
                                                            listEntry={
                                                                getValues(`selListItems.${index}`) as ListTypeB[0]
                                                            }
                                                            index={index}
                                                            setValue={setValue}
                                                            removeItemFromForm={remove}
                                                            control={control}
                                                        ></EditListEntry>
                                                    </Suspense>
                                                ) : (
                                                    <p>No Data</p>
                                                )}
                                            </div>
                                        ))}
                                    </List>
                                </Card>
                            </Card>
                        )
                    }
                </Stack>
            )
            }
        </>
    );


    async function handleListNameSave(event: any) {
        event.preventDefault();
        const isValidListName = ListNameSchema.safeParse(
            listNameInputRef.current!.value,
        );

        if (!isValidListName.success) {
            setListNameError(isValidListName.error.errors[0].message);
        } else {
            // Remove any potential error state, save list name to DB, set UI state and force UI refresh.
            setListNameError(undefined);
            setListName(listNameInputRef.current!.value);
            await updateListName(
                selectedListObject.id!,
                listNameInputRef.current!.value,
            );
            router.refresh();
        }
    }

    function filterListBySource() {
        let filteredList = undefined;
        switch (selectedListObject.source) {
            case RPC_ALL_SOURCE:
                filteredList = listItems;
                filteredList.sort((a, b) => a.value.localeCompare(b.value));
                break;
            case RPC_TYPE_SOURCE:
                filteredList = listItems.filter((x) => x.source == RPC_TYPE_SOURCE);
                break;
            case RPC_SIZE_SOURCE:
                filteredList = listItems.filter((x) => x.source == RPC_SIZE_SOURCE);
                break;
            case REJN_RSN_SOURCE:
                filteredList = listItems.filter((x) => x.source == REJN_RSN_SOURCE);
                break;
            case SEL_LIST_SOURCE:
                filteredList = listItems.filter(
                    (x) =>
                        x.id == selectedListObject.id &&
                        x.source == SEL_LIST_SOURCE &&
                        x.keyId,
                );
                break;
            case DOCK_DOOR_SOURCE:
                filteredList = listItems.filter((typeB) => (
                    typeB.id == selectedListObject.id &&
                    typeB.source == DOCK_DOOR_SOURCE
                ));
                break;
            case Buyer_SOURCE:
                filteredList = listItems.filter((x) => x.source == Buyer_SOURCE);
                // filteredList = listItems;
                break;
            case VENDOR_EST_NUMBER_SOURCE:
                filteredList = listItems.filter(
                    (x) => x.id == selectedListObject.id,
                );
                break;
            default:
                console.log(`Unknown source type ${selectedListObject.source}`);
        }
        return filteredList;
    }

    function setListNameLabel() {
        switch (selectedListObject.source) {
            case RPC_ALL_SOURCE:
            case RPC_TYPE_SOURCE:
            case RPC_SIZE_SOURCE:
                return "Type";
            case REJN_RSN_SOURCE:
            case SEL_LIST_SOURCE:
                return "List Name";
            case DOCK_DOOR_SOURCE:
                return "Location";
            case VENDOR_EST_NUMBER_SOURCE:
                return "Vendor";
        }
    }
}