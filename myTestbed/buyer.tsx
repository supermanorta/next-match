import { DockDoor } from '@/app/actions/dbActions';
import { Stack, Card, Title, Input, Text, Content, Button, List, Editable, EditableView, Icon } from '@appLocal/react';
import { Suspense, useEffect, useState } from 'react';
import EditListEntry from './EditListEntry';
import {  ListTypeB } from '@/lib/types/CommonTypes';
import { Buyer_SOURCE } from '@/lib/constants';
import { useRouter } from 'next/router';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { list } from 'postcss';
//TODO: need to more this somewhere where we can call this globally for any edit items since its used in this class and editListEntry
const contentWidth = 482;

export type EditListMenuProps<T> = {
    selectedListName: string;
    selectedTypeAListObject: T;
    isNameEditable?: boolean;
    editListNameLabel?: string;
    buttonText?: string;
    listBTypeItems: ListTypeB;
    listTitle?: string;
    enabledSw?: string;
};

interface Email {
    id: number;
    subject: string;
    body: string;
    sender: string;
    timestamp: string;
}

interface EmailData {
    emails: Email[];
}


type ListTypeBValue = {
  id: number;
  value: string;
  keyId?: number;
  deptId: number;
  source: string;
  enabledSw?: string;
};

// EditBuyerexport default function EditBuyer({ BuyerList }: { BuyerList: DockDoor[] }) {
export default function EditBuyerUI<T extends Record<string | number, any> | undefined>({
selectedListName,
isNameEditable,
buttonText,
listTitle,
selectedTypeAListObject,
listBTypeItems,
}: EditListMenuProps<T>) {
    console.log('listBTypeItems',listBTypeItems);
    const filteredChildItems = listBTypeItems.filter(item => item.id == selectedTypeAListObject?.Buyer_cd);
    const buttonDefaultValue = "Type Email of User";
    const searchParams = useSearchParams();
    const deptIdURL = searchParams.get('deptId')?? '999';
    // Add the list to the form as the defualt value
    const {register, control, getValues, setValue, reset} = useForm({
        defaultValues: {
            selListItems: filteredChildItems,
            Buyer_Description: selectedTypeAListObject?.desc,
        },
    });

    // need to reset default values when selectedItem changes
    useEffect(() => {
        reset({
            selListItems: filteredChildItems,
            Buyer_Description: selectedTypeAListObject?.desc,
        })
        // setValue("selListItems", listBTypeItems as ListTypeB); // might be causing a mismatch of data, filter compared to regualr list
    }, [selectedTypeAListObject, selectedListName,reset]);
    let tempy 
    // const router = useRouter();
    const {fields, remove, prepend} = useFieldArray({name: "selListItems", control});
    
    
    //  console.log('list type filteredChildItems items', filteredChildItems);
//   console.log('list type fields items', fields);
    // console.log('list type (selListItemsgetValues) items', getValues('selListItems') );
    if(getValues('selListItems').length == 0){
        console.log('list type (selListItemsgetValues) items has no items');
       let tempy = 
        {
            id: selectedListName.split("-")[0] as string,
            value: '',
            deptId: deptIdURL,
            source: Buyer_SOURCE,
        };
       prepend({
        id: selectedListName.split("-")[0] as string,
        value: '',
        deptId: Number(deptIdURL),
        source: Buyer_SOURCE,
    });
       console.log('list type (selListItemsgetValues) : tempy', tempy );
       console.log('list type (selListItemsgetValues) items', getValues('selListItems') );
    }else{
        console.log('list type (selListItemsgetValues) items', getValues('selListItems') );
    }

    return (<>
        {/* <Stack> */}
        <Card elevation='z2' w='530' h='1119' radius='sm' withShadow
              className='border-[1px] border-[#D8D9D9] border-solid px-[24px] py-[16px]'>
            <div className='self-stretch h-[52px] px-2 inline-flex justify-between items-center'>
                <Title fontWeight='medium' h='52' w={contentWidth} className="pt-2 justify-center text-black text-xl font-semibold font-['Open_Sans'] leading-7">
                    {/* TODO; Dynamic "Edit List", "Edit Door" ... */}
                    Buyer Email Group
                </Title>
                <div>
                    {
                      <Button
                          color='primary'
                          radius='lg'
                          rightIcon='plus'
                          className="justify-right font-['Open_Sans'] font-[800px] text-xs/3 whitespace-nowrap ml-4 pl-3 pr-3 pt-[6px] pb-[6px] text-[13px]"
                          filled
                          onClick = {() =>
                             //prepending expects keyId being present but for new records created it can not be  present. 
                            prepend({
                                  value: buttonDefaultValue,
                                  id: filteredChildItems[0]?.id,
                                  deptId: Number(deptIdURL),
                                  source: filteredChildItems[0]?.source,
                              })
                          }
                          >
                          {buttonText}
                      </Button>
                    }
                </div>
            </div>
            <div className='mt-2 mb-2'></div>
            <div className='pb-3'>
                <Input
                    label="Buyer Code"
                    readonly
                    withoutMargin
                    withFullWidth
                    w={contentWidth}
                    aria-label='Text Input'
                    value={selectedListName.split("-")[0]}
                    className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight'"
                    sp={{
                        input: {background: "#EDEDED"},
                        "form-field": {background: "#EDEDED"},
                    }}
                ></Input>
            </div>
            <div className='pb-3'>
                <Input
                    label="Buyer Name"
                    readonly
                    withoutMargin
                    withFullWidth
                    w={contentWidth}
                    aria-label='Text Input'
                    value={selectedListName.split("-")[1]}
                    className="pl: 0 self-stretch justify-start text-black text-sm font-normal font-['Open_Sans'] leading-tight'"
                    sp={{
                        input: {background: "#EDEDED"},
                        "form-field": {background: "#EDEDED"},
                    }}
                ></Input>
            </div>
            <div className='pb-3'>
                <Text className="justify-center text-black text-sm font-bold font-['Open_Sans'] leading-7">Buyer Description</Text>
                <Controller
                    name="Buyer_Description"
                    control={control}
                    defaultValue={selectedListName[1].length > 0 ? selectedListName.split("-")[2] : 'Description...'}
                    // defaultValue={'Description...'}
                    // defaultValue={  }


                    render={
                        ({field}) => (

                            <Editable
                                actionsPlacement={"center"}
                                actionsPosition={"right"}
                                className="flex p-0"
                                color="primary"
                                se={{border: '1px solid black'}}>
                                <EditableView iconVisibility="always"
                                              className="h-[40px] self-stretch  text-[14px] pl-[4px] font-['Open_Sans'] w-[480px] outline outline-1 outline-[#D8D9D9]">
                                    {field.value}
                                </EditableView>
                                <Input
                                    // this tracks any changes that happen in this editable input, no need to set value='' like you normal would
                                    {...field}
                                    withoutMargin
                                    withFullWidth
                                    slot="edit"
                                    w={contentWidth}
                                    aria-label='Text Input'
                                    className="pl: 0 self-stretch justify-start text-sm font-normal rounded-sm font-['Open_Sans'] leading-tight'">
                                    <Icon
                                        slot="suffix"
                                        name="pencil"
                                        color="primary"
                                        className="h-[24px] w-[24px]"
                                    />
                                </Input>
                            </Editable>
                        )
                    }
                />
                {/* </Controller> */}
            </div>
           
            <List gap={0} className="max-h-[475px] 2xl:max-h-[800px]">
                {fields?.map((field, index) => (
                    <div className={"form-control"}   key={field.id}>
                        {fields.length > 0 ? (
                            <Suspense>
                                <Controller
                                name={`selListItems.${index}.value`}
                                control={control}
                                render={({field})=>
                                
                                    <EditListEntry
                                        // listEntry={ field.value as unknown as ListTypeBValue}
                                        listEntry={ getValues(`selListItems.${index}`) as  ListTypeB[0] } // this does not match the filteredChildItems so when we prepend there is a issue.
                                        index={index}
                                        setValue={setValue}
                                        control={control}
                                    ></EditListEntry>
                                }
                                />
                            </Suspense>
                        ) : (
                            <p>No Data</p>
                        )}
                    </div>
                ))}
            </List>
        </Card>
        {/* </Stack> */}
    </>);
}



    